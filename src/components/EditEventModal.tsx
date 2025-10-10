
import { supabase, GuestEvent } from '../lib/supabase';
import { useState, useEffect } from 'react';

/**
 * Props for the EditEventModal component.
 * @interface EditEventModalProps
 * @property {GuestEvent | null} event - The event object to edit. If null, the modal is not displayed.
 * @property {() => void} onClose - Function to call when the modal is closed.
 * @property {(updatedEvent: GuestEvent) => void} onSave - Function to call when the event is saved.
 * @property {(eventId: string) => void} onDelete - Function to call when the event is deleted.
 */
interface EditEventModalProps {
  event: GuestEvent | null;
  onClose: () => void;
  onSave: (updatedEvent: GuestEvent) => void;
  onDelete: (eventId: string) => void;
}

/**
 * A modal component for editing, creating, or deleting a guest event.
 * @param {EditEventModalProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered component or null if no event is provided.
 */
export default function EditEventModal({ event, onClose, onSave, onDelete }: EditEventModalProps) {
  // State to manage the form data for the event.
  const [formData, setFormData] = useState<Partial<GuestEvent>>({});

  // Effect to populate the form data when an event is selected.
  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  // If no event is selected, do not render the modal.
  if (!event) return null;

  /**
   * Handles changes to the form inputs and updates the form data state.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'attended' ? value === 'true' : value }));
  };

  /**
   * Handles saving the updated event data to the Supabase database.
   */
  const handleSave = async () => {
    if (!formData.id) return;

    // Supabase query to update the event.
    const { data, error } = await supabase
      .from('guest_events')
      .update({
        event_name: formData.event_name,
        event_date: formData.event_date,
        attended: formData.attended
      })
      .eq('id', formData.id)
      .select();

    if (error) {
      console.error('Error updating event:', error);
    } else if (data) {
      // On successful save, trigger the onSave callback.
      onSave(data[0] as GuestEvent);
    }
  };

  /**
   * Handles deleting the event from the Supabase database.
   */
  const handleDelete = async () => {
    if (!formData.id) return;

    // Supabase query to delete the event.
    const { error } = await supabase.from('guest_events').delete().eq('id', formData.id);
    if (error) {
      console.error('Error deleting event:', error);
    } else {
      // On successful deletion, trigger the onDelete callback.
      onDelete(formData.id);
    }
  };

  // Render the modal with a form for editing the event.
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="event_name" className="block text-sm font-medium text-gray-700">Event Name</label>
            <input
              type="text"
              name="event_name"
              id="event_name"
              value={formData.event_name || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="event_date"
              id="event_date"
              value={formData.event_date || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="attended" className="block text-sm font-medium text-gray-700">Attended</label>
            <select
              name="attended"
              id="attended"
              value={formData.attended ? 'true' : 'false'}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="true">Attended</option>
              <option value="false">Not Attended</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
