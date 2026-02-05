import type {
  ExpressMiddleware,
  ExpressRequest,
  ExpressResponse,
  NextFunction,
  UnauthorizedInfo,
} from "./types";
import type { ValidatedConfig } from "./config";
import { isContextMFARequired } from "./config";
import type { TokenCache } from "./cache";
import type { HookManager } from "./hooks";
import type { ServerHelpers } from "./helpers";

interface MiddlewareDependencies {
  config: ValidatedConfig;
  cache: TokenCache;
  hooks: HookManager;
  helpers: ServerHelpers;
}

class MiddlewareFactory {
  private deps: MiddlewareDependencies;

  constructor(deps: MiddlewareDependencies) {
    this.deps = deps;
  }

  authMiddleware(): ExpressMiddleware {
    return async (
      req: ExpressRequest,
      res: ExpressResponse,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const token = this.extractToken(req);

        if (!token) {
          await this.triggerUnauthorized(req, "No token provided");
          res
            .status(401)
            .json({ error: "Unauthorized", message: "No token provided" });
          return;
        }

        const validation = await this.deps.helpers.validateToken(token);

        if (!validation.valid || !validation.user) {
          await this.triggerUnauthorized(req, "Invalid token", token);
          res
            .status(401)
            .json({ error: "Unauthorized", message: "Invalid token" });
          return;
        }

        req.user = validation.user;
        req.token = token;
        req.context = validation.user.context;

        next();
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Authentication failed";
        await this.triggerUnauthorized(req, error);
        res.status(401).json({ error: "Unauthorized", message: error });
      }
    };
  }

  rbacMiddleware(roles: string[]): ExpressMiddleware {
    return async (
      req: ExpressRequest,
      res: ExpressResponse,
      next: NextFunction,
    ): Promise<void> => {
      const user = req.user;

      if (!user) {
        await this.triggerUnauthorized(
          req,
          "User not authenticated",
          req.token,
        );
        res
          .status(401)
          .json({ error: "Unauthorized", message: "User not authenticated" });
        return;
      }

      const hasRole = this.deps.helpers.hasRole(user, roles);

      const hookContext = this.deps.hooks.createBaseContext(
        req.ip || "unknown",
        this.getUserAgent(req),
        req.path,
      );

      await this.deps.hooks.triggerRoleCheck({
        ...hookContext,
        user,
        requiredRoles: roles,
        hasRole,
      });

      if (!hasRole) {
        const info: UnauthorizedInfo = {
          ip: req.ip || "unknown",
          userAgent: this.getUserAgent(req),
          timestamp: Date.now(),
          reason: "Insufficient role",
          path: req.path,
          attemptedRole: roles.join(", "),
          token: req.token,
        };
        await this.deps.hooks.triggerUnauthorizedAttempt(hookContext, info);

        res.status(403).json({
          error: "Forbidden",
          message: "Insufficient permissions",
        });
        return;
      }

      next();
    };
  }

  protectRoute(roles?: string[]): ExpressMiddleware {
    return async (
      req: ExpressRequest,
      res: ExpressResponse,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const token = this.extractToken(req);

        if (!token) {
          await this.triggerUnauthorized(req, "No token provided");
          res
            .status(401)
            .json({ error: "Unauthorized", message: "No token provided" });
          return;
        }

        const validation = await this.deps.helpers.validateToken(token);

        if (!validation.valid || !validation.user) {
          await this.triggerUnauthorized(req, "Invalid token", token);
          res
            .status(401)
            .json({ error: "Unauthorized", message: "Invalid token" });
          return;
        }

        req.user = validation.user;
        req.token = token;
        req.context = validation.user.context;

        if (roles && roles.length > 0) {
          const hasRole = this.deps.helpers.hasRole(validation.user, roles);

          const hookContext = this.deps.hooks.createBaseContext(
            req.ip || "unknown",
            this.getUserAgent(req),
            req.path,
          );

          await this.deps.hooks.triggerRoleCheck({
            ...hookContext,
            user: validation.user,
            requiredRoles: roles,
            hasRole,
          });

          if (!hasRole) {
            const info: UnauthorizedInfo = {
              ip: req.ip || "unknown",
              userAgent: this.getUserAgent(req),
              timestamp: Date.now(),
              reason: "Insufficient role",
              path: req.path,
              attemptedRole: roles.join(", "),
              token,
            };
            await this.deps.hooks.triggerUnauthorizedAttempt(hookContext, info);

            res.status(403).json({
              error: "Forbidden",
              message: "Insufficient permissions",
            });
            return;
          }
        }

        next();
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Authentication failed";
        await this.triggerUnauthorized(req, error);
        res.status(401).json({ error: "Unauthorized", message: error });
      }
    };
  }

  mfaMiddleware(): ExpressMiddleware {
    return async (
      req: ExpressRequest,
      res: ExpressResponse,
      next: NextFunction,
    ): Promise<void> => {
      const user = req.user;

      if (!user) {
        await this.triggerUnauthorized(
          req,
          "User not authenticated",
          req.token,
        );
        res
          .status(401)
          .json({ error: "Unauthorized", message: "User not authenticated" });
        return;
      }

      const requiresMFA = isContextMFARequired(
        user.context,
        this.deps.config.mfaRequired,
      );

      if (requiresMFA && !user.mfaVerified) {
        const hookContext = this.deps.hooks.createBaseContext(
          req.ip || "unknown",
          this.getUserAgent(req),
          req.path,
        );

        await this.deps.hooks.triggerMFARequired({
          ...hookContext,
          user,
          method: "totp",
        });

        res.status(403).json({
          error: "MFA Required",
          message: "Multi-factor authentication required",
          code: "MFA_REQUIRED",
        });
        return;
      }

      next();
    };
  }

  contextMiddleware(context: string): ExpressMiddleware {
    return async (
      req: ExpressRequest,
      res: ExpressResponse,
      next: NextFunction,
    ): Promise<void> => {
      const user = req.user;

      if (!user) {
        await this.triggerUnauthorized(
          req,
          "User not authenticated",
          req.token,
        );
        res
          .status(401)
          .json({ error: "Unauthorized", message: "User not authenticated" });
        return;
      }

      if (user.context !== context) {
        const info: UnauthorizedInfo = {
          ip: req.ip || "unknown",
          userAgent: this.getUserAgent(req),
          timestamp: Date.now(),
          reason: "Wrong context",
          path: req.path,
          token: req.token,
        };
        const hookContext = this.deps.hooks.createBaseContext(
          req.ip || "unknown",
          this.getUserAgent(req),
          req.path,
        );
        await this.deps.hooks.triggerUnauthorizedAttempt(hookContext, info);

        res.status(403).json({
          error: "Forbidden",
          message: `This endpoint requires ${context} context`,
        });
        return;
      }

      next();
    };
  }

  private extractToken(req: ExpressRequest): string | null {
    const headerValue = req.headers[this.deps.config.tokenHeader];
    return this.deps.helpers.extractTokenFromHeader(
      Array.isArray(headerValue) ? headerValue[0] : headerValue,
    );
  }

  private getUserAgent(req: ExpressRequest): string {
    const ua = req.headers["user-agent"];
    return Array.isArray(ua) ? ua[0] || "unknown" : ua || "unknown";
  }

  private async triggerUnauthorized(
    req: ExpressRequest,
    reason: string,
    token?: string,
  ): Promise<void> {
    const info: UnauthorizedInfo = {
      ip: req.ip || "unknown",
      userAgent: this.getUserAgent(req),
      timestamp: Date.now(),
      reason,
      path: req.path,
      token,
    };

    const hookContext = this.deps.hooks.createBaseContext(
      req.ip || "unknown",
      this.getUserAgent(req),
      req.path,
    );

    await this.deps.hooks.triggerUnauthorizedAttempt(hookContext, info);
  }
}

export { MiddlewareFactory };
export type { MiddlewareDependencies };
