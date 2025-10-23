# Database Schema Documentation

This document describes the database schema for the Hotel Guest Management System.

## 📊 Overview

The system uses **PostgreSQL** through **Supabase** with 5 main tables:
- `guests` - Core guest information
- `guest_events` - Events and activities for guests
- `appointments` - Scheduled meetings and presentations
- `sales` - Sales records and presentation attendance
- `reservations` - Restaurant, spa, and tour bookings

## 🗂️ Table Relationships

```
guests (1) ──→ (*) guest_events
       (1) ──→ (*) appointments
       (1) ──→ (*) sales
       (1) ──→ (*) reservations

appointments (1) ──→ (0..1) sales
```

## 📋 Table Schemas

### `guests`

**Description**: Main table for guest information and stay details.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique guest identifier |
| `family_name` | TEXT | NOT NULL | Guest family/last name |
| `room_number` | TEXT | NOT NULL | Hotel room number |
| `pax` | INTEGER | DEFAULT 2, CHECK (pax > 0) | Number of guests in party |
| `country` | TEXT | NOT NULL | Country of origin |
| `agency` | TEXT | NULL | Travel agency name |
| `nights` | INTEGER | DEFAULT 1, CHECK (nights > 0) | Number of nights staying |
| `check_in_date` | DATE | NOT NULL | Check-in date |
| `check_out_date` | DATE | NULL, CHECK (check_out_date > check_in_date) | Check-out date |
| `notes` | TEXT | NULL | Additional notes and preferences |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_guests_check_in` on `check_in_date DESC`
- `idx_guests_family_name` on `family_name`
- `idx_guests_room_number` on `room_number`

**Triggers:**
- `update_guests_updated_at` - Automatically updates `updated_at` on record modification

---

### `guest_events`

**Description**: Events and activities that guests can attend.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique event identifier |
| `guest_id` | UUID | FOREIGN KEY → guests(id) ON DELETE CASCADE | Reference to guest |
| `event_name` | TEXT | NOT NULL | Name of the event |
| `has_access` | BOOLEAN | DEFAULT TRUE | Whether guest has access to event |
| `attended` | BOOLEAN | DEFAULT FALSE | Whether guest attended event |
| `event_date` | DATE | NULL | Date of the event |
| `notes` | TEXT | NULL | Additional event notes |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_guest_events_guest` on `guest_id`

**Relationships:**
- `guest_id` references `guests(id)` with CASCADE delete

---

### `appointments`

**Description**: Scheduled appointments, presentations, and meetings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique appointment identifier |
| `guest_id` | UUID | FOREIGN KEY → guests(id) ON DELETE CASCADE | Reference to guest |
| `title` | TEXT | NOT NULL | Appointment title |
| `appointment_date` | DATE | NOT NULL | Date of appointment |
| `appointment_time` | TIME | NOT NULL | Time of appointment |
| `duration_minutes` | INTEGER | DEFAULT 60 | Duration in minutes |
| `location` | TEXT | NULL | Location of appointment |
| `status` | TEXT | DEFAULT 'scheduled' | Status enum |
| `notes` | TEXT | NULL | Additional appointment notes |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation timestamp |

**Status Values:**
- `scheduled` - Initial state
- `confirmed` - Guest confirmed attendance
- `completed` - Appointment finished
- `cancelled` - Appointment cancelled
- `no-show` - Guest didn't attend

**Indexes:**
- `idx_appointments_date` on `appointment_date`
- `idx_appointments_guest` on `guest_id`

**Relationships:**
- `guest_id` references `guests(id)` with CASCADE delete

---

### `sales`

**Description**: Sales records and purchase tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique sales record identifier |
| `guest_id` | UUID | FOREIGN KEY → guests(id) ON DELETE CASCADE | Reference to guest |
| `appointment_id` | UUID | FOREIGN KEY → appointments(id) ON DELETE SET NULL | Reference to appointment |
| `attended_presentation` | BOOLEAN | DEFAULT FALSE | Whether guest attended sales presentation |
| `made_purchase` | BOOLEAN | DEFAULT FALSE | Whether guest made a purchase |
| `purchase_amount` | NUMERIC(10, 2) | DEFAULT 0, CHECK (purchase_amount >= 0) | Purchase amount in currency |
| `purchase_date` | DATE | NULL | Date of purchase |
| `payment_method` | TEXT | NULL | Payment method used |
| `notes` | TEXT | NULL | Additional sales notes |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_sales_guest` on `guest_id`

**Relationships:**
- `guest_id` references `guests(id)` with CASCADE delete
- `appointment_id` references `appointments(id)` with SET NULL on delete

---

### `reservations`

**Description**: Restaurant, spa, tour, and other service reservations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique reservation identifier |
| `guest_id` | UUID | FOREIGN KEY → guests(id) ON DELETE CASCADE | Reference to guest |
| `reservation_type` | TEXT | NOT NULL | Type of reservation |
| `venue_name` | TEXT | NOT NULL | Name of venue/service |
| `reservation_date` | DATE | NOT NULL | Date of reservation |
| `reservation_time` | TIME | NOT NULL | Time of reservation |
| `party_size` | INTEGER | DEFAULT 2, CHECK (party_size > 0) | Number of people |
| `status` | TEXT | DEFAULT 'pending' | Status enum |
| `confirmation_number` | TEXT | NULL | Booking confirmation number |
| `notes` | TEXT | NULL | Additional reservation notes |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation timestamp |

**Reservation Types:**
- `restaurant` - Restaurant booking
- `spa` - Spa treatment
- `tour` - Tour or excursion
- `transportation` - Transport service
- `other` - Other services

**Status Values:**
- `pending` - Awaiting confirmation
- `confirmed` - Reservation confirmed
- `completed` - Service completed
- `cancelled` - Reservation cancelled

**Indexes:**
- `idx_reservations_date` on `reservation_date`
- `idx_reservations_guest` on `guest_id`

**Relationships:**
- `guest_id` references `guests(id)` with CASCADE delete

## 🔐 Row Level Security (RLS)

All tables have RLS enabled. Current policies allow all operations for all users (development mode).

**For Production**, implement proper authentication-based policies:

```sql
-- Example: Only allow users to see their own data
CREATE POLICY "Users can view their own guests"
ON guests FOR SELECT
USING (auth.uid() = user_id);

-- Example: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert guests"
ON guests FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

## 🔄 Triggers and Functions

### `update_updated_at_column()`

**Purpose**: Automatically update the `updated_at` timestamp when a record is modified.

**Tables**: Currently applied to `guests` table.

**Usage**:
```sql
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 📊 Common Queries

### Get guest with all related data
```sql
SELECT 
  g.*,
  json_agg(DISTINCT ge.*) FILTER (WHERE ge.id IS NOT NULL) as events,
  json_agg(DISTINCT a.*) FILTER (WHERE a.id IS NOT NULL) as appointments,
  json_agg(DISTINCT s.*) FILTER (WHERE s.id IS NOT NULL) as sales,
  json_agg(DISTINCT r.*) FILTER (WHERE r.id IS NOT NULL) as reservations
FROM guests g
LEFT JOIN guest_events ge ON g.id = ge.guest_id
LEFT JOIN appointments a ON g.id = a.guest_id
LEFT JOIN sales s ON g.id = s.guest_id
LEFT JOIN reservations r ON g.id = r.guest_id
WHERE g.id = $1
GROUP BY g.id;
```

### Get sales metrics for current month
```sql
SELECT 
  COUNT(*) as total_guests,
  COUNT(CASE WHEN attended_presentation THEN 1 END) as presentations_attended,
  COUNT(CASE WHEN made_purchase THEN 1 END) as purchases_made,
  SUM(purchase_amount) as total_sales,
  ROUND(
    COUNT(CASE WHEN made_purchase THEN 1 END)::DECIMAL / 
    NULLIF(COUNT(CASE WHEN attended_presentation THEN 1 END), 0) * 100,
    2
  ) as conversion_rate
FROM sales
WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE);
```

### Get upcoming appointments
```sql
SELECT a.*, g.family_name, g.room_number
FROM appointments a
JOIN guests g ON a.guest_id = g.id
WHERE a.appointment_date >= CURRENT_DATE
  AND a.status IN ('scheduled', 'confirmed')
ORDER BY a.appointment_date, a.appointment_time;
```

## 🔧 Maintenance

### Backup Recommendations
- **Daily**: Automated backups via Supabase
- **Weekly**: Manual export of critical data
- **Monthly**: Full database dump

### Index Maintenance
```sql
-- Reindex if performance degrades
REINDEX TABLE guests;
REINDEX TABLE appointments;
REINDEX TABLE reservations;
```

### Vacuum and Analyze
```sql
-- Regular maintenance (usually automated by Supabase)
VACUUM ANALYZE guests;
VACUUM ANALYZE appointments;
VACUUM ANALYZE sales;
```

## 📈 Performance Considerations

### Current Indexes
All tables have appropriate indexes on:
- Foreign keys for JOIN operations
- Date columns for filtering
- Text columns used in WHERE clauses

### Query Optimization Tips
1. Use indexes for date range queries
2. Avoid SELECT * in production
3. Use pagination for large result sets
4. Consider materialized views for complex aggregations

### Scaling Considerations
- Current schema supports up to 100,000 guests efficiently
- For larger deployments, consider:
  - Partitioning `appointments` and `reservations` by date
  - Archiving old guest data
  - Read replicas for reporting queries

## 🔄 Migration History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2024-01-15 | Initial schema creation |
| 1.0.1 | 2024-01-20 | Added validation constraints |
| 1.0.2 | 2024-01-25 | Added form validation support |

---

**For schema updates**, always:
1. Create a migration script
2. Test on development environment
3. Backup production database
4. Apply migration during low-traffic period
5. Verify data integrity

**For questions or suggestions**, open an issue on GitHub.