import { createServer } from 'node:http';
import express from 'express';
import dotenv from 'dotenv';

//Initialisation de notre application avec express
const app = express();


//Middlewares
app.use(express.json());


//Gestion du port 
const PORT = process.env.PORT || 3000;

// starts a simple http server locally on port 3000
app.listen(PORT, '127.0.0.1', () => {
  console.log('Notre application a bien démarré : 127.0.0.1:3000');
});

// run with `node server.mjs`
