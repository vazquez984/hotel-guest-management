import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase, Appointment, Reservation, GuestEvent } from '../lib/supabase';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import EditEventModal from './EditEventModal'; // Import the generalized modal

interface CalendarEvent {
  id: string;
  type: 'appointment' | 'reservation' | 'event';
  title: string;
  date: string;
  time: string;
  guestName: string;
  status?: string;
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const startDate = startOfMonth.toISOString().split('T')[0];
      const endDate = endOfMonth.toISOString().split('T')[0];

      const [appointmentsRes, reservationsRes, eventsRes, guestsRes] = await Promise.all([
        supabase
          .from('appointments')
          .select('*')
          .gte('appointment_date', startDate)
          .lte('appointment_date', endDate),
        supabase
          .from('reservations')
          .select('*')
          .gte('reservation_date', startDate)
          .lte('reservation_date', endDate),
        supabase
          .from('guest_events')
          .select('*')
          .gte('event_date', startDate)
          .lte('event_date', endDate),
        supabase.from('guests').select('id, family_name')
      ]);

      const guests = guestsRes.data || [];
      const guestMap = new Map(guests.map(g => [g.id, g.family_name]));

      const calendarEvents: CalendarEvent[] = [];

      (appointmentsRes.data || []).forEach((apt: Appointment) => {
        calendarEvents.push({
          id: apt.id,
          type: 'appointment',
          title: apt.title,
          date: apt.appointment_date,
          time: apt.appointment_time,
          guestName: guestMap.get(apt.guest_id) || 'Unknown',
          status: apt.status
        });
      });

      (reservationsRes.data || []).forEach((res: Reservation) => {
        calendarEvents.push({
          id: res.id,
          type: 'reservation',
          title: `${res.venue_name} (${res.reservation_type})`,
          date: res.reservation_date,
          time: res.reservation_time,
          guestName: guestMap.get(res.guest_id) || 'Unknown',
          status: res.status
        });
      });

      (eventsRes.data || []).forEach((evt: GuestEvent) => {
        if (evt.event_date) {
          calendarEvents.push({
            id: evt.id,
            type: 'event',
            title: evt.event_name,
            date: evt.event_date,
            time: '00:00',
            guestName: guestMap.get(evt.guest_id) || 'Unknown',
            status: evt.attended ? 'attended' : 'scheduled'
          });
        }
      });

      calendarEvents.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      toast.error('Failed to load calendar data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  function getDaysInMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  }

  function getEventsForDay(day: number) {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return events.filter(e => e.date === dateStr);
  }

  function previousMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    loadCalendarData(); // Refresh data after modal closes
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading calendar...</div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}

            {Array.from({ length: startingDayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} className="min-h-24 bg-gray-50 rounded-lg"></div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`min-h-24 p-2 border rounded-lg ${
                    isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={`text-xs p-1 rounded truncate cursor-pointer ${
                          event.type === 'appointment'
                            ? 'bg-indigo-100 text-indigo-700'
                            : event.type === 'reservation'
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                        title={`${event.title} - ${event.guestName} at ${event.time}`}
                      >
                        {event.time.slice(0, 5)} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 px-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-100 border border-indigo-300 rounded"></div>
            <span className="text-gray-700">Appointments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-100 border border-pink-300 rounded"></div>
            <span className="text-gray-700">Reservations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded"></div>
            <span className="text-gray-700">Events</span>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EditEventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
