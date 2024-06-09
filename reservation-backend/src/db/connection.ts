
import { Ottoman } from 'ottoman';

import { Reservation, ReservationSchema } from './model/reservation.model';

const ottoman = new Ottoman({
  modelKey: '_type',
  scopeName: '_default'
});

const ReservationModel = ottoman.model<Reservation>('Reservation', ReservationSchema);

async function initialize(): Promise<void> {
  try {
    await ottoman.connect({
      bucketName: process.env.COUCHBASE_BUCKET || 'reservation-system',
      connectionString: process.env.COUCHBASE_CONNECTION_STRING || 'couchbase://localhost',
      username: process.env.COUCHBASE_USER,
      password: process.env.COUCHBASE_PASSWORD,
    });
    await ottoman.start();
  } catch (e) {
    console.log(e);
  }
}

export { initialize, ReservationModel, Reservation };
