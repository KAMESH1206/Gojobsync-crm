// Reusable validation functions

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRequired(value: string | number | undefined | null, fieldName: string): ValidationError | null {
  if (value === undefined || value === null || String(value).trim() === '') {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
}

export function validateEmail(email: string | undefined | null, fieldName: string = 'Email'): ValidationError | null {
  if (!email || String(email).trim() === '') {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: fieldName, message: `Invalid ${fieldName.toLowerCase()} format` };
  }
  return null;
}

export function validatePhone(phone: string | undefined | null, fieldName: string = 'Phone'): ValidationError | null {
  if (!phone || String(phone).trim() === '') {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  
  // Basic phone validation (at least 10 digits, allows +, -, spaces, parentheses)
  const phoneRegex = /^[\d\s\+\-\(\)]{10,20}$/;
  if (!phoneRegex.test(phone)) {
    return { field: fieldName, message: `Invalid ${fieldName.toLowerCase()} format` };
  }
  return null;
}

export function validateNumber(value: string | number | undefined | null, fieldName: string, min?: number, max?: number): ValidationError | null {
  const isRequired = validateRequired(value, fieldName);
  if (isRequired) return isRequired;

  const num = Number(value);
  if (isNaN(num)) {
    return { field: fieldName, message: `${fieldName} must be a number` };
  }

  if (min !== undefined && num < min) {
    return { field: fieldName, message: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { field: fieldName, message: `${fieldName} must be at most ${max}` };
  }

  return null;
}

export function validateForm(fields: Record<string, any>, rules: Record<string, (val: any, field: string) => ValidationError | null>): Record<string, string> {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(key => {
    const error = rules[key](fields[key], key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'));
    if (error) {
      errors[key] = error.message;
    }
  });

  return errors;
}
