
import dotenv from 'dotenv';
const cfg = dotenv.config();
console.log('dotenv', cfg.parsed);

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import { ApolloServer } from 'apollo-server-express';

import { resolvers, typeDefs } from './graphql';
import * as DB from './db/connection';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
console.log('Redis connected successfully');

const redisStore = new RedisStore({ client: redisClient, prefix: 'session:', ttl: 365 * 24 * 60 * 60 });
const app = express();
app.use(session({
  store: redisStore,
  secret: '123456',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 365 * 24 * 60 * 60,
  },
}));
const corsOptions = {
  origin: process.env.FRONTEND_CORS_URL || 'http://localhost:3001',
  optionsSuccessStatus: 200,
  credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

const gqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

async function startServer() {

  await DB.initialize();
  console.log('Couchbase connected successfully');

  await gqlServer.start();
  gqlServer.applyMiddleware({ app, cors: corsOptions });
  console.log('GraphQL started successfully');
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

export { app, gqlServer }; 
