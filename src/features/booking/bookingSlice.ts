import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface RoomBooking {
  id: number;
  roomId: number;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface TableReservation {
  id: number;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface BookingState {
  roomBookings: RoomBooking[];
  tableReservations: TableReservation[];
}

const initialState: BookingState = {
  roomBookings: [],
  tableReservations: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    bookRoom: (state, action: PayloadAction<Omit<RoomBooking, 'id' | 'status'>>) => {
      const newBooking: RoomBooking = {
        ...action.payload,
        id: Date.now(),
        status: 'pending',
      };
      state.roomBookings.push(newBooking);
    },
    reserveTable: (state, action: PayloadAction<Omit<TableReservation, 'id' | 'status'>>) => {
      const newReservation: TableReservation = {
        ...action.payload,
        id: Date.now(),
        status: 'pending',
      };
      state.tableReservations.push(newReservation);
    },
    cancelRoomBooking: (state, action: PayloadAction<number>) => {
      const booking = state.roomBookings.find(b => b.id === action.payload);
      if (booking) {
        booking.status = 'cancelled';
      }
    },
    cancelTableReservation: (state, action: PayloadAction<number>) => {
      const reservation = state.tableReservations.find(r => r.id === action.payload);
      if (reservation) {
        reservation.status = 'cancelled';
      }
    },
  },
});

export const { bookRoom, reserveTable, cancelRoomBooking, cancelTableReservation } = bookingSlice.actions;
export default bookingSlice.reducer;