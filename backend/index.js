import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

import UserRoute from "./routes/userRoute.js";
import RoomRoute from "./routes/roomRoute.js";
import ScheduleRoute from "./routes/scheduleRoute.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: ['https://proyekweb-9ze57e1z-irsyadiths-projects.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));
app.use(express.static("public"));

app.use('/api', UserRoute);
app.use('/api', RoomRoute);
app.use('/api', ScheduleRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
