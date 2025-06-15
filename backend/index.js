import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

// Import routes
import UserRoute from "./routes/userRoute.js";
import RoomRoute from "./routes/roomRoute.js";
import ScheduleRoute from "./routes/scheduleRoute.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['https://proyekweb.vercel.app'], // ganti ini
  credentials: true
}));

app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));
app.use(express.static("public"));

// API Routes
app.use(UserRoute);
app.use(RoomRoute);
app.use(ScheduleRoute);

// Optional: Group some routes under /api
app.use('/api', UserRoute); // ini redundant jika UserRoute sudah di-`use` di atas

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
