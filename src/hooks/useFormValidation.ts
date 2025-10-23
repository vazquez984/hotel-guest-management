// src/hooks/useFormValidation.ts

import { useState, useCallback } from 'react';
import { ValidationError, ValidationResult } from '../utils/validation';

interface UseFormValidationReturn {
  errors: ValidationError[];
  validateForm: (validationFn: () => ValidationResult) => boolean;
  clearErrors: () => void;
  setErrors: (errors: ValidationError[]) => void;
  hasError: (field: string) => boolean;
  getError: (field: string) => string | undefined;
}

export function useFormValidation(): UseFormValidationReturn {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateForm = useCallback((validationFn: () => ValidationResult): boolean => {
    const result = validationFn();
    setErrors(result.errors);
    return result.isValid;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const hasError = useCallback((field: string): boolean => {
    return errors.some(e => e.field.toLowerCase() === field.toLowerCase());
  }, [errors]);

  const getError = useCallback((field: string): string | undefined => {
    const error = errors.find(e => e.field.toLowerCase() === field.toLowerCase());
    return error?.message;
  }, [errors]);

  return {
    errors,
    validateForm,
    clearErrors,
    setErrors,
    hasError,
    getError
  };
}

// Ejemplo de uso:
// const { errors, validateForm, clearErrors } = useFormValidation();
// 
// const handleSubmit = () => {
//   const isValid = validateForm(() => validateGuest(formData));
//   if (isValid) {
//     // Proceder con el guardado
//   }
// };