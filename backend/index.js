import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {Server} from "socket.io";
import http from "http";

// import cron from "node-cron";
import KaryawanRoute from "./routes/KaryawanRoute.js"
import PlafondRoute from "./routes/PlafondRoute.js"
import PinjamanRoute from "./routes/PinjamanRoute.js"
import AntreanPengajuan from "./routes/AntreanPengajuanRoute.js";
import AngsuranRoute from "./routes/AngsuranRoute.js"; 
// import updateAngsuranOtomatis from './routes/UpdateAngsuranOtomatis.js';

import UserRoute from "./routes/UserRoutes.js";
import verifyToken from "./middlewares/authMiddleware.js";
import checkSessionTimeout from "./middlewares/checkSessionTimeout.js";
import dotenv from 'dotenv';
import "./cronjobs.js";

import './models/PinjamanModel.js';
import './models/KaryawanModel.js';
import './models/AntreanPengajuanModel.js';
import './models/Association.js';
import './models/AngsuranModel.js';
import './models/PlafondModel.js'; 
import './models/UserModel.js';
import jwt from 'jsonwebtoken';

// import io from "socket.io-client";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://10.70.10.139:3000",
        methods: ["GET", "POST"], 
        credentials: true,
    }
});

io.on("connection", (socket) => {
    console.log("Client connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected: ", socket.id);
    });
}); 

app.set("io", io);



app.use(bodyParser.json());
app.use(cors({origin: "http://10.70.10.139:3000", credentials: true}));
app.use(express.json());

app.use(UserRoute); // Rute user untuk login, tanpa middleware otentikasi

const protectedRoutes = [
    KaryawanRoute,
    PlafondRoute,
    PinjamanRoute,
    AntreanPengajuan,
    AngsuranRoute,
    // PlafondUpdateRoute,
    // updateAngsuranOtomatis
];

// Terapkan middleware otentikasi pada routes yang dilindungi
protectedRoutes.forEach(route => {
    app.use(verifyToken, checkSessionTimeout, route); 
});

// app.listen(5000, () => console.log('Server up and running on port 5000'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

