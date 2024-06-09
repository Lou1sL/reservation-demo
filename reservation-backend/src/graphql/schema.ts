
import { gql } from 'apollo-server-express';
import { DateTimeTypeDefinition } from 'graphql-scalars';

export const typeDefs = gql`
  ${DateTimeTypeDefinition}
  type Query {
    reservations(date: DateTime, status: ReservationStatus, page: Int!, limit: Int!): [Reservation]
    loginStatus: Boolean
  }

  type Mutation {
    login(username: String!, password: String!): Boolean
    logout: Boolean
    createReservation(reservationInput: ReservationInput!): Reservation
    updateReservation(id: String!, reservationUpdate: ReservationUpdate!): Response
  }
  
  input ReservationInput {
    guestName: String!
    guestContactInfo: String!
    expectedArrivalTime: DateTime!
    reservedTableSize: Int!
  }

  input ReservationUpdate {
    guestName: String
    guestContactInfo: String
    expectedArrivalTime: DateTime
    reservedTableSize: Int
    reservationStatus: ReservationStatus
  }

  type Reservation {
    id: String!
    guestName: String!
    guestContactInfo: String!
    expectedArrivalTime: DateTime!
    reservedTableSize: Int!
    reservationStatus: ReservationStatus!
  }

  enum ReservationStatus {
    Pending
    Completed
    Cancelled
  }
  
  type Response {
    success: Boolean!
    message: String
  }
`;
