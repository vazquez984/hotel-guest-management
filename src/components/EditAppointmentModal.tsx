
import { supabase, Appointment } from '../lib/supabase';
import { useState, useEffect } from 'react';

interface EditAppointmentModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (updatedAppointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

export default function EditAppointmentModal({ appointment, onClose, onSave, onDelete }: EditAppointmentModalProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>({});

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.id) return;

    const { data, error } = await supabase
      .from('appointments')
      .update({
        title: formData.title,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        status: formData.status
      })
      .eq('id', formData.id)
      .select();

    if (error) {
      console.error('Error updating appointment:', error);
    } else if (data) {
      onSave(data[0] as Appointment);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    const { error } = await supabase.from('appointments').delete().eq('id', formData.id);
    if (error) {
      console.error('Error deleting appointment:', error);
    } else {
      onDelete(formData.id);
    }
  };

  const handleCancel = async () => {
    if (!formData.id) return;
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'canceled' })
      .eq('id', formData.id)
      .select();
    if (error) {
        console.error('Error canceling appointment:', error);
    } else if (data) {
        onSave(data[0] as Appointment);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Edit Appointment</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="appointment_date"
              id="appointment_date"
              value={formData.appointment_date || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              name="appointment_time"
              id="appointment_time"
              value={formData.appointment_time || ''}
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
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
          <button onClick={handleCancel} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
