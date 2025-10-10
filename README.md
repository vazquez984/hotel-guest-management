# Hotel Guest Management

This project is a web application for managing hotel guests, reservations, and events. It provides a user-friendly interface for hotel staff to keep track of guest information, bookings, and scheduled activities.

## Features

*   **Guest Management:** View a list of all guests with their details.
*   **Reservation Management:** Create, view, edit, and delete guest reservations.
*   **Event Management:** Create, view, edit, and delete guest events.
*   **Calendar View:** A comprehensive calendar that displays all reservations and events in a clear and organized manner.
*   **Interactive Modals:** Click on any reservation or event in the calendar to open a modal for editing or deleting it.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Supabase:** An open-source Firebase alternative for building secure and scalable backends. Used for database and authentication.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **FullCalendar:** A full-sized, drag & drop event calendar library.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm (or yarn) installed on your machine.

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/vazquez984/hotel-guest-management.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd hotel-guest-management
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Supabase project URL and anon key:
    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

### Running the Application

To run the app in the development mode, use the following command:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

*   `src/components`: Contains all the React components used in the application, such as the calendar, modals, and forms.
*   `src/lib`: Includes the Supabase client configuration and TypeScript type definitions.
*   `src/App.tsx`: The main application component where all other components are brought together.
*   `public`: Contains the static assets and the `index.html` file.
