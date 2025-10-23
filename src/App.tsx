import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Guest } from './lib/supabase';
import GuestList from './components/GuestList';
import GuestDetail from './components/GuestDetail';
import CalendarView from './components/CalendarView';
import Dashboard from './components/Dashboard';
import { Hotel, Calendar, BarChart } from 'lucide-react';

type View = 'guests' | 'calendar' | 'dashboard';

function App() {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  function handleSelectGuest(guest: Guest) {
    setSelectedGuest(guest);
    setIsNewGuest(false);
  }

  function handleAddGuest() {
    setSelectedGuest(null);
    setIsNewGuest(true);
  }

  function handleCloseDetail() {
    setSelectedGuest(null);
    setIsNewGuest(false);
  }

  function handleUpdate() {
    setRefreshTrigger(prev => prev + 1);
    handleCloseDetail();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toaster para notificaciones */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hotel className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hotel Guest Management</h1>
                <p className="text-sm text-gray-600">Manage guests, reservations, and appointments</p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('guests')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'guests'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Hotel className="w-4 h-4" />
                Guests
              </button>
              <button
                onClick={() => setCurrentView('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'calendar'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : currentView === 'calendar' ? (
          <div className="h-[calc(100vh-200px)]">
            <CalendarView />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            <div className="h-full" key={refreshTrigger}>
              <GuestList
                onSelectGuest={handleSelectGuest}
                onAddGuest={handleAddGuest}
                selectedGuestId={selectedGuest?.id || null}
              />
            </div>
            <div className="h-full">
              {(selectedGuest || isNewGuest) ? (
                <GuestDetail
                  guest={selectedGuest}
                  onClose={handleCloseDetail}
                  onUpdate={handleUpdate}
                  isNew={isNewGuest}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Hotel className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Select a guest to view details</p>
                    <p className="text-sm mt-1">or add a new guest to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;