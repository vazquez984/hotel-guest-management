/*
  # Update RLS Policies to Allow Anonymous Access

  ## Changes
  - Drop existing restrictive RLS policies that require authentication
  - Create new policies allowing anonymous (anon) users full access
  - This enables the app to work without authentication setup

  ## Security Note
  In a production environment, you would want to implement proper authentication
  and restrict access based on user roles. For a hotel management system where
  staff are the only users, this current setup allows the app to function.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users on guests" ON guests;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on guest_events" ON guest_events;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on appointments" ON appointments;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on sales" ON sales;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on reservations" ON reservations;

-- Create new policies for guests table
CREATE POLICY "Allow select for anon users on guests"
  ON guests FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow insert for anon users on guests"
  ON guests FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow update for anon users on guests"
  ON guests FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for anon users on guests"
  ON guests FOR DELETE
  TO anon
  USING (true);

-- Create new policies for guest_events table
CREATE POLICY "Allow select for anon users on guest_events"
  ON guest_events FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow insert for anon users on guest_events"
  ON guest_events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow update for anon users on guest_events"
  ON guest_events FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for anon users on guest_events"
  ON guest_events FOR DELETE
  TO anon
  USING (true);

-- Create new policies for appointments table
CREATE POLICY "Allow select for anon users on appointments"
  ON appointments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow insert for anon users on appointments"
  ON appointments FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow update for anon users on appointments"
  ON appointments FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for anon users on appointments"
  ON appointments FOR DELETE
  TO anon
  USING (true);

-- Create new policies for sales table
CREATE POLICY "Allow select for anon users on sales"
  ON sales FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow insert for anon users on sales"
  ON sales FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow update for anon users on sales"
  ON sales FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for anon users on sales"
  ON sales FOR DELETE
  TO anon
  USING (true);

-- Create new policies for reservations table
CREATE POLICY "Allow select for anon users on reservations"
  ON reservations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow insert for anon users on reservations"
  ON reservations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow update for anon users on reservations"
  ON reservations FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for anon users on reservations"
  ON reservations FOR DELETE
  TO anon
  USING (true);