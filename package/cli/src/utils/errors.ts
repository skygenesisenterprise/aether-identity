export class CliError extends Error {
  constructor(
    message: string,
    public readonly code: string = "CLI_ERROR",
    public readonly statusCode: number = 1
  ) {
    super(message);
    this.name = "CliError";
  }
}

export class AuthError extends CliError {
  constructor(message: string) {
    super(message, "AUTH_ERROR", 1);
    this.name = "AuthError";
  }
}

export class ConfigError extends CliError {
  constructor(message: string) {
    super(message, "CONFIG_ERROR", 2);
    this.name = "ConfigError";
  }
}

export class ApiError extends CliError {
  constructor(
    message: string,
    public readonly apiCode?: string
  ) {
    super(message, "API_ERROR", 3);
    this.name = "ApiError";
  }
}

export class ValidationError extends CliError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 4);
    this.name = "ValidationError";
  }
}

export function handleError(error: unknown): { message: string; code: string } {
  if (error instanceof CliError) {
    return { message: error.message, code: error.code };
  }
  if (error instanceof Error) {
    return { message: error.message, code: "UNKNOWN_ERROR" };
  }
  return { message: "An unknown error occurred", code: "UNKNOWN_ERROR" };
}
