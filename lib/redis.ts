import Redis from 'ioredis';

const redis = new Redis({
  port: 6379, // Redis port
  host: process.env.NODE_ENV === 'production' ? 'cache' : 'localhost', // Use the service name in production, and localhost in development
  //   password: process.env.REDIS_PASSWORD, // fetch password from environment variables
  db: 0,
});

export default redis;
