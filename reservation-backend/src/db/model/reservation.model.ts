
import { Schema } from 'ottoman';

interface Reservation {
  sid: string;
  guestName: string;
  guestContactInfo: string;
  expectedArrivalTime: Date;
  reservedTableSize: number;
  reservationStatus: 'Pending' | 'Completed' | 'Cancelled';
}

const ReservationSchema = new Schema({
  sid: { type: String, required: true },
  guestName: { type: String, required: true },
  guestContactInfo: { type: String, required: true },
  expectedArrivalTime: { type: Date, required: true },
  reservedTableSize: { type: Number, required: true },
  reservationStatus: { type: String, required: true, enum: ['Pending', 'Completed', 'Cancelled'] },
}, { timestamps: true, });

ReservationSchema.index.findByGuestName = { by: 'guestName', type: 'n1ql' };

export { Reservation, ReservationSchema };
