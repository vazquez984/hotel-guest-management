/*
  # Hotel Guest Management System Schema

  ## Overview
  Complete database schema for managing hotel guests, their reservations, appointments, 
  events, sales tracking, and concierge services.

  ## New Tables
  
  ### 1. `guests`
  Core guest information table storing all primary guest details.
  - `id` (uuid, primary key) - Unique guest identifier
  - `family_name` (text) - Guest family name
  - `room_number` (text) - Assigned room number
  - `pax` (integer) - Number of guests in party
  - `country` (text) - Country of origin
  - `agency` (text) - Booking agency name
  - `nights` (integer) - Number of nights staying
  - `check_in_date` (date) - Check-in date
  - `check_out_date` (date) - Check-out date
  - `notes` (text) - Special notes (birthdays, anniversaries, preferences)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `guest_events`
  Tracks guest access to hotel events (Welcome Party, Gala Dinner, House Tours).
  - `id` (uuid, primary key)
  - `guest_id` (uuid, foreign key) - References guests table
  - `event_name` (text) - Name of the event
  - `has_access` (boolean) - Whether guest has access to event
  - `attended` (boolean) - Whether guest attended
  - `event_date` (date) - Date of the event
  - `notes` (text) - Event-specific notes
  - `created_at` (timestamptz)

  ### 3. `appointments`
  Manages presentation and other appointment scheduling.
  - `id` (uuid, primary key)
  - `guest_id` (uuid, foreign key) - References guests table
  - `title` (text) - Appointment title (e.g., "Presentation")
  - `appointment_date` (date) - Appointment date
  - `appointment_time` (time) - Appointment time
  - `duration_minutes` (integer) - Duration in minutes
  - `location` (text) - Where the appointment takes place
  - `status` (text) - scheduled, completed, cancelled, no-show
  - `notes` (text) - Appointment notes
  - `created_at` (timestamptz)

  ### 4. `sales`
  Tracks presentation attendance and purchases.
  - `id` (uuid, primary key)
  - `guest_id` (uuid, foreign key) - References guests table
  - `appointment_id` (uuid, foreign key) - References appointments table
  - `attended_presentation` (boolean) - Did they attend?
  - `made_purchase` (boolean) - Did they purchase?
  - `purchase_amount` (decimal) - Purchase amount in USD
  - `purchase_date` (date) - Date of purchase
  - `payment_method` (text) - Payment method used
  - `notes` (text) - Sales notes
  - `created_at` (timestamptz)

  ### 5. `reservations`
  Manages restaurant and service reservations (concierge features).
  - `id` (uuid, primary key)
  - `guest_id` (uuid, foreign key) - References guests table
  - `reservation_type` (text) - restaurant, spa, tour, transportation, other
  - `venue_name` (text) - Name of restaurant/service
  - `reservation_date` (date) - Reservation date
  - `reservation_time` (time) - Reservation time
  - `party_size` (integer) - Number of people
  - `status` (text) - pending, confirmed, completed, cancelled
  - `confirmation_number` (text) - Confirmation reference
  - `notes` (text) - Special requests or notes
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Create policies for authenticated users to manage all records
  - All tables have proper indexes for performance
  - Foreign key constraints ensure data integrity

  ## Notes
  1. All timestamps default to current time
  2. Boolean fields default to false where applicable
  3. Status fields use text type for flexibility
  4. Decimal type used for monetary amounts
  5. Comprehensive indexing for performance
*/

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_name text NOT NULL,
  room_number text NOT NULL,
  pax integer NOT NULL DEFAULT 1,
  country text NOT NULL DEFAULT '',
  agency text DEFAULT '',
  nights integer NOT NULL DEFAULT 1,
  check_in_date date NOT NULL DEFAULT CURRENT_DATE,
  check_out_date date,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create guest_events table
CREATE TABLE IF NOT EXISTS guest_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  has_access boolean DEFAULT false,
  attended boolean DEFAULT false,
  event_date date,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  title text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  duration_minutes integer DEFAULT 60,
  location text DEFAULT '',
  status text DEFAULT 'scheduled',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  attended_presentation boolean DEFAULT false,
  made_purchase boolean DEFAULT false,
  purchase_amount decimal(10, 2) DEFAULT 0,
  purchase_date date,
  payment_method text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  reservation_type text NOT NULL DEFAULT 'restaurant',
  venue_name text NOT NULL,
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  party_size integer NOT NULL DEFAULT 2,
  status text DEFAULT 'pending',
  confirmation_number text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_guests_room_number ON guests(room_number);
CREATE INDEX IF NOT EXISTS idx_guests_check_in_date ON guests(check_in_date);
CREATE INDEX IF NOT EXISTS idx_guest_events_guest_id ON guest_events(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_events_event_date ON guest_events(event_date);
CREATE INDEX IF NOT EXISTS idx_appointments_guest_id ON appointments(guest_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_sales_guest_id ON sales(guest_id);
CREATE INDEX IF NOT EXISTS idx_reservations_guest_id ON reservations(guest_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for guests table
CREATE POLICY "Allow all operations for authenticated users on guests"
  ON guests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for guest_events table
CREATE POLICY "Allow all operations for authenticated users on guest_events"
  ON guest_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for appointments table
CREATE POLICY "Allow all operations for authenticated users on appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for sales table
CREATE POLICY "Allow all operations for authenticated users on sales"
  ON sales FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for reservations table
CREATE POLICY "Allow all operations for authenticated users on reservations"
  ON reservations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for guests table
CREATE TRIGGER update_guests_updated_at 
  BEFORE UPDATE ON guests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();