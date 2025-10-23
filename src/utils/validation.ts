// src/utils/validation.ts

export interface ValidationError {
    field: string;
    message: string;
  }
  
  export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
  }
  
  // Validaciones básicas
  export const isRequired = (value: any, fieldName: string): ValidationError | null => {
    if (value === null || value === undefined || value === '') {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    return null;
  };
  
  export const isPositiveNumber = (value: number, fieldName: string): ValidationError | null => {
    if (isNaN(value) || value <= 0) {
      return { field: fieldName, message: `${fieldName} must be a positive number` };
    }
    return null;
  };
  
  export const isValidDate = (dateString: string, fieldName: string): ValidationError | null => {
    if (!dateString) {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { field: fieldName, message: `${fieldName} must be a valid date` };
    }
    
    return null;
  };
  
  export const isDateAfter = (
    startDate: string,
    endDate: string,
    startFieldName: string,
    endFieldName: string
  ): ValidationError | null => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return {
        field: endFieldName,
        message: `${endFieldName} must be after ${startFieldName}`
      };
    }
    
    return null;
  };
  
  export const minLength = (
    value: string,
    min: number,
    fieldName: string
  ): ValidationError | null => {
    if (value && value.length < min) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${min} characters`
      };
    }
    return null;
  };
  
  export const maxLength = (
    value: string,
    max: number,
    fieldName: string
  ): ValidationError | null => {
    if (value && value.length > max) {
      return {
        field: fieldName,
        message: `${fieldName} must be at most ${max} characters`
      };
    }
    return null;
  };
  
  export const isEmail = (email: string, fieldName: string): ValidationError | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return { field: fieldName, message: `${fieldName} must be a valid email` };
    }
    return null;
  };
  
  export const isPhoneNumber = (phone: string, fieldName: string): ValidationError | null => {
    // Acepta varios formatos: +1234567890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (phone && (phone.length < 10 || !phoneRegex.test(phone))) {
      return { field: fieldName, message: `${fieldName} must be a valid phone number` };
    }
    return null;
  };
  
  // Validador de múltiples reglas
  export const validate = (rules: (() => ValidationError | null)[]): ValidationResult => {
    const errors: ValidationError[] = [];
    
    rules.forEach(rule => {
      const error = rule();
      if (error) {
        errors.push(error);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };