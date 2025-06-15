import express from "express";
import cors from "cors";
import UserRoute from "./routes/userRoute.js"
import RoomRoute from "./routes/roomRoute.js"
import ScheduleRoute from "./routes/scheduleRoute.js"
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import fileUpload from "express-fileupload";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use(express.static("public"));
app.use(UserRoute);
app.use(RoomRoute);
app.use(ScheduleRoute);
app.use('/api', userRoute);

app.listen(5000, ()=> console.log("Server Running!!  ...."))