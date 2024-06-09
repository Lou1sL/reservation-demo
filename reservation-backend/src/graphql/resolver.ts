
import { Request } from 'express';
import { DateTimeResolver } from 'graphql-scalars';
import { ReservationModel } from '../db';
import { login, logout, checkLoginStatus } from './auth';

export const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    reservations: async (
      _: any,
      { date, status, page, limit }: any,
      { req }: { req: Request },
    ) => {

      const filter: any = {};
      if(date) {
        // FE passes the desired ISO datetime that corresponds to thier tz
        const lb = new Date(date);
        const ub = new Date((new Date(date)).setDate((lb.getDate()) + 1));
        filter.expectedArrivalTime = { $gte: lb, $lt: ub };
      }
      if(status) filter.reservationStatus = status;

      if(!checkLoginStatus(req)) filter.sid = req.session.id;

      const options = {
        skip: page * limit,
        limit,
        // sort: { expectedArrivalTime: 'DESC' },
      };

      const resultDB = await ReservationModel.find(filter, options);

      return resultDB.rows;
    },
    loginStatus: async (
      _: any,
      __: any,
      { req }: { req: Request },
    ): Promise<boolean> => {
      return checkLoginStatus(req);
    }
  },
  Mutation: {
    login: async (
      _: any,
      { username, password }: any,
      { req }: { req: Request },
    ): Promise<boolean> => {
      console.log(username);
      return await login(req, username, password);
    },
    logout: async (
      _: any,
      __: any,
      { req }: { req: Request },
    ): Promise<boolean> => {
      logout(req);
      return true;
    },
    createReservation: async (
      _: any,
      { reservationInput: { guestName, guestContactInfo, expectedArrivalTime, reservedTableSize } }: any,
      { req }: { req: Request },
    ) => {
      const reserv = new ReservationModel({
        sid: req.session.id,
        guestName,
        guestContactInfo,
        expectedArrivalTime,
        reservedTableSize,
        reservationStatus: 'Pending',
      });
      const resultDB = await reserv.save();

      return resultDB;
    },
    updateReservation: async (
      _: any,
      { id, reservationUpdate }: any,
      { req }: { req: Request },
    ): Promise<{ success: boolean, message?: string }> => {
      const reserv = await ReservationModel.findById(id);
      if(!reserv) {
        return { success: false, message: 'Reservation not found' };
      }
      const isEmployee = checkLoginStatus(req);
      if(!isEmployee) {
        if(
          (reserv.sid !== req.session.id) ||
          (!!reservationUpdate.reservationStatus && reservationUpdate.reservationStatus !== 'Cancelled')
        ) {
          return { success: false, message: 'Unauthorized' };
        }
      }
      await ReservationModel.updateById(id, reservationUpdate);
      return { success: true };
    },
  },
};
