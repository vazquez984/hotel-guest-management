import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Define the CalendarEvent interface
interface CalendarEvent {
  id: string;
  type: 'appointment' | 'reservation' | 'event';
  title: string;
  date: string;
  time: string;
  guestName: string;
  status?: string;
}

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, event }) => {
  const [formData, setFormData] = useState({ title: '', date: '', time: '', status: '' });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        status: event.status || 'scheduled', // Default to 'scheduled' if status is not set
      });
    }
  }, [event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getTableName = () => {
    switch (event.type) {
      case 'appointment':
        return 'appointments';
      case 'reservation':
        return 'reservations';
      case 'event':
        return 'guest_events';
      default:
        throw new Error('Invalid event type');
    }
  };

  const handleSave = async () => {
    if (!event) return;

    const tableName = getTableName();
    const originalStatus = event.status;
    const newStatus = formData.status;

    let updateData: any = {};

    // Prepare data for the primary update
    switch (event.type) {
        case 'appointment':
            updateData = {
                title: formData.title,
                appointment_date: formData.date,
                appointment_time: formData.time,
                status: newStatus,
            };
            break;
        case 'reservation':
            updateData = {
                venue_name: formData.title.split(' (')[0],
                reservation_date: formData.date,
                reservation_time: formData.time,
                status: newStatus,
            };
            break;
        case 'event':
            updateData = {
                event_name: formData.title,
                event_date: formData.date,
                attended: newStatus === 'attended',
            };
            break;
    }

    try {
        // 1. Update the event itself
        const { error: updateError } = await supabase.from(tableName).update(updateData).eq('id', event.id);
        if (updateError) throw updateError;

        // 2. If it's an appointment, handle the sales logic
        if (event.type === 'appointment' && originalStatus !== newStatus) {
            const isNowCompleted = newStatus === 'completed';

            // Fetch the appointment to get the guest_id
            const { data: appointmentData, error: appointmentError } = await supabase
                .from('appointments')
                .select('guest_id')
                .eq('id', event.id)
                .single();

            if (appointmentError || !appointmentData) {
                throw new Error('Could not find the appointment to update sales status.');
            }

            const { guest_id } = appointmentData;

            // Find an existing sales record for the guest
            const { data: saleData, error: saleError } = await supabase
                .from('sales')
                .select('id')
                .eq('guest_id', guest_id)
                .maybeSingle();

            if (saleError) throw saleError;

            const newAttendedStatus = isNowCompleted;

            if (saleData) {
                // If a sales record exists, update it
                const { error: updateSaleError } = await supabase
                    .from('sales')
                    .update({ attended_presentation: newAttendedStatus })
                    .eq('id', saleData.id);
                if (updateSaleError) throw updateSaleError;
            } else if (isNowCompleted) {
                // If no record exists and the appointment is completed, create one
                const { error: insertSaleError } = await supabase
                    .from('sales')
                    .insert({ guest_id: guest_id, attended_presentation: true });
                if (insertSaleError) throw insertSaleError;
            }
        }

        onClose(); // Close modal on success
    } catch (error) {
        console.error('Error during save operation:', error);
        // Optionally, show an error message to the user
    }
};

  const handleDelete = async () => {
    if (!event || !window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    const tableName = getTableName();

    try {
      const { error } = await supabase.from(tableName).delete().eq('id', event.id);
      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  const getModalTitle = () => {
    if (!event) return '';
    switch (event.type) {
      case 'appointment':
        return 'Edit Appointment';
      case 'reservation':
        return 'Edit Reservation';
      case 'event':
        return 'Edit Event';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">{getModalTitle()}</h3>
          <div className="mt-4">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {event.type !== 'event' && (
              <div className="mb-4">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  name="time"
                  id="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {event.type === 'event' ? (
                  <>
                    <option value="scheduled">Scheduled</option>
                    <option value="attended">Attended</option>
                  </>
                ) : (
                  <>
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
              </select>
            </div>
          </div>
          <div className="flex justify-end items-center px-4 py-3 space-x-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className="rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
