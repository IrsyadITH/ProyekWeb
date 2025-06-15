// src/routes/scheduleRoute.js
import express from "express";
import {
    getSchedule,
    getScheduleById,
    addSchedule,        // Fungsi ini yang menangani kedua admin dan dosen
    deleteSchedule,
    getPendingSchedules,
    confirmSchedule
} from "../controller/scheduleController.js";

const router = express.Router();

// --- Rute GET ---
// Rute umum untuk mendapatkan semua jadwal
router.get('/jadwal', getSchedule);

// Rute yang lebih spesifik harus di atas yang lebih umum (untuk rute GET dengan parameter)
// Rute untuk mendapatkan jadwal pending (lebih spesifik dari /jadwal/:id)
router.get('/jadwal/pending', getPendingSchedules);

// Rute untuk mendapatkan jadwal berdasarkan ID (yang paling umum dengan parameter)
router.get('/jadwal/:id', getScheduleById);


// --- Rute POST ---
// Rute untuk Admin menambah jadwal (status confirmed)
router.post('/jadwal', addSchedule);

// Rute untuk Dosen mengajukan permintaan jadwal (status pending)
router.post('/jadwal/request', addSchedule); // <--- BARIS INI YANG SEBELUMNYA HILANG


// --- Rute PATCH ---
// Rute untuk mengkonfirmasi atau menolak jadwal (oleh Admin)
router.patch('/jadwal/confirm/:id', confirmSchedule);


// --- Rute DELETE ---
router.delete('/jadwal/:id', deleteSchedule);


export default router;