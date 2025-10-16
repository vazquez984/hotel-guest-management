import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EditReservationModal from './EditReservationModal';
import { Reservation, supabase } from '../lib/supabase';

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

describe('EditReservationModal', () => {
    const reservation: Reservation = {
        id: '1',
        venue_name: 'Test Venue',
        reservation_date: '2024-01-01',
        reservation_time: '10:00',
        status: 'requested'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(
            <EditReservationModal
                reservation={reservation}
                onClose={() => {}}
                onSave={() => {}}
                onDelete={() => {}}
            />
        );
        expect(screen.getByText('Edit Reservation')).toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        const onClose = vi.fn();
        render(
            <EditReservationModal
                reservation={reservation}
                onClose={onClose}
                onSave={() => {}}
                onDelete={() => {}}
            />
        );
        fireEvent.click(screen.getByText('Close'));
        expect(onClose).toHaveBeenCalled();
    });

    it('updates reservation on save button click', async () => {
        const onSave = vi.fn();
        render(
            <EditReservationModal
                reservation={reservation}
                onClose={() => {}}
                onSave={onSave}
                onDelete={() => {}}
            />
        );

        fireEvent.change(screen.getByLabelText('Venue'), { target: { value: 'Updated Venue' } });
        fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-01-02' } });
        fireEvent.change(screen.getByLabelText('Time'), { target: { value: '11:00' } });

        fireEvent.click(screen.getByText('Save Changes'));

        await waitFor(() => {
            expect(supabase.from('reservations').update).toHaveBeenCalledWith({
                venue_name: 'Updated Venue',
                reservation_date: '2024-01-02',
                reservation_time: '11:00',
                status: 'requested',
            });
            expect(onSave).toHaveBeenCalledWith({ id: '1' });
        });
    });

    it('deletes reservation on delete button click', async () => {
        const onDelete = vi.fn();
        render(
            <EditReservationModal
                reservation={reservation}
                onClose={() => {}}
                onSave={() => {}}
                onDelete={onDelete}
            />
        );

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(supabase.from('reservations').delete).toHaveBeenCalled();
            expect(onDelete).toHaveBeenCalledWith('1');
        });
    });
});
