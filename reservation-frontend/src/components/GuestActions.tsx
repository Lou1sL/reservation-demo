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

const GuestActions: React.FC = () => {

  const [createReservation] = useMutation(CREATE_RESERVATION);

  const { data, loading, error, refetch } = useQuery(GET_RESERVATIONS, { variables: { page: 0, limit: 20 } });
  const [updateReservation] = useMutation(UPDATE_RESERVATION);

  const [editId, setEditId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestContactInfo, setGuestContactInfo] = useState('');
  const [expectedArrivalTime, setExpectedArrivalTime] = useState('');
  const [reservedTableSize, setReservedTableSize] = useState('');
  const [reservationStatus, setReservationStatus] = useState('');

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p>Error loading reservations!</p>;

  const handleCreate = async () => {
    await createReservation({
      variables: {
        guestName,
        guestContactInfo,
        expectedArrivalTime: new Date(expectedArrivalTime).toISOString(),
        reservedTableSize: parseInt(reservedTableSize as string, 0),
      }
    });
    refetch();
    setGuestName('');
    setGuestContactInfo('');
    setExpectedArrivalTime('');
    setReservedTableSize('');
    window.location.reload();
  };
  
  const handleEdit = (reservation: any) => {
    setEditId(reservation.id);
    setGuestName(reservation.guestName);
    setGuestContactInfo(reservation.guestContactInfo);
    setExpectedArrivalTime(reservation.expectedArrivalTime);
    setReservedTableSize(reservation.reservedTableSize);
    setReservationStatus(reservation.reservationStatus);
  };

  const handleSave = async () => {
    await updateReservation({
      variables: {
        id: editId,
        guestName,
        guestContactInfo,
        expectedArrivalTime: new Date(expectedArrivalTime).toISOString(),
        reservedTableSize: parseInt(reservedTableSize as string, 0),
        reservationStatus: reservationStatus,
      }
    });
    setEditId(null);
    refetch();
  };

  const handleChangeStatus = async (id: string, reservationStatus: string) => {
    await updateReservation({
      variables: {
        id,
        reservationStatus,
      }
    });
    refetch();
  };

  return (
    <div>
      <h3>Create New Reservation</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
        <input type="text" placeholder="Guest Name" value={guestName} onChange={e => setGuestName(e.target.value)} />
        <input type="text" placeholder="Contact Info" value={guestContactInfo} onChange={e => setGuestContactInfo(e.target.value)} />
        <input type="date" placeholder="Expected Arrival Time" value={expectedArrivalTime} onChange={e => setExpectedArrivalTime(e.target.value)} />
        <input type="number" placeholder="Table Size" value={reservedTableSize} onChange={e => setReservedTableSize(e.target.value)} />
        <button type="submit">Create Reservation</button>
      </form>
      <h2>My Reservations</h2>
      <ul>
        {data.reservations.map((reservation: any) => (
          <li key={reservation.id}>
            {editId === reservation.id ? (
              <div>
                <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} />
                <input type="text" value={guestContactInfo} onChange={e => setGuestContactInfo(e.target.value)} />
                <input type="date" value={expectedArrivalTime} onChange={e => setExpectedArrivalTime(e.target.value)} />
                <input type="number" value={reservedTableSize} onChange={e => setReservedTableSize(e.target.value)} />
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                name: {reservation.guestName} contact: {reservation.guestContactInfo} ETA: {reservation.expectedArrivalTime} size: {reservation.reservedTableSize} status: {reservation.reservationStatus}  
                <button onClick={() => handleEdit(reservation)}>Edit</button>
                <button onClick={() => handleChangeStatus(reservation.id, 'Cancelled')}>Set Cancelled</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuestActions;