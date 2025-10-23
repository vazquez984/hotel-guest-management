// src/utils/guestValidation.ts

import { Guest } from '../lib/supabase';
import {
  validate,
  isRequired,
  isPositiveNumber,
  isValidDate,
  isDateAfter,
  minLength,
  maxLength,
  ValidationResult
} from './validation';

export const validateGuest = (guest: Partial<Guest>): ValidationResult => {
  return validate([
    // Family Name
    () => isRequired(guest.family_name, 'Family name'),
    () => minLength(guest.family_name || '', 2, 'Family name'),
    () => maxLength(guest.family_name || '', 100, 'Family name'),
    
    // Room Number
    () => isRequired(guest.room_number, 'Room number'),
    () => minLength(guest.room_number || '', 1, 'Room number'),
    () => maxLength(guest.room_number || '', 20, 'Room number'),
    
    // Pax (Number of guests)
    () => isRequired(guest.pax, 'Number of guests'),
    () => isPositiveNumber(guest.pax || 0, 'Number of guests'),
    () => {
      if (guest.pax && guest.pax > 20) {
        return { field: 'pax', message: 'Number of guests cannot exceed 20' };
      }
      return null;
    },
    
    // Country
    () => isRequired(guest.country, 'Country'),
    () => minLength(guest.country || '', 2, 'Country'),
    
    // Nights
    () => isRequired(guest.nights, 'Number of nights'),
    () => isPositiveNumber(guest.nights || 0, 'Number of nights'),
    () => {
      if (guest.nights && guest.nights > 365) {
        return { field: 'nights', message: 'Number of nights cannot exceed 365' };
      }
      return null;
    },
    
    // Check-in Date
    () => isRequired(guest.check_in_date, 'Check-in date'),
    () => isValidDate(guest.check_in_date || '', 'Check-in date'),
    
    // Check-out Date (opcional pero debe ser válida si existe)
    () => {
      if (guest.check_out_date) {
        return isValidDate(guest.check_out_date, 'Check-out date');
      }
      return null;
    },
    () => {
      if (guest.check_in_date && guest.check_out_date) {
        return isDateAfter(
          guest.check_in_date,
          guest.check_out_date,
          'Check-in date',
          'Check-out date'
        );
      }
      return null;
    },
    
    // Notes (opcional pero con límite)
    () => {
      if (guest.notes) {
        return maxLength(guest.notes, 1000, 'Notes');
      }
      return null;
    }
  ]);
};

export const validateAppointment = (appointment: {
  title: string;
  appointment_date: string;
  appointment_time: string;
}): ValidationResult => {
  return validate([
    () => isRequired(appointment.title, 'Title'),
    () => minLength(appointment.title, 3, 'Title'),
    () => isRequired(appointment.appointment_date, 'Appointment date'),
    () => isValidDate(appointment.appointment_date, 'Appointment date'),
    () => isRequired(appointment.appointment_time, 'Appointment time'),
    () => {
      // Validar formato de hora HH:MM
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(appointment.appointment_time)) {
        return { field: 'appointment_time', message: 'Time must be in HH:MM format' };
      }
      return null;
    }
  ]);
};

export const validateReservation = (reservation: {
  venue_name: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
}): ValidationResult => {
  return validate([
    () => isRequired(reservation.venue_name, 'Venue name'),
    () => minLength(reservation.venue_name, 2, 'Venue name'),
    () => isRequired(reservation.reservation_date, 'Reservation date'),
    () => isValidDate(reservation.reservation_date, 'Reservation date'),
    () => isRequired(reservation.reservation_time, 'Reservation time'),
    () => isRequired(reservation.party_size, 'Party size'),
    () => isPositiveNumber(reservation.party_size, 'Party size'),
    () => {
      if (reservation.party_size > 50) {
        return { field: 'party_size', message: 'Party size cannot exceed 50' };
      }
      return null;
    }
  ]);
};

export const validateSale = (sale: {
  made_purchase: boolean;
  purchase_amount?: number;
  purchase_date?: string;
}): ValidationResult => {
  if (!sale.made_purchase) {
    return { isValid: true, errors: [] };
  }
  
  return validate([
    () => isRequired(sale.purchase_amount, 'Purchase amount'),
    () => {
      if (sale.purchase_amount !== undefined) {
        return isPositiveNumber(sale.purchase_amount, 'Purchase amount');
      }
      return null;
    },
    () => {
      if (sale.purchase_amount && sale.purchase_amount > 1000000) {
        return { field: 'purchase_amount', message: 'Purchase amount seems too high' };
      }
      return null;
    },
    () => {
      if (sale.purchase_date) {
        return isValidDate(sale.purchase_date, 'Purchase date');
      }
      return null;
    }
  ]);
};

export const validateEvent = (event: {
  event_name: string;
  event_date?: string;
}): ValidationResult => {
  return validate([
    () => isRequired(event.event_name, 'Event name'),
    () => minLength(event.event_name, 3, 'Event name'),
    () => {
      if (event.event_date) {
        return isValidDate(event.event_date, 'Event date');
      }
      return null;
    }
  ]);
};