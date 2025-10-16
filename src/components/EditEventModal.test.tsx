import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EditEventModal from './EditEventModal';
import { supabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn().mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        }),
    },
}));

describe('EditEventModal', () => {
    const event = {
        id: '1',
        type: 'appointment' as const,
        title: 'Test Event',
        date: '2024-01-01',
        time: '10:00',
        guestName: 'Test Guest'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(
            <EditEventModal
                isOpen={true}
                onClose={() => {}}
                event={event}
            />
        );
        expect(screen.getByText('Edit Appointment')).toBeInTheDocument();
    });

    it('calls onClose when the cancel button is clicked', () => {
        const onClose = vi.fn();
        render(
            <EditEventModal
                isOpen={true}
                onClose={onClose}
                event={event}
            />
        );
        fireEvent.click(screen.getByText('Cancel'));
        expect(onClose).toHaveBeenCalled();
    });

    it('updates appointment on save button click', async () => {
        const onClose = vi.fn();
        render(
            <EditEventModal
                isOpen={true}
                onClose={onClose}
                event={event}
            />
        );

        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } });
        fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-01-02' } });
        fireEvent.change(screen.getByLabelText('Time'), { target: { value: '11:00' } });

        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('appointments');
            expect(supabase.from('appointments').update).toHaveBeenCalledWith({
                title: 'Updated Title',
                appointment_date: '2024-01-02',
                appointment_time: '11:00',
                status: 'scheduled',
            });
            expect(supabase.from('appointments').update({}).eq).toHaveBeenCalledWith('id', '1');
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('deletes event when delete button is clicked and confirmed', async () => {
        const onClose = vi.fn();
        window.confirm = vi.fn(() => true); 

        render(
            <EditEventModal
                isOpen={true}
                onClose={onClose}
                event={event}
            />
        );

        fireEvent.click(screen.getByText('Delete'));

        expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this event?');

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('appointments');
            expect(supabase.from('appointments').delete).toHaveBeenCalled();
            expect(supabase.from('appointments').delete().eq).toHaveBeenCalledWith('id', '1');
            expect(onClose).toHaveBeenCalled();
        });
    });
});
