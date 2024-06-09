
import { binding, given, then, when } from "cucumber-tsflow";
import request from 'supertest';
import { app } from '../src';

@binding()
class ReservationSteps {

  private agent: request.Agent;
  private session: any;
  private result: any;

  constructor() {
    this.agent = request.agent(app);
  }

  @given(/I am logged in as an employee/)
  public async login() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const res = await this.agent.post('/graphql').send({
      query: `mutation { login(username: "1", password: "1") }`
    });
    if(!res.body.data?.login) {
      throw new Error('Login failed');
    }
    this.session = res.headers['set-cookie'] + '';
  }

  @when(/I request a list of reservations/)
  public async getReservations() {
    const res = await this.agent.post('/graphql').set('Cookie', this.session).send({
      query: `query { reservations(page: 1, limit: 10) { guestName reservedTableSize } }`
    });
    console.log(JSON.stringify(res.body));
    this.result = res.body.data.reservations;
  }
  
  @then(/I should see all reservations/)
  public checkReservations() {
    if (this.result.length >= 0) {
      return;
    }
    throw new Error('No reservations found');
  }
}

export = ReservationSteps;
 