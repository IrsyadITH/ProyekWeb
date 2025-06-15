// src/components/ScheduleForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- IMPORTANT: These constants MUST match what's in ScheduleTable.js ---
// Ideally, import these from a shared constants file.
const DAYS_FOR_TABLE = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "MINGGU"];
const TIME_SLOTS_FOR_TABLE = ["07.30 - 09.00", "09.05 - 10.35", "10.40 - 12.10", "13.30 - 15.00", "15.05 - 16.35", "16.40 - 18.10"];
// -----------------------------------------------------------------------

const ScheduleForm = ({ onSubmit }) => {
  const [hari, setHari] = useState('');
  const [jam, setJam] = useState('');
  const [kodeRuangan, setKodeRuangan] = useState('');
  const [kodeKelas, setKodeKelas] = useState('');
  const [mataKuliah, setMataKuliah] = useState('');
  const [dosenPengampu, setDosenPengampu] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // useEffect untuk mengambil daftar ruangan saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        // Pastikan URL ini sesuai dengan endpoint backend Anda untuk mendapatkan kode ruangan
        const response = await axios.get('http://localhost:5000/rooms/codes');
        setAvailableRooms(response.data);
        setLoadingRooms(false);
      } catch (error) {
        console.error('Gagal mengambil daftar ruangan:', error);
        setLoadingRooms(false);
        // Anda bisa menambahkan notifikasi kepada pengguna jika gagal mengambil ruangan
      }
    };
    fetchRooms();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      hari,
      jam,
      kodeRuangan,
      kodeKelas,
      mataKuliah,
      dosenPengampu,
    };

    // Panggil prop onSubmit yang akan ditangani oleh AdminDashboard
    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset form setelah submit (opsional, tergantung pada UX)
    setHari('');
    setJam('');
    setKodeRuangan('');
    setKodeKelas('');
    setMataKuliah('');
    setDosenPengampu('');
  };

  return (
    <form onSubmit={handleSubmit} className="schedule-form">
      <div className="field">
        <label className="label">Hari</label>
        <div className="control">
          {/* Bulma select wrapper */}
          <div className="select is-fullwidth">
            <select
              value={hari}
              onChange={(e) => setHari(e.target.value)}
              required
            >
              <option value="">Pilih Hari</option>
              {/* Corrected: Values match ScheduleTable's ALL CAPS format */}
              {DAYS_FOR_TABLE.map(day => (
                <option key={day} value={day}>
                  {/* Display text can be user-friendly, but value is consistent */}
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Jam</label>
        <div className="control">
          {/* Bulma select wrapper */}
          <div className="select is-fullwidth">
            <select
              value={jam}
              onChange={(e) => setJam(e.target.value)}
              required
            >
              <option value="">Pilih Jam</option>
              {/* Corrected: Values match ScheduleTable's format (with spaces) */}
              {TIME_SLOTS_FOR_TABLE.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Kode Ruangan</label>
        <div className="control">
          {/* Bulma select wrapper */}
          <div className="select is-fullwidth">
            <select
              value={kodeRuangan}
              onChange={(e) => setKodeRuangan(e.target.value)}
              required
              disabled={loadingRooms}
            >
              <option value="">
                {loadingRooms ? 'Memuat ruangan...' : 'Pilih Kode Ruangan'}
              </option>
              {availableRooms.map((roomCode, index) => (
                <option key={index} value={roomCode}>
                  {roomCode}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Kode Kelas</label>
        <div className="control">
          <input
            type="text"
            className="input"
            value={kodeKelas}
            onChange={(e) => setKodeKelas(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Mata Kuliah</label>
        <div className="control">
          <input
            type="text"
            className="input"
            value={mataKuliah}
            onChange={(e) => setMataKuliah(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Dosen Pengampu</label>
        <div className="control">
          <input
            type="text"
            className="input"
            value={dosenPengampu}
            onChange={(e) => setDosenPengampu(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field mt-4">
        <div className="control">
          <button className="button is-primary" type="submit">
            Simpan Jadwal
          </button>
        </div>
      </div>
    </form>
  );
};

export default ScheduleForm;