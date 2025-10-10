import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Guest = {
  id: string;
  family_name: string;
  room_number: string;
  pax: number;
  country: string;
  agency: string;
  nights: number;
  check_in_date: string;
  check_out_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type GuestEvent = {
  id: string;
  guest_id: string;
  event_name: string;
  has_access: boolean;
  attended: boolean;
  event_date: string | null;
  notes: string;
  created_at: string;
};

export type Appointment = {
  id: string;
  guest_id: string;
  title: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  location: string;
  status: string;
  notes: string;
  created_at: string;
};

export type Sale = {
  id: string;
  guest_id: string;
  appointment_id: string | null;
  attended_presentation: boolean;
  made_purchase: boolean;
  purchase_amount: number;
  purchase_date: string | null;
  payment_method: string;
  notes: string;
  created_at: string;
};

export type Reservation = {
  id: string;
  guest_id: string;
  reservation_type: string;
  venue_name: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: string;
  confirmation_number: string;
  notes: string;
  created_at: string;
};
