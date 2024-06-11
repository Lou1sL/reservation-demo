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

const CREATE_RESERVATION = gql`
  mutation CreateReservation($guestName: String!, $guestContactInfo: String!, $expectedArrivalTime: DateTime!, $reservedTableSize: Int!) {
    createReservation(reservationInput: { guestName: $guestName, guestContactInfo: $guestContactInfo, expectedArrivalTime: $expectedArrivalTime, reservedTableSize: $reservedTableSize }) {
      id
      guestName
      guestContactInfo
      expectedArrivalTime
      reservedTableSize
      reservationStatus
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

const ReservationForm: React.FC = () => {
  const [createReservation] = useMutation(CREATE_RESERVATION);
  const [formData, setFormData] = useState<Reservation>({
    guestName: '',
    guestContactInfo: '',
    expectedArrivalTime: new Date().toISOString(),
    reservedTableSize: 1,
  });

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReservation({
      variables: formData,
    });
    window.location.reload();
  };

  return (
    <form onSubmit={handleCreate}>
      <input type="text" name="guestName" placeholder="Guest Name" value={formData.guestName} onChange={handleEdit} />
      <input type="text" name="guestContactInfo" placeholder="Contact Info" value={formData.guestContactInfo} onChange={handleEdit} />
      <input type="text" name="expectedArrivalTime" placeholder="Expected Arrival Time" value={formData.expectedArrivalTime} onChange={handleEdit} />
      <input type="number" name="reservedTableSize" placeholder="Table Size" value={formData.reservedTableSize} onChange={handleEdit} />
      <button type="submit">Save</button>
    </form>
  );
};

const GuestActions: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_RESERVATIONS, { variables: { page: 0, limit: 20 } });

  const [updateReservation] = useMutation(UPDATE_RESERVATION);
  const [updateData, setUpdateData] = useState<Reservation>({
    id: '',
    guestName: '',
    guestContactInfo: '',
    expectedArrivalTime: new Date().toISOString(),
    reservedTableSize: 1,
  });

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p>Error loading reservations!</p>;

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
      <h3>Create New Reservation</h3>
      <ReservationForm />
      <h2>My Reservations</h2>
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
                <button onClick={() => handleUpdateStatus(reservation.id, 'Cancelled')}>Set Cancelled</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuestActions;