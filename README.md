# 🏨 Hotel Guest Management System

A comprehensive guest management system designed for hotels and resorts to track guests, appointments, reservations, events, and sales performance. Built with modern web technologies for a seamless user experience.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## ✨ Features

### 📊 Dashboard
- **Real-time Sales Metrics**: Track total sales, goal completion, and conversion rates
- **Interactive Charts**: Weekly sales performance and monthly progress visualization
- **KPI Cards**: Monitor couples attended, presentations scheduled/attended, and no-shows
- **Customizable Sales Goals**: Set and track monthly sales targets

### 👥 Guest Management
- **Complete Guest Profiles**: Store family name, room number, country, agency, and stay details
- **Search & Filter**: Quick search by name, room number, or country
- **Check-in/Check-out Tracking**: Monitor guest arrival and departure dates
- **Custom Notes**: Add special preferences, birthdays, and important information

### 📅 Calendar View
- **Monthly Calendar**: Visual overview of all appointments, reservations, and events
- **Color-Coded Events**: 
  - 🟣 Purple: Appointments
  - 🟢 Green: Reservations
  - 🟠 Orange: Events
- **Event Management**: Click to view, edit, or delete calendar items
- **Smart Navigation**: Jump to today or navigate between months

### 🗓️ Appointments
- **Schedule Presentations**: Track sales presentations and meetings
- **Status Management**: Scheduled, confirmed, completed, cancelled, no-show
- **Time & Location**: Full appointment details with location tracking
- **Auto-sync with Sales**: Completed presentations automatically update sales records

### 💰 Sales Tracking
- **Presentation Attendance**: Track which guests attended presentations
- **Purchase Records**: Record purchase amounts, dates, and payment methods
- **Conversion Analytics**: Automatic calculation of sales conversion rates
- **Historical Data**: Complete sales history per guest

### 🍽️ Reservations
- **Multi-type Support**: Restaurants, spa, tours, transportation, and more
- **Party Size Management**: Track number of guests per reservation
- **Confirmation Numbers**: Store and display booking confirmations
- **Status Workflow**: Pending → Confirmed → Completed or Cancelled

### 🎉 Events
- **Guest Events**: Track special events and activities
- **Access Control**: Mark which events guests have access to
- **Attendance Tracking**: Record actual attendance vs. scheduled
- **Date Management**: Schedule events with specific dates

### ✅ Form Validation
- **Real-time Validation**: Instant feedback on form inputs
- **Smart Error Messages**: Clear, actionable error descriptions
- **Required Field Indicators**: Visual markers for mandatory fields
- **Data Integrity**: Prevent invalid data entry (e.g., checkout before check-in)

### 🔔 Notifications
- **Toast Notifications**: Success and error messages using react-hot-toast
- **Action Feedback**: Confirmation for all CRUD operations
- **Error Handling**: User-friendly error messages

## 🎬 Demo

### Dashboard View
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Guest Management
![Guests](https://via.placeholder.com/800x400?text=Guest+Management+Screenshot)

### Calendar View
![Calendar](https://via.placeholder.com/800x400?text=Calendar+View+Screenshot)

> **Note**: Replace placeholder images with actual screenshots of your application

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Lucide React 0.344.0** - Icon library
- **Recharts 3.3.0** - Chart visualization
- **React Hot Toast** - Notification system

### Backend & Database
- **Supabase 2.57.4** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - RESTful API

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git**
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))

Check your versions:
```bash
node --version
npm --version
git --version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vazquez984/hotel-guest-management.git
cd hotel-guest-management
```

### 2. Install Dependencies

```bash
npm install
```

or with yarn:

```bash
yarn install
```

### 3. Install React Hot Toast (if not already installed)

```bash
npm install react-hot-toast
```

## ⚙️ Configuration

### 1. Create Environment File

Create a `.env` file in the root directory:

```bash
touch .env
```

### 2. Add Supabase Credentials

Add the following environment variables to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find these values:**
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** and **anon/public** key

### 3. Example .env File

```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Security Note**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in project details
4. Wait for database provisioning (~2 minutes)

### 2. Run Database Schema

Execute the following SQL in the Supabase SQL Editor (**SQL Editor** → **New Query**):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Guests table
CREATE TABLE guests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_name TEXT NOT NULL,
  room_number TEXT NOT NULL,
  pax INTEGER DEFAULT 2 CHECK (pax > 0),
  country TEXT NOT NULL,
  agency TEXT,
  nights INTEGER DEFAULT 1 CHECK (nights > 0),
  check_in_date DATE NOT NULL,
  check_out_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_out_after_check_in CHECK (check_out_date IS NULL OR check_out_date > check_in_date)
);

-- Guest events table
CREATE TABLE guest_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  has_access BOOLEAN DEFAULT TRUE,
  attended BOOLEAN DEFAULT FALSE,
  event_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales table
CREATE TABLE sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  attended_presentation BOOLEAN DEFAULT FALSE,
  made_purchase BOOLEAN DEFAULT FALSE,
  purchase_amount NUMERIC(10, 2) DEFAULT 0 CHECK (purchase_amount >= 0),
  purchase_date DATE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations table
CREATE TABLE reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  reservation_type TEXT NOT NULL CHECK (reservation_type IN ('restaurant', 'spa', 'tour', 'transportation', 'other')),
  venue_name TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  party_size INTEGER DEFAULT 2 CHECK (party_size > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  confirmation_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_guests_check_in ON guests(check_in_date DESC);
CREATE INDEX idx_guests_family_name ON guests(family_name);
CREATE INDEX idx_guests_room_number ON guests(room_number);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_guest ON appointments(guest_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_guest ON reservations(guest_id);
CREATE INDEX idx_sales_guest ON sales(guest_id);
CREATE INDEX idx_guest_events_guest ON guest_events(guest_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. Configure Row Level Security (RLS)

**IMPORTANT**: Enable RLS to secure your database:

```sql
-- Enable RLS on all tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
-- For now, allow all operations (development only)
CREATE POLICY "Enable all operations for all users" ON guests FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON guest_events FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON appointments FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON sales FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON reservations FOR ALL USING (true);
```

> ⚠️ **Production Note**: Replace the permissive policies above with proper authentication-based policies before deploying to production.

### 4. Verify Schema

Check that all tables were created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- `guests`
- `guest_events`
- `appointments`
- `sales`
- `reservations`

## 🎮 Usage

### Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Type Checking

Run TypeScript type checking without emitting files:

```bash
npm run typecheck
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
hotel-guest-management/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── common/        # Reusable components
│   │   │   └── ErrorMessage.tsx
│   │   ├── App.tsx        # Main app component
│   │   ├── Dashboard.tsx  # Dashboard with charts
│   │   ├── CalendarView.tsx
│   │   ├── GuestList.tsx
│   │   ├── GuestDetail.tsx
│   │   └── EditEventModal.tsx
│   ├── lib/               # Third-party integrations
│   │   └── supabase.ts   # Supabase client & types
│   ├── utils/             # Utility functions
│   │   ├── validation.ts  # Generic validation functions
│   │   └── guestValidation.ts
│   ├── hooks/             # Custom React hooks
│   │   └── useFormValidation.ts
│   ├── types/             # TypeScript type definitions
│   ├── index.css          # Global styles
│   └── main.tsx           # Application entry point
├── .env                   # Environment variables (not in repo)
├── .env.example           # Example environment file
├── .gitignore            
├── eslint.config.js       # ESLint configuration
├── index.html            
├── package.json          
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json     
├── tsconfig.node.json    
├── vite.config.ts         # Vite configuration
└── README.md             
```

## 📡 API Reference

### Supabase Tables

#### Guests
```typescript
{
  id: string;              // UUID
  family_name: string;     // Guest family name
  room_number: string;     // Hotel room number
  pax: number;             // Number of guests
  country: string;         // Country of origin
  agency: string;          // Travel agency (optional)
  nights: number;          // Number of nights
  check_in_date: string;   // ISO date
  check_out_date: string;  // ISO date (optional)
  notes: string;           // Additional notes
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

#### Appointments
```typescript
{
  id: string;
  guest_id: string;        // Foreign key to guests
  title: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  location: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  created_at: string;
}
```

#### Sales
```typescript
{
  id: string;
  guest_id: string;
  appointment_id: string;
  attended_presentation: boolean;
  made_purchase: boolean;
  purchase_amount: number;
  purchase_date: string;
  payment_method: string;
  notes: string;
  created_at: string;
}
```

#### Reservations
```typescript
{
  id: string;
  guest_id: string;
  reservation_type: 'restaurant' | 'spa' | 'tour' | 'transportation' | 'other';
  venue_name: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmation_number: string;
  notes: string;
  created_at: string;
}
```

#### Guest Events
```typescript
{
  id: string;
  guest_id: string;
  event_name: string;
  has_access: boolean;
  attended: boolean;
  event_date: string;
  notes: string;
  created_at: string;
}
```

### Common Operations

#### Fetch All Guests
```typescript
const { data, error } = await supabase
  .from('guests')
  .select('*')
  .order('check_in_date', { ascending: false });
```

#### Create Guest
```typescript
const { data, error } = await supabase
  .from('guests')
  .insert([{ family_name: 'Smith', room_number: '101', ... }]);
```

#### Update Guest
```typescript
const { data, error } = await supabase
  .from('guests')
  .update({ notes: 'VIP guest' })
  .eq('id', guestId);
```

#### Delete Guest
```typescript
const { data, error } = await supabase
  .from('guests')
  .delete()
  .eq('id', guestId);
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Standards

- Use TypeScript for type safety
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

### Testing

Before submitting a PR, ensure:
- [ ] Code compiles without errors (`npm run build`)
- [ ] TypeScript types are correct (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] All features work as expected

## 🐛 Troubleshooting

### Common Issues

#### 1. Supabase Connection Error
```
Error: Missing Supabase environment variables
```
**Solution**: Ensure `.env` file exists with correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

#### 2. Database Permission Errors
```
Error: permission denied for table guests
```
**Solution**: Enable Row Level Security and create appropriate policies (see [Database Setup](#%EF%B8%8F-database-setup))

#### 3. Build Errors
```
Error: Cannot find module 'react-hot-toast'
```
**Solution**: Install missing dependencies
```bash
npm install
```

#### 4. TypeScript Errors
```
Error: Property 'X' does not exist on type 'Y'
```
**Solution**: Run type checking to see all errors
```bash
npm run typecheck
```

### Getting Help

- 📧 **Email**: antonio984vs@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/vazquez984/hotel-guest-management/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/vazquez984/hotel-guest-management/discussions)

## 📝 Roadmap

### Version 1.1 (Coming Soon)
- [ ] User authentication with Supabase Auth
- [ ] Multi-language support (English, Spanish)
- [ ] Export reports to PDF/Excel
- [ ] Email notifications for appointments
- [ ] Mobile responsive improvements

### Version 2.0 (Future)
- [ ] Mobile app (React Native)
- [ ] Role-based access control
- [ ] Advanced analytics dashboard
- [ ] Integration with property management systems (PMS)
- [ ] Automated backup system

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Vazquez984** - *Initial work* - [GitHub](https://github.com/vazquez984)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) - UI styling
- [Lucide](https://lucide.dev) - Icon library
- [Recharts](https://recharts.org) - Charts library
- [React Hot Toast](https://react-hot-toast.com) - Toast notifications

## 📸 Screenshots

### Dashboard Analytics
Track your sales performance with real-time metrics and beautiful charts.

### Guest Profile Management
Comprehensive guest information with all interactions in one place.

### Calendar Overview
Visual calendar showing all appointments, reservations, and events.

---

**Made with ❤️ by the Hotel Management Team**

For questions or support, please open an issue on [GitHub](https://github.com/vazquez984/hotel-guest-management/issues).
