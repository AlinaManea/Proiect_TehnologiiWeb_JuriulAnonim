import express from 'express';
import env from 'dotenv';
import DB_Init from './entities/DB_init.js';
import mysql from 'mysql2/promise'
import {DB_USERNAME,DB_PASSWORD} from './Const.js'
import createDbRouter from './routes/createDBRoute.js';
import utilizatorRouter from './routes/UtilizatorRoutes.js';
import echipaRouter from './routes/EchipaRouter.js';
import proiectRouter from './routes/ProiectRouter.js';
import livrabilRouter from './routes/LivrabilRouter.js';
import evaluareRouter from './routes/EvaluareRouter.js';
import routerAuth from './routes/AutentificareRoute.js';
import cors from 'cors';

env.config();

let app = express();
let router = express.Router();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true,  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  

app.use('/api',createDbRouter);
app.use('/api', utilizatorRouter);
app.use('/api', echipaRouter);
app.use('/api', proiectRouter);
app.use('/api', livrabilRouter);
app.use('/api', evaluareRouter);
app.use('/api/auth', routerAuth);

// app.use(express.static('public'))
//  app.use(cors());
// app.use("/api", router);

DB_Init();

let port = process.env.PORT || 8001;
app.listen(port);
console.log(`API is running at ` + port);