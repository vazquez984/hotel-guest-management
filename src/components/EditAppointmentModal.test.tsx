import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EditAppointmentModal from './EditAppointmentModal';
import { Appointment, supabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn().mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockResolvedValue({ data: [{ id: '1' }], error: null }),
                }),
            }),
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        }),
    },
}));

describe('EditAppointmentModal', () => {
    const appointment: Appointment = {
        id: '1',
        title: 'Test Appointment',
        appointment_date: '2024-01-01',
        appointment_time: '10:00',
        status: 'scheduled'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(
            <EditAppointmentModal
                appointment={appointment}
                onClose={() => {}}
                onSave={() => {}}
                onDelete={() => {}}
            />
        );
        expect(screen.getByText('Edit Appointment')).toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        const onClose = vi.fn();
        render(
            <EditAppointmentModal
                appointment={appointment}
                onClose={onClose}
                onSave={() => {}}
                onDelete={() => {}}
            />
        );
        fireEvent.click(screen.getByText('Close'));
        expect(onClose).toHaveBeenCalled();
    });

    it('updates appointment on save button click', async () => {
        const onSave = vi.fn();
        render(
            <EditAppointmentModal
                appointment={appointment}
                onClose={() => {}}
                onSave={onSave}
                onDelete={() => {}}
            />
        );

        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } });
        fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-01-02' } });
        fireEvent.change(screen.getByLabelText('Time'), { target: { value: '11:00' } });

        fireEvent.click(screen.getByText('Save Changes'));

        await waitFor(() => {
            expect(supabase.from('appointments').update).toHaveBeenCalledWith({
                title: 'Updated Title',
                appointment_date: '2024-01-02',
                appointment_time: '11:00',
                status: 'scheduled',
            });
            expect(onSave).toHaveBeenCalledWith({ id: '1' });
        });
    });

    it('deletes appointment on delete button click', async () => {
        const onDelete = vi.fn();
        render(
            <EditAppointmentModal
                appointment={appointment}
                onClose={() => {}}
                onSave={() => {}}
                onDelete={onDelete}
            />
        );

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(supabase.from('appointments').delete).toHaveBeenCalled();
            expect(onDelete).toHaveBeenCalledWith('1');
        });
    });

    it('cancels appointment on cancel button click', async () => {
        const onSave = vi.fn();
        render(
            <EditAppointmentModal
                appointment={appointment}
                onClose={() => {}}
                onSave={onSave}
                onDelete={() => {}}
            />
        );

        fireEvent.click(screen.getByText('Cancel'));

        await waitFor(() => {
            expect(supabase.from('appointments').update).toHaveBeenCalledWith({ status: 'canceled' });
            expect(onSave).toHaveBeenCalledWith({ id: '1' });
        });
    });
});
