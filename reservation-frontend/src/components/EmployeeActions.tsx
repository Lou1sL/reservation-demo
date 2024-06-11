import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';

const GET_RESERVATIONS = gql`
  query Reservations($page: Int!, $limit: Int!) {
    reservations(page: $page, limit: $limit) {
      id
      guestName
      guestContactInfo
      expectedArrivalTime
      reservedTableSize
      reservationStatus
    }
  }
`;

const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($id: String!, $guestName: String, $guestContactInfo: String, $expectedArrivalTime: DateTime, $reservedTableSize: Int, $reservationStatus: ReservationStatus) {
    updateReservation(id: $id, reservationUpdate: { guestName: $guestName, guestContactInfo: $guestContactInfo, expectedArrivalTime: $expectedArrivalTime, reservedTableSize: $reservedTableSize, reservationStatus: $reservationStatus }) {
      success
      message
    }
  }
`;

interface Reservation {
  id?: string;
  guestName: string;
  guestContactInfo: string;
  expectedArrivalTime: string;
  reservedTableSize: number;
  reservationStatus?: string;
}

const EmployeeActions: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_RESERVATIONS, { variables: { page: 0, limit: 20 } });
  
  const [updateReservation] = useMutation(UPDATE_RESERVATION);
  const [updateData, setUpdateData] = useState<Reservation>({
    id: '',
    guestName: '',
    guestContactInfo: '',
    expectedArrivalTime: new Date().toISOString(),
    reservedTableSize: 1,
  });

  if (loading) return <p>Loading all reservations...</p>;
  if (error) return <p>Error loading all reservations!</p>;

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInfo = async () => {
    await updateReservation({
      variables: { ...updateData, reservationStatus: undefined },
    });
    setUpdateData((prev) => ({ ...prev, id: '' }));
    refetch();
  };

  const handleUpdateStatus = async (id: any, reservationStatus: string) => {
    await updateReservation({
      variables: { id, reservationStatus },
    });
    refetch();
  };

  return (
    <div>
      <h2>All Reservations</h2>
      <ul>
        {data.reservations.map((reservation: Reservation) => (
          <li key={reservation.id}>
            {updateData.id === reservation.id ? (
              <div>
                <input type="text" name="guestName" value={updateData.guestName} onChange={handleEdit} />
                <input type="text" name="guestContactInfo" value={updateData.guestContactInfo} onChange={handleEdit} />
                <input type="text" name="expectedArrivalTime" value={updateData.expectedArrivalTime} onChange={handleEdit} />
                <input type="number" name="reservedTableSize" value={updateData.reservedTableSize} onChange={handleEdit} />
                <button onClick={handleUpdateInfo}>Save</button>
                <button onClick={() => setUpdateData((prev) => ({ ...prev, id: '' }))}>Cancel</button>
              </div>
            ) : (
              <div>
                name: {reservation.guestName} contact: {reservation.guestContactInfo} ETA: {reservation.expectedArrivalTime} size: {reservation.reservedTableSize} status: {reservation.reservationStatus}  
                <button onClick={() => setUpdateData(reservation)}>Edit</button>
                <button onClick={() => handleUpdateStatus(reservation.id, 'Completed')}>Set Completed</button>
                <button onClick={() => handleUpdateStatus(reservation.id, 'Cancelled')}>Set Cancelled</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeActions;
