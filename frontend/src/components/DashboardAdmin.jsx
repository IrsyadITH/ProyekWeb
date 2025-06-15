// src/pages/AdminDashboard.js
import React, { useState, useRef, useEffect } from 'react'; // Import useEffect
import ScheduleForm from '../components/scheduleForm'; // Form admin
import ScheduleTable from '../components/scheduleTable'; // Tabel jadwal utama
import SidebarAdmin from './SidebarAdmin';
import axios from 'axios'; // Import axios

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [pendingSchedules, setPendingSchedules] = useState([]); // State untuk jadwal pending
  const [message, setMessage] = useState(''); // State untuk pesan notifikasi
  const [isError, setIsError] = useState(false); // State untuk tipe pesan
  const scheduleTableRef = useRef(); // Ref untuk ScheduleTable

  // Fungsi untuk mengambil jadwal pending
  const fetchPendingSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/jadwal/pending');
      setPendingSchedules(response.data);
    } catch (error) {
      console.error('Gagal memuat jadwal tertunda:', error);
      setMessage('Gagal memuat jadwal tertunda.');
      setIsError(true);
    }
  };

  // Panggil fetchPendingSchedules saat komponen dimuat dan setiap kali ada perubahan
  useEffect(() => {
    fetchPendingSchedules();
  }, []);

  const handleAddScheduleClick = () => {
    setShowForm(!showForm);
    console.log('showForm is now:', !showForm); // Tambahkan baris ini
    setMessage('');
    setIsError(false);
  };

  // Fungsi untuk menambahkan jadwal oleh Admin
  const handleScheduleSubmit = async (formData) => {
    setMessage('');
    setIsError(false);
    try {
      const response = await axios.post('http://localhost:5000/jadwal', formData); // Endpoint admin
      setMessage(response.data.msg || 'Jadwal berhasil ditambahkan oleh Admin!');
      setIsError(false);
      setShowForm(false);
      if (scheduleTableRef.current) {
        scheduleTableRef.current.fetchSchedules(); // Refresh tabel utama
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.msg);
        setIsError(true);
      } else {
        setMessage('Terjadi kesalahan saat menambahkan jadwal.');
        setIsError(true);
      }
      console.error('Error adding schedule:', error);
    }
  };

  // Fungsi untuk mengkonfirmasi atau menolak jadwal pending
  const handleConfirmReject = async (id, action) => {
    setMessage('');
    setIsError(false);
    try {
      const response = await axios.patch(`http://localhost:5000/jadwal/confirm/${id}`, { action });
      setMessage(response.data.msg);
      setIsError(false);
      fetchPendingSchedules(); // Refresh daftar pending
      if (scheduleTableRef.current) {
        scheduleTableRef.current.fetchSchedules(); // Refresh tabel utama jika ada yang dikonfirmasi
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.msg);
        setIsError(true);
      } else {
        setMessage('Terjadi kesalahan saat memproses permintaan jadwal.');
        setIsError(true);
      }
      console.error(`Error ${action}ing schedule:`, error);
    }
  };

  return (
    <div className="columns" style={{ minHeight: '100vh' }}>
      <div className="column is-one-fifth">
        <SidebarAdmin />
      </div>
      <div className="column has-background-white-ter p-5">
        <section className="section">
          <div className="container">
            <h2 className="schedule-title">JADWAL MATA KULIAH</h2>
            {/* Notifikasi pesan */}
            {message && (
              <div className={`notification ${isError ? 'is-danger' : 'is-success'} is-light`}>
                <button className="delete" onClick={() => setMessage('')}></button>
                {message}
              </div>
            )}



            {showForm && (
              <div className="card mb-5">
                <div className="card-content">
                  <ScheduleForm onSubmit={handleScheduleSubmit} />
                </div>
              </div>
            )}



            {/* Tabel Jadwal Utama (Hanya menampilkan yang 'confirmed') */}

            {/* Tombol untuk menambah jadwal (Admin) */}
            <button
              className={`button ${showForm ? 'is-danger' : 'is-primary'} mb-4`}
              onClick={handleAddScheduleClick}
            >
              {showForm ? 'Tutup Form' : 'Tambah Jadwal (Admin)'} {/* <--- BARIS INI */}
            </button>

            {/* ScheduleTable akan menampilkan jadwal yang sudah dikonfirmasi */}
            <ScheduleTable ref={scheduleTableRef} />

            {/* Bagian untuk Jadwal Tertunda (Pending) */}
            <h2 className="subtitle mt-5">Jadwal Tertunda Menunggu Konfirmasi ({pendingSchedules.length})</h2>
            {pendingSchedules.length === 0 ? (
              <p>Tidak ada jadwal tertunda.</p>
            ) : (
              <div className="table-container mb-5">
                <table className="table is-fullwidth is-striped is-hoverable">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Hari</th>
                      <th>Jam</th>
                      <th>Ruangan</th>
                      <th>Kelas</th>
                      <th>Mata Kuliah</th>
                      <th>Dosen</th>
                      <th>Diajukan Oleh</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSchedules.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.hari}</td>
                        <td>{item.jam}</td>
                        <td>{item.kodeRuangan}</td>
                        <td>{item.kodeKelas}</td>
                        <td>{item.mataKuliah}</td>
                        <td>{item.dosenPengampu}</td>
                        <td>{item.addedBy}</td>
                        <td>
                          <button
                            className="button is-small is-success mr-2"
                            onClick={() => handleConfirmReject(item.id, 'confirm')}
                          >
                            Konfirmasi
                          </button>
                          <button
                            className="button is-small is-danger"
                            onClick={() => handleConfirmReject(item.id, 'reject')}
                          >
                            Tolak
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div >
    </div >
  );
};

export default AdminDashboard;