export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export class Validator {
  static isRequired(value: unknown): boolean {
    return value !== null && value !== undefined && value !== "";
  }

  static isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  static isUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  static isPort(value: string | number): boolean {
    const port = typeof value === "string" ? parseInt(value, 10) : value;
    return !isNaN(port) && port >= 1 && port <= 65535;
  }

  static minLength(value: string, min: number): boolean {
    return value.length >= min;
  }

  static maxLength(value: string, max: number): boolean {
    return value.length <= max;
  }

  static isAlphanumeric(value: string): boolean {
    return /^[a-zA-Z0-9-_]+$/.test(value);
  }

  static validateField<T>(value: T, rules: ValidationRule<T>[]): string | null {
    for (const rule of rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return null;
  }

  static validateObject<T extends Record<string, unknown>>(
    obj: T,
    rules: Partial<Record<keyof T, ValidationRule<unknown>[]>>
  ): Record<keyof T, string> | null {
    const errors: Partial<Record<keyof T, string>> = {};

    for (const [field, fieldRules] of Object.entries(rules)) {
      if (!fieldRules) continue;

      const value = obj[field as keyof T];
      for (const rule of fieldRules) {
        if (!rule.validate(value as never)) {
          errors[field as keyof T] = rule.message;
          break;
        }
      }
    }

    return Object.keys(errors).length > 0 ? (errors as Record<keyof T, string>) : null;
  }
}

export const authValidationRules = {
  email: [
    { validate: (v: unknown) => Validator.isRequired(v), message: "Email is required" },
    { validate: (v: unknown) => Validator.isEmail(v as string), message: "Invalid email format" },
  ],
  password: [
    { validate: (v: unknown) => Validator.isRequired(v), message: "Password is required" },
    {
      validate: (v: unknown) => Validator.minLength(v as string, 8),
      message: "Password must be at least 8 characters",
    },
  ],
};
