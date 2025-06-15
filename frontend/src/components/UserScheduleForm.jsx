// src/components/DosenScheduleForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Masih perlu axios untuk fetch availableRooms

// --- PENTING: Konstanta ini HARUS sama persis dengan yang ada di ScheduleTable.js ---
const DAYS_FOR_TABLE = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "MINGGU"];
const TIME_SLOTS_FOR_TABLE = ["07.30 - 09.00", "09.05 - 10.35", "10.40 - 12.10", "13.30 - 15.00", "15.05 - 16.35", "16.40 - 18.10"];
// ----------------------------------------------------------------------------------

// Prop onFormSubmit sekarang akan menerima formData
const DosenScheduleForm = ({ onFormSubmit, addedByRole}) => {
  const [hari, setHari] = useState('');
  const [jam, setJam] = useState('');
  const [kodeRuangan, setKodeRuangan] = useState('');
  const [kodeKelas, setKodeKelas] = useState('');
  const [mataKuliah, setMataKuliah] = useState('');
  const [dosenPengampu, setDosenPengampu] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  // Pesan dan error state dihapus dari sini, akan dikelola di parent

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const response = await axios.get('http://localhost:5000/rooms/codes');
        setAvailableRooms(response.data);
        setLoadingRooms(false);
      } catch (error) {
        console.error('Gagal mengambil daftar ruangan:', error);
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      hari,
      jam,
      kodeRuangan,
      kodeKelas,
      mataKuliah,
      dosenPengampu,
      addedBy: addedByRole, // Disertakan di sini
    };

    // Panggil prop onFormSubmit yang akan menangani permintaan HTTP
    if (onFormSubmit) {
      onFormSubmit(formData);
    }

    // Reset form setelah submit
    setHari('');
    setJam('');
    setKodeRuangan('');
    setKodeKelas('');
    setMataKuliah('');
    setDosenPengampu('');
  };

  return (
    <div className="card is-fullwidth">
      <header className="card-header">
        <p className="card-header-title">Ajukan Permintaan Jadwal Baru</p>
      </header>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="schedule-form">
          {/* Notifikasi pesan dihapus dari sini */}

          <div className="field">
            <label className="label">Hari</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={hari} onChange={(e) => setHari(e.target.value)} required>
                  <option value="">Pilih Hari</option>
                  {DAYS_FOR_TABLE.map(day => (
                    <option key={day} value={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Jam</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={jam} onChange={(e) => setJam(e.target.value)} required>
                  <option value="">Pilih Jam</option>
                  {TIME_SLOTS_FOR_TABLE.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Kode Ruangan</label>
            <div className="control">
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
                    <option key={index} value={roomCode}>{roomCode}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Kode Kelas</label>
            <div className="control">
              <input type="text" className="input" value={kodeKelas} onChange={(e) => setKodeKelas(e.target.value)} placeholder="Ex: 11MI" required />
            </div>
          </div>

          <div className="field">
            <label className="label">Mata Kuliah</label>
            <div className="control">
              <input type="text" className="input" value={mataKuliah} onChange={(e) => setMataKuliah(e.target.value)} placeholder="Ex: Data Mining" required />
            </div>
          </div>

          <div className="field">
            <label className="label">Dosen Pengampu</label>
            <div className="control">
              <input type="text" className="input" value={dosenPengampu} onChange={(e) => setDosenPengampu(e.target.value)} placeholder="Ex: Nama Dosen" required />
            </div>
          </div>

          <div className="field mt-4">
            <div className="control">
              <button type="submit" className="button is-primary is-fullwidth">
                Kirim Permintaan Jadwal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DosenScheduleForm;