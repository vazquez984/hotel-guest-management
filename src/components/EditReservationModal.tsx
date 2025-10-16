
import { supabase, Reservation } from '../lib/supabase';
import { useState } from 'react';

/**
 * Props for the EditReservationModal component.
 * @interface EditReservationModalProps
 * @property {Reservation | null} reservation - The reservation object to edit. If null, the modal is not displayed.
 * @property {() => void} onClose - Function to call when the modal is closed.
 * @property {(updatedReservation: Reservation) => void} onSave - Function to call when the reservation is saved.
 * @property {(reservationId: string) => void} onDelete - Function to call when the reservation is deleted.
 */
interface EditReservationModalProps {
  reservation: Reservation | null;
  onClose: () => void;
  onSave: (updatedReservation: Reservation) => void;
  onDelete: (reservationId: string) => void;
}

/**
 * A modal component for editing, creating, or deleting a reservation.
 * @param {EditReservationModalProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered component or null if no reservation is provided.
 */
export default function EditReservationModal({ reservation, onClose, onSave, onDelete }: EditReservationModalProps) {
  // State to manage the form data for the reservation.
  const [formData, setFormData] = useState<Partial<Reservation>>(reservation || {});

  // If no reservation is selected, do not render the modal.
  if (!reservation) return null;

  /**
   * Handles changes to the form inputs and updates the form data state.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles saving the updated reservation data to the Supabase database.
   */
  const handleSave = async () => {
    if (!formData.id) return;

    // Supabase query to update the reservation.
    const { data, error } = await supabase
      .from('reservations')
      .update({
        venue_name: formData.venue_name,
        reservation_date: formData.reservation_date,
        reservation_time: formData.reservation_time,
        status: formData.status
      })
      .eq('id', formData.id)
      .select();

    if (error) {
      console.error('Error updating reservation:', error);
    } else if (data) {
      // On successful save, trigger the onSave callback.
      onSave(data[0] as Reservation);
    }
  };

  /**
   * Handles deleting the reservation from the Supabase database.
   */
  const handleDelete = async () => {
    if (!formData.id) return;

    // Supabase query to delete the reservation.
    const { error } = await supabase.from('reservations').delete().eq('id', formData.id);
    if (error) {
      console.error('Error deleting reservation:', error);
    } else {
      // On successful deletion, trigger the onDelete callback.
      onDelete(formData.id);
    }
  };

  // Render the modal with a form for editing the reservation.
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Edit Reservation</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="venue_name" className="block text-sm font-medium text-gray-700">Venue</label>
            <input
              type="text"
              name="venue_name"
              id="venue_name"
              value={formData.venue_name || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="reservation_date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="reservation_date"
              id="reservation_date"
              value={formData.reservation_date || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="reservation_time" className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              name="reservation_time"
              id="reservation_time"
              value={formData.reservation_time || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              id="status"
              value={formData.status || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="requested">Requested</option>
              <option value="confirmed">Confirmed</option>
              <option value="canceled">Canceled</option>
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
