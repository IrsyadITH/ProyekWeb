import Schedule from "../models/scheduleModel.js";
import { Op } from "sequelize";

// Ambil semua jadwal yang SUDAH DIKONFIRMASI saja
export const getSchedule = async (req, res) => {
  try {
    const response = await Schedule.findAll({
      where: {
        status: "confirmed", // Filter hanya jadwal yang dikonfirmasi
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching schedules:", error.message);
    res.status(500).json({ msg: "Gagal mengambil data jadwal." });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const response = await Schedule.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "Jadwal tidak ditemukan." });
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching schedule by ID:", error.message);
    res.status(500).json({ msg: "Gagal mengambil data jadwal berdasarkan ID." });
  }
};

export const addSchedule = async (req, res) => {
  const { hari, jam, kodeRuangan, kodeKelas, mataKuliah, dosenPengampu, addedBy } = req.body;

  try {
    const existingSchedule = await Schedule.findOne({
      where: {
        hari,
        jam,
        kodeRuangan,
        [Op.or]: [{ status: 'confirmed' }, { status: 'pending' }],
      },
    });

    if (existingSchedule) {
      return res.status(409).json({
        msg: "Slot jadwal ini sudah terisi atau sedang dalam proses konfirmasi.",
      });
    }

    const status = (addedBy === 'Dosen' || addedBy === 'Mahasiswa') ? 'pending' : 'confirmed';


    await Schedule.create({
      hari,
      jam,
      kodeRuangan,
      kodeKelas,
      mataKuliah,
      dosenPengampu,
      addedBy: addedBy || 'Admin',
      status,
    });

    res.status(201).json({
      msg: status === 'pending'
        ? "Permintaan jadwal berhasil diajukan. Menunggu konfirmasi Admin."
        : "Jadwal berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("Error adding schedule:", error.message);
    res.status(500).json({ msg: "Terjadi kesalahan server saat menambahkan jadwal." });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const result = await Schedule.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (result === 0) {
      return res.status(404).json({ msg: "Jadwal tidak ditemukan." });
    }
    res.status(200).json({ msg: "Jadwal berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting schedule:", error.message);
    res.status(500).json({ msg: "Terjadi kesalahan server saat menghapus jadwal." });
  }
};

// Hanya untuk Admin: mengambil semua jadwal pending
export const getPendingSchedules = async (req, res) => {
  try {
    const pendingSchedules = await Schedule.findAll({
      where: {
        status: 'pending'
      }
    });
    res.status(200).json(pendingSchedules);
  } catch (error) {
    console.error("Error fetching pending schedules:", error.message);
    res.status(500).json({ msg: "Gagal mengambil data jadwal tertunda." });
  }
};

// Admin mengkonfirmasi atau menolak jadwal
export const confirmSchedule = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    const schedule = await Schedule.findOne({
      where: {
        id: id,
        status: 'pending'
      }
    });

    if (!schedule) {
      return res.status(404).json({ msg: "Jadwal pending tidak ditemukan atau sudah diproses." });
    }

    if (action === 'confirm') {
      const existingConfirmedSchedule = await Schedule.findOne({
        where: {
          hari: schedule.hari,
          jam: schedule.jam,
          kodeRuangan: schedule.kodeRuangan,
          status: 'confirmed',
          id: { [Op.ne]: id }
        }
      });

      if (existingConfirmedSchedule) {
        await schedule.update({ status: 'rejected' });
        return res.status(409).json({ msg: "Slot jadwal ini sudah terisi. Permintaan ini ditolak." });
      }

      await schedule.update({ status: 'confirmed' });
      res.status(200).json({ msg: "Jadwal berhasil dikonfirmasi." });

    } else if (action === 'reject') {
      await schedule.update({ status: 'rejected' });
      res.status(200).json({ msg: "Jadwal berhasil ditolak." });
    } else {
      res.status(400).json({ msg: "Aksi tidak valid. Gunakan 'confirm' atau 'reject'." });
    }

  } catch (error) {
    console.error("Error confirming/rejecting schedule:", error.message);
    res.status(500).json({ msg: "Terjadi kesalahan server saat memproses jadwal." });
  }
};
