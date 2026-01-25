module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/lib/navigation-config.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Navigation Configuration
 * 
 * Controls navigation behavior based on environment mode
 */ __turbopack_context__.s([
    "NAVIGATION_MODE",
    ()=>NAVIGATION_MODE,
    "PROTECTED_ROUTES",
    ()=>PROTECTED_ROUTES,
    "PUBLIC_ROUTES",
    ()=>PUBLIC_ROUTES,
    "isFreeNavigationEnabled",
    ()=>isFreeNavigationEnabled,
    "isProtectedRoute",
    ()=>isProtectedRoute,
    "isPublicRoute",
    ()=>isPublicRoute,
    "requiresAuthentication",
    ()=>requiresAuthentication
]);
const NAVIGATION_MODE = process.env.NEXT_PUBLIC_NAVIGATION_MODE || 'development';
const isFreeNavigationEnabled = ()=>{
    return NAVIGATION_MODE === 'development';
};
const PROTECTED_ROUTES = [
    '/dashboard',
    '/projects',
    '/users',
    '/settings',
    '/profile',
    '/inbox',
    '/logs'
];
const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/docs/swagger'
];
const isProtectedRoute = (path)=>{
    return PROTECTED_ROUTES.some((route)=>path.startsWith(route));
};
const isPublicRoute = (path)=>{
    return PUBLIC_ROUTES.some((route)=>path.startsWith(route));
};
const requiresAuthentication = (path)=>{
    // In development mode, no authentication required
    if (isFreeNavigationEnabled()) {
        return false;
    }
    // In production mode, check if route is protected
    return isProtectedRoute(path);
};
}),
"[project]/infrastructure/monitoring/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "monitoringProxy",
    ()=>monitoringProxy,
    "monitoringProxyConfig",
    ()=>monitoringProxyConfig
]);
function monitoringProxy(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    // Grafana dashboard proxy
    if (pathname.startsWith("/monitoring/grafana")) {
        const grafanaUrl = process.env.GRAFANA_URL || "http://localhost:3001";
        const newPath = pathname.replace("/monitoring/grafana", "") || "/";
        const grafanaApiUrl = new URL(newPath, grafanaUrl);
        // Copy query parameters
        url.searchParams.forEach((value, key)=>{
            grafanaApiUrl.searchParams.set(key, value);
        });
        // Prepare headers
        const headers = new Headers(request.headers);
        // Add Grafana authentication if configured
        const grafanaUser = process.env.GRAFANA_USER;
        const grafanaPassword = process.env.GRAFANA_PASSWORD;
        if (grafanaUser && grafanaPassword) {
            const auth = Buffer.from(`${grafanaUser}:${grafanaPassword}`).toString("base64");
            headers.set("Authorization", `Basic ${auth}`);
        }
        // Forward client info for Grafana analytics
        headers.set("X-Forwarded-For", request.headers.get("x-forwarded-for") || "");
        headers.set("X-Forwarded-Proto", request.headers.get("x-forwarded-proto") || "http");
        headers.set("X-Forwarded-Host", request.headers.get("host") || "");
        return new Request(grafanaApiUrl, {
            method: request.method,
            headers,
            body: request.body,
            redirect: "manual"
        });
    }
    // Prometheus API proxy
    if (pathname.startsWith("/monitoring/prometheus")) {
        const prometheusUrl = process.env.PROMETHEUS_URL || "http://localhost:9090";
        const newPath = pathname.replace("/monitoring/prometheus", "") || "/";
        const prometheusApiUrl = new URL(newPath, prometheusUrl);
        // Copy query parameters
        url.searchParams.forEach((value, key)=>{
            prometheusApiUrl.searchParams.set(key, value);
        });
        // Prepare headers
        const headers = new Headers(request.headers);
        // Forward client info
        headers.set("X-Forwarded-For", request.headers.get("x-forwarded-for") || "");
        headers.set("X-Webhook-URL", request.headers.get("x-webhook-url") || "");
        return new Request(prometheusApiUrl, {
            method: request.method,
            headers,
            body: request.body,
            redirect: "manual"
        });
    }
    // Loki logs proxy
    if (pathname.startsWith("/monitoring/loki")) {
        const lokiUrl = process.env.LOKI_URL || "http://localhost:3100";
        const newPath = pathname.replace("/monitoring/loki", "") || "/";
        const lokiApiUrl = new URL(newPath, lokiUrl);
        // Copy query parameters
        url.searchParams.forEach((value, key)=>{
            lokiApiUrl.searchParams.set(key, value);
        });
        // Prepare headers
        const headers = new Headers(request.headers);
        // Forward authentication for Loki
        const lokiToken = process.env.LOKI_TOKEN;
        if (lokiToken) {
            headers.set("Authorization", `Bearer ${lokiToken}`);
        }
        return new Request(lokiApiUrl, {
            method: request.method,
            headers,
            body: request.body,
            redirect: "manual"
        });
    }
    return null; // Let Next.js handle it
}
const monitoringProxyConfig = {
    matcher: [
        "/monitoring/:path*"
    ]
};
}),
"[project]/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.4_@babel+core@7.28.6_react-dom@19.2.3_react@19.2.3/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$navigation$2d$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/navigation-config.ts [middleware] (ecmascript)");
// Import specialized proxies
var __TURBOPACK__imported__module__$5b$project$5d2f$infrastructure$2f$monitoring$2f$proxy$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/infrastructure/monitoring/proxy.ts [middleware] (ecmascript)");
;
;
;
function proxy(request) {
    const { pathname } = request.nextUrl;
    // Debug logs (uniquement en développement)
    if ("TURBOPACK compile-time truthy", 1) {
        console.log("Middleware - pathname:", pathname);
        console.log("Middleware - NODE_ENV:", ("TURBOPACK compile-time value", "development"));
        console.log("Middleware - BACKEND_URL:", process.env.BACKEND_URL);
    }
    if (pathname.startsWith("/monitoring/")) {
        const monitoringRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$infrastructure$2f$monitoring$2f$proxy$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["monitoringProxy"])(request);
        if (monitoringRequest) {
            return fetch(monitoringRequest);
        }
    }
    // Ne pas intercepter les autres requêtes API ou /health
    if (pathname.startsWith("/api/") || pathname.startsWith("/health")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const publicPaths = [
        "/login",
        "/register",
        "/forgot-password"
    ];
    const isPublicPath = publicPaths.some((path)=>pathname.startsWith(path));
    const isAdminPath = pathname.startsWith("/admin");
    const token = request.cookies.get("authToken")?.value || request.headers.get("authorization")?.replace("Bearer ", "");
    if (!isPublicPath && !isAdminPath && (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$navigation$2d$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["requiresAuthentication"])(pathname) && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("returnUrl", pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    if (isPublicPath && token && !isAdminPath) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/dashboard", request.url));
    }
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return response;
}
const config = {
    matcher: [
        "/((?!api|_next|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2e39a761._.js.map