// src/components/common/ErrorMessage.tsx

import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  field?: string;
  errors?: Array<{ field: string; message: string }>;
}

export default function ErrorMessage({ message, field, errors }: ErrorMessageProps) {
  // Si se proporciona un field específico, buscar el error correspondiente
  if (field && errors) {
    const fieldError = errors.find(e => e.field.toLowerCase() === field.toLowerCase());
    if (!fieldError) return null;
    
    return (
      <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        <span>{fieldError.message}</span>
      </div>
    );
  }
  
  // Si se proporciona un mensaje directo
  if (message) {
    return (
      <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        <span>{message}</span>
      </div>
    );
  }
  
  // Si se proporcionan múltiples errores sin field específico
  if (errors && errors.length > 0) {
    return (
      <div className="mt-2 space-y-1">
        {errors.map((error, index) => (
          <div key={index} className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{error.message}</span>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
}

// Componente de banner de error para mostrar todos los errores juntos
export function ErrorBanner({ errors }: { errors: Array<{ field: string; message: string }> }) {
  if (!errors || errors.length === 0) return null;
  
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900 mb-1">
            Please fix the following errors:
          </h3>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}