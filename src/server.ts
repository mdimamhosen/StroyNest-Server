import { Server } from 'http';
import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

const port = process.env.PORT || 8000;

let isConnected = false;

let server: Server;

async function main() {
  try {
    const connection = await mongoose.connect(config.mongoUri as string);

    if (!isConnected) {
      console.log(`Connected to database ${connection.connection.host}`);
      isConnected = true;
    }

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log('👹Shutting down server due to unhandled promise rejection👹');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('👹SIGTERM RECEIVED. Shutting down server👹');
  if (server) {
    server.close(() => {
      console.log('💥Process terminated💥');
    });
  }
});

process.on('uncaughtException', () => {
  console.log('👹Shutting down server due to uncaught exception👹');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
