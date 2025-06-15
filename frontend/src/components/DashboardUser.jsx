import React, { useState, useRef, useEffect } from 'react'; // Impor useEffect
import UserScheduleForm from './UserScheduleForm';
import ScheduleTable from '../components/scheduleTable';
import SidebarUser from './SidebarUser';
import axios from 'axios'; // Impor axios
import 'bulma/css/bulma.min.css';

const DashboardUser = () => {
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState(''); // State untuk pesan notifikasi
    const [isError, setIsError] = useState(false); // State untuk tipe pesan
    const scheduleTableRef = useRef();

    const addedByRole = "Dosen";
    const dosenName = "Prof. Budi Santoso";

    // useEffect untuk mengelola auto-hide pesan di Dashboard
    useEffect(() => {
        let timer;
        if (message) {
            timer = setTimeout(() => {
                setMessage('');
                setIsError(false);
            }, 5000); // Pesan akan hilang setelah 5 detik
        }
        return () => {
            clearTimeout(timer); // Bersihkan timer
        };
    }, [message]);


    const handleToggleForm = () => {
        setShowForm(!showForm);
        setMessage(''); // Bersihkan pesan saat form di-toggle
        setIsError(false);
    };

    // Fungsi ini akan dipanggil oleh DosenScheduleForm dengan data form
    const handleFormSubmit = async (formData) => { // Menerima formData dari child
        setMessage(''); // Bersihkan pesan sebelumnya
        setIsError(false);
        try {
            const response = await axios.post('http://localhost:5000/jadwal/request', formData);
            setMessage(response.data.msg); // Set pesan sukses
            setIsError(false);

            // Setelah berhasil, sembunyikan form dan refresh tabel (jika perlu)
            // Anda bisa menambah delay kecil sebelum menyembunyikan form
            // agar pesan sempat terlihat jika form sangat besar
            setTimeout(() => {
                setShowForm(false);
                if (scheduleTableRef.current && scheduleTableRef.current.fetchSchedules) {
                    scheduleTableRef.current.fetchSchedules();
                }
            }, 500); // Tunda sembunyikan form 0.5 detik
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.msg); // Set pesan error
                setIsError(true);
            } else {
                setMessage('Terjadi kesalahan jaringan atau server tidak merespons.');
                setIsError(true);
            }
            console.error('Error submitting dosen schedule request:', error);
        }
    };


    return (
        <div className="columns" style={{ minHeight: '100vh' }}>
            <div className="column is-one-fifth">
                <SidebarUser />
            </div>
            <div className="column has-background-white-ter p-5">
                <section className="section">
                    <h2 className="schedule-title">JADWAL MATA KULIAH</h2>
                    <div className="container">
                        <button
                            className={`button ${showForm ? 'is-danger' : 'is-primary'} mb-4`}
                            onClick={handleToggleForm}
                        >
                            {showForm ? 'Tutup Form Pengajuan Jadwal' : 'Ajukan Jadwal Baru'}
                        </button>

                        {/* Notifikasi pesan di Dashboard level */}
                        {message && (
                            <div className={`notification ${isError ? 'is-danger' : 'is-success'} is-light mb-4`}>
                                <button className="delete" onClick={() => setMessage('')}></button>
                                {message}
                            </div>
                        )}

                        {showForm && (
                            <div className="card mb-5">
                                <div className="card-content">
                                    {/* onFormSubmit yang baru, meneruskan data form */}
                                    <UserScheduleForm
                                        onFormSubmit={handleFormSubmit}
                                        addedByRole={addedByRole}
                                        dosenName={dosenName}
                                    />
                                </div>
                            </div>
                        )}
                        <ScheduleTable ref={scheduleTableRef} />
                    </div>
                </section>
            </div >
        </div >
    );
};

export default DashboardUser;