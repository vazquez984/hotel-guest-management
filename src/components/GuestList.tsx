import { useEffect, useState, useMemo } from 'react';
import { supabase, Guest } from '../lib/supabase';
import { Users, Plus, Search } from 'lucide-react';
import { debounce } from 'lodash';

interface GuestListProps {
  onSelectGuest: (guest: Guest) => void;
  onAddGuest: () => void;
  selectedGuestId: string | null;
}

export default function GuestList({ onSelectGuest, onAddGuest, selectedGuestId }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedLoadGuests = useMemo(
    () =>
      debounce(async (search: string) => {
        try {
          setLoading(true);
          let query = supabase.from('guests').select('*');

          if (search) {
            const searchIlke = `%${search.toLowerCase()}%`;
            query = query.or(`family_name.ilike.${searchIlke},room_number.ilike.${searchIlke},country.ilike.${searchIlke}`);
          }
          
          query = query.order('check_in_date', { ascending: false });

          const { data, error } = await query;

          if (error) throw error;
          setGuests(data || []);
        } catch (error) {
          console.error('Error loading guests:', error);
        } finally {
          setLoading(false);
        }
      }, 300), // 300ms delay
    []
  );

  useEffect(() => {
    debouncedLoadGuests(searchTerm);
    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedLoadGuests.cancel();
    };
  }, [searchTerm, debouncedLoadGuests]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Guests</h2>
            <span className="text-sm text-gray-500">({guests.length})</span>
          </div>
          <button
            onClick={onAddGuest}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Guest
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, room, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : guests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No guests found matching your search' : 'No guests yet. Add your first guest!'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {guests.map((guest) => (
              <button
                key={guest.id}
                onClick={() => onSelectGuest(guest)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedGuestId === guest.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{guest.family_name}</h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-600">Room {guest.room_number}</p>
                      <p className="text-sm text-gray-500">
                        {guest.pax} guest{guest.pax > 1 ? 's' : ''} • {guest.nights} night{guest.nights > 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-gray-500">{guest.country}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 ml-2">
                    {new Date(guest.check_in_date).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
