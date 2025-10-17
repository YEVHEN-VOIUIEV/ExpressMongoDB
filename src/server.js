import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import studentsRouter from './routers/students.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';


const PORT = Number(getEnvVar('PORT', '3000'));

const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

export const startServer = () => {

  const app = express();

  app.use(cors(/*corsOptions*/));

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello, World!',
    });
  });

  app.use(studentsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}
