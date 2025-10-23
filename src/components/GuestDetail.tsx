import { useEffect, useState, useCallback } from 'react';
import { supabase, Guest, GuestEvent, Appointment, Sale, Reservation } from '../lib/supabase';
import { User, Calendar, DollarSign, Utensils, X, Save, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { validateGuest, validateAppointment, validateReservation, validateSale, validateEvent } from '../utils/guestValidation';
import ErrorMessage, { ErrorBanner } from './common/ErrorMessage';
import { ValidationError } from '../utils/validation';

interface GuestDetailProps {
  guest: Guest | null;
  onClose: () => void;
  onUpdate: () => void;
  isNew?: boolean;
}

export default function GuestDetail({ guest, onClose, onUpdate, isNew = false }: GuestDetailProps) {
  const [editing, setEditing] = useState(isNew);
  const [formData, setFormData] = useState<Partial<Guest>>({
    family_name: '',
    room_number: '',
    pax: 2,
    country: '',
    agency: '',
    nights: 1,
    check_in_date: new Date().toISOString().split('T')[0],
    check_out_date: '',
    notes: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [events, setEvents] = useState<GuestEvent[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [newEvent, setNewEvent] = useState({ event_name: '', has_access: true, event_date: '' });
  const [newAppointment, setNewAppointment] = useState({
    title: 'Presentation',
    appointment_date: '',
    appointment_time: '10:00',
    location: ''
  });
  const [newSale, setNewSale] = useState({
    attended_presentation: false,
    made_purchase: false,
    purchase_amount: 0,
    purchase_date: '',
    payment_method: ''
  });
  const [newReservation, setNewReservation] = useState({
    reservation_type: 'restaurant',
    venue_name: '',
    reservation_date: '',
    reservation_time: '19:00',
    party_size: 2,
    status: 'pending'
  });

  const loadGuestData = useCallback(async () => {
    if (!guest) return;

    try {
      const [eventsRes, appointmentsRes, salesRes, reservationsRes] = await Promise.all([
        supabase.from('guest_events').select('*').eq('guest_id', guest.id).order('event_date', { ascending: false }),
        supabase.from('appointments').select('*').eq('guest_id', guest.id).order('appointment_date', { ascending: false }),
        supabase.from('sales').select('*').eq('guest_id', guest.id).order('created_at', { ascending: false }),
        supabase.from('reservations').select('*').eq('guest_id', guest.id).order('reservation_date', { ascending: false })
      ]);

      setEvents(eventsRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setSales(salesRes.data || []);
      setReservations(reservationsRes.data || []);
    } catch (error) {
      console.error('Error loading guest data:', error);
      toast.error('Failed to load guest data');
    }
  }, [guest]);

  useEffect(() => {
    if (guest) {
      setFormData(guest);
      loadGuestData();
    }
  }, [guest, loadGuestData]);

  async function handleSave() {
    // Validar datos del formulario
    const validation = validateGuest(formData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast.error('Please fix the errors before saving');
      return;
    }
    
    // Limpiar errores si la validación es exitosa
    setValidationErrors([]);
    
    try {
      if (isNew) {
        const { error } = await supabase.from('guests').insert([formData]);
        if (error) throw error;
        toast.success('Guest added successfully!');
      } else if (guest) {
        const { error } = await supabase.from('guests').update(formData).eq('id', guest.id);
        if (error) throw error;
        toast.success('Guest updated successfully!');
      }
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving guest:', error);
      toast.error('Failed to save guest');
    }
  }

  async function handleDelete() {
    if (!guest || !confirm('Are you sure you want to delete this guest? This action cannot be undone.')) return;

    try {
      const { error } = await supabase.from('guests').delete().eq('id', guest.id);
      if (error) throw error;
      toast.success('Guest deleted successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast.error('Failed to delete guest');
    }
  }

  async function addEvent() {
    if (!guest) return;
    
    // Validar evento
    const validation = validateEvent(newEvent);
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error.message));
      return;
    }

    try {
      const { error } = await supabase.from('guest_events').insert([{ ...newEvent, guest_id: guest.id }]);
      if (error) throw error;
      setNewEvent({ event_name: '', has_access: true, event_date: '' });
      toast.success('Event added successfully!');
      loadGuestData();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  }

  async function toggleEventAttendance(eventId: string, attended: boolean) {
    try {
      const { error } = await supabase.from('guest_events').update({ attended }).eq('id', eventId);
      if (error) throw error;
      toast.success(attended ? 'Marked as attended' : 'Marked as not attended');
      loadGuestData();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  }

  async function addAppointment() {
    if (!guest) return;
    
    // Validar cita
    const validation = validateAppointment(newAppointment);
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error.message));
      return;
    }

    try {
      const { error } = await supabase.from('appointments').insert([{ ...newAppointment, guest_id: guest.id }]);
      if (error) throw error;
      setNewAppointment({ title: 'Presentation', appointment_date: '', appointment_time: '10:00', location: '' });
      toast.success('Appointment added successfully!');
      loadGuestData();
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast.error('Failed to add appointment');
    }
  }

  async function addSale() {
    if (!guest) return;
    
    // Validar venta
    const validation = validateSale(newSale);
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error.message));
      return;
    }

    try {
      const { error } = await supabase.from('sales').insert([{ ...newSale, guest_id: guest.id }]);
      if (error) throw error;
      setNewSale({ attended_presentation: false, made_purchase: false, purchase_amount: 0, purchase_date: '', payment_method: '' });
      toast.success('Sale record added successfully!');
      loadGuestData();
    } catch (error) {
      console.error('Error adding sale:', error);
      toast.error('Failed to add sale record');
    }
  }

  async function addReservation() {
    if (!guest) return;
    
    // Validar reservación
    const validation = validateReservation(newReservation);
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error.message));
      return;
    }

    try {
      const { error } = await supabase.from('reservations').insert([{ ...newReservation, guest_id: guest.id }]);
      if (error) throw error;
      setNewReservation({ reservation_type: 'restaurant', venue_name: '', reservation_date: '', reservation_time: '19:00', party_size: 2, status: 'pending' });
      toast.success('Reservation added successfully!');
      loadGuestData();
    } catch (error) {
      console.error('Error adding reservation:', error);
      toast.error('Failed to add reservation');
    }
  }

  if (!guest && !isNew) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">
            {isNew ? 'New Guest' : formData.family_name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && !editing && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Edit guest"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Delete guest"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <section className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4" />
            Guest Information
          </h3>
          
          {/* Mostrar banner de errores si hay errores de validación */}
          {editing && validationErrors.length > 0 && (
            <ErrorBanner errors={validationErrors} />
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="family_name" className="block text-sm font-medium text-gray-700 mb-1">
                Family Name *
              </label>
              <input
                id="family_name"
                type="text"
                value={formData.family_name}
                onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                disabled={!editing}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                  validationErrors.some(e => e.field === 'Family name') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter family name"
              />
              <ErrorMessage field="Family name" errors={validationErrors} />
            </div>
            
            <div>
              <label htmlFor="room_number" className="block text-sm font-medium text-gray-700 mb-1">
                Room Number *
              </label>
              <input
                id="room_number"
                type="text"
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                disabled={!editing}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                  validationErrors.some(e => e.field === 'Room number') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 101"
              />
              <ErrorMessage field="Room number" errors={validationErrors} />
            </div>
            
            <div>
              <label htmlFor="pax" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests *
              </label>
              <input
                id="pax"
                type="number"
                value={formData.pax}
                onChange={(e) => setFormData({ ...formData, pax: parseInt(e.target.value) || 0 })}
                disabled={!editing}
                min="1"
                max="20"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                  validationErrors.some(e => e.field === 'Number of guests') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <ErrorMessage field="Number of guests" errors={validationErrors} />
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                disabled={!editing}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                  validationErrors.some(e => e.field === 'Country') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., USA"
              />
              <ErrorMessage field="Country" errors={validationErrors} />
            </div>
            
            <div>
              <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-1">
                Agency
              </label>
              <input
                id="agency"
                type="text"
                value={formData.agency}
                onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                disabled={!editing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="e.g., Expedia"
              />
            </div>
            
            <div>
              <label htmlFor="nights" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Nights *
              </label>
              <input
                id="nights"
                type="number"
                value={formData.nights}
                onChange={(e) => setFormData({ ...formData, nights: parseInt(e.target.value) || 0 })}
                disabled={!editing}
                min="1"
                max="365"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                  validationErrors.some(e => e.field === 'Number of nights') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <ErrorMessage field="Number of nights" errors={validationErrors} />
            </div>
            
            <div>
              <label htmlFor="check_in_date" className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date *
              </label>
              <input
                id="check_in_date"
                type="date"
                value={formData.check_in_date}
                onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                disabled={!editing}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                  validationErrors.some(e => e.field === 'Check-in date') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <ErrorMessage field="Check-in date" errors={validationErrors} />
            </div>
            
            <div>
              <label htmlFor="check_out_date" className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <input
                id="check_out_date"
                type="date"
                value={formData.check_out_date || ''}
                onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
                disabled={!editing}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                  validationErrors.some(e => e.field === 'Check-out date') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <ErrorMessage field="Check-out date" errors={validationErrors} />
            </div>
            
            <div className="col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={!editing}
                rows={3}
                maxLength={1000}
                placeholder="Birthdays, anniversaries, special preferences..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                  validationErrors.some(e => e.field === 'Notes') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center">
                <ErrorMessage field="Notes" errors={validationErrors} />
                <span className="text-xs text-gray-500 mt-1">
                  {formData.notes?.length || 0}/1000
                </span>
              </div>
            </div>
          </div>
          
          {editing && (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              {!isNew && (
                <button
                  onClick={() => {
                    setEditing(false);
                    setValidationErrors([]);
                    setFormData(guest!);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </section>

        {!isNew && (
          <>
            {/* Events Section */}
            <section className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Events
              </h3>
              <div className="space-y-2">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.event_name}</p>
                      <p className="text-sm text-gray-600">
                        {event.event_date && new Date(event.event_date).toLocaleDateString()} •
                        {event.has_access ? ' Has Access' : ' No Access'}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleEventAttendance(event.id, !event.attended)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        event.attended
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {event.attended ? 'Attended' : 'Mark Attended'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Event name *"
                  value={newEvent.event_name}
                  onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addEvent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Event
                </button>
              </div>
            </section>

            {/* Appointments Section */}
            <section className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Appointments
              </h3>
              <div className="space-y-2">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{apt.title}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time}
                        </p>
                        {apt.location && <p className="text-sm text-gray-600">{apt.location}</p>}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Title *"
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={newAppointment.appointment_date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={newAppointment.appointment_time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addAppointment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </section>

            {/* Sales Section */}
            <section className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Sales
              </h3>
              <div className="space-y-2">
                {sales.map((sale) => (
                  <div key={sale.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          {sale.attended_presentation ? 'Attended presentation' : 'Did not attend presentation'}
                        </p>
                        {sale.made_purchase && (
                          <>
                            <p className="font-medium text-green-700">
                              Purchase: ${sale.purchase_amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {sale.purchase_date && new Date(sale.purchase_date).toLocaleDateString()}
                              {sale.payment_method && ` • ${sale.payment_method}`}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newSale.attended_presentation}
                      onChange={(e) => setNewSale({ ...newSale, attended_presentation: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Attended Presentation</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newSale.made_purchase}
                      onChange={(e) => setNewSale({ ...newSale, made_purchase: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Made Purchase</span>
                  </label>
                </div>
                {newSale.made_purchase && (
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Amount *"
                      min="0"
                      step="0.01"
                      value={newSale.purchase_amount}
                      onChange={(e) => setNewSale({ ...newSale, purchase_amount: parseFloat(e.target.value) || 0 })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={newSale.purchase_date}
                      onChange={(e) => setNewSale({ ...newSale, purchase_date: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Payment method"
                      value={newSale.payment_method}
                      onChange={(e) => setNewSale({ ...newSale, payment_method: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                <button
                  onClick={addSale}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Sale Record
                </button>
              </div>
            </section>

            {/* Reservations Section */}
            <section className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Reservations
              </h3>
              <div className="space-y-2">
                {reservations.map((res) => (
                  <div key={res.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{res.venue_name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(res.reservation_date).toLocaleDateString()} at {res.reservation_time}
                        </p>
                        <p className="text-sm text-gray-600">
                          {res.party_size} guests • {res.reservation_type}
                        </p>
                        {res.confirmation_number && (
                          <p className="text-sm text-gray-500">Confirmation: {res.confirmation_number}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        res.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        res.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newReservation.reservation_type}
                    onChange={(e) => setNewReservation({ ...newReservation, reservation_type: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="spa">Spa</option>
                    <option value="tour">Tour</option>
                    <option value="transportation">Transportation</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Venue name *"
                    value={newReservation.venue_name}
                    onChange={(e) => setNewReservation({ ...newReservation, venue_name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    value={newReservation.reservation_date}
                    onChange={(e) => setNewReservation({ ...newReservation, reservation_date: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={newReservation.reservation_time}
                    onChange={(e) => setNewReservation({ ...newReservation, reservation_time: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={addReservation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Reservation
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}