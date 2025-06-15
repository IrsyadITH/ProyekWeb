import React, { useEffect, useState } from 'react';
import axios from "axios";
import TambahRuangan from './tambahRuangan';
import EditRuangan from './editRuangan';
import SidebarAdmin from './SidebarAdmin';

const RuanganAdmin = () => {
  const [rooms, setRuangan] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    getRuangan();
  }, []);

  const getRuangan = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ruangan");
      setRuangan(response.data);
    } catch (error) {
      console.error('Gagal mengambil data ruangan:', error);
    }
  }

  const deleteRuangan = async (ruanganId) => {
    try {
      await axios.delete(`http://localhost:5000/ruangan/${ruanganId}`)
      getRuangan();
    } catch (error) {
      console.log(error);
    }
  }

  const handleCloseModal = () => {
    setIsModalActive(false);
    getRuangan();
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setIsEditModalActive(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalActive(false);
    setSelectedRoom(null);
    getRuangan();
  };

  return (
    <div className="columns" style={{ minHeight: '100vh' }}>
      <div className="column is-one-fifth">
        <SidebarAdmin />
      </div>
      <div className="column has-background-white-ter p-5">
        <div className="has-text-centered mt-5 mb-6">
          <h1 className="title is-2">Informasi Ruangan</h1>
        </div>
        <div className="container mb-5 is-flex is-justify-content-flex-end">
          <button className="button is-success has-text-white"
            onClick={() => setIsModalActive(true)}
          >
            Tambahkan Ruangan
          </button>
        </div>

        {/* Modal Tambah Ruangan */}
        <div className={`modal ${isModalActive ? 'is-active' : ''}`}>
          <div className="modal-background" onClick={handleCloseModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Tambah Ruangan</p>
              <button
                className="delete"
                aria-label="close"
                onClick={handleCloseModal}
              ></button>
            </header>
            <section className="modal-card-body">
              <TambahRuangan onSuccess={handleCloseModal} />
            </section>
          </div>
        </div>

        {/* Modal Edit Ruangan */}
        <div className={`modal ${isEditModalActive ? 'is-active' : ''}`}>
          <div className="modal-background" onClick={handleCloseEditModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Edit Ruangan</p>
              <button
                className="delete"
                aria-label="close"
                onClick={handleCloseEditModal}
              ></button>
            </header>
            <section className="modal-card-body">
              {selectedRoom && (
                <EditRuangan room={selectedRoom} onSuccess={handleCloseEditModal} />
              )}
            </section>
          </div>
        </div>

        <div className="columns is-multiline">
          {rooms.map(room => (
            <div className="column is-one-third mt-5 p-5" key={room.id}>
              <div className="card" style={{ backgroundColor: '#1e1e2f' }}>
                <header className="card-header">
                  <p className="card-header-title is-centered" style={{ color: 'white' }}> {room.kodeRuangan}</p>
                </header>
                <div className="card-content has-background-white">
                  <div className="columns is-vcentered">
                    <div className="column is-one-third mr-4">
                      <figure className="image is-square">
                        <img src={room.url} alt={`Gambar ${room.kodeRuangan}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </figure>
                    </div>
                    <div className="column ml-4">
                      <div className='kapasitas mb-3'>
                        <p><strong style={{ display: 'block' }}>Kapasitas:</strong> {room.kapasitas} Orang</p>
                      </div>
                      <div className='aksesInternet mb-3'>
                        <p><strong style={{ display: 'block' }}>Akses Internet:</strong> {room.aksesInternet}</p>
                      </div>
                      <div className='fasilitas mb-3'>
                        <p><strong style={{ display: 'block' }}>Fasilitas:</strong> {room.fasilitas}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <footer className='card-footer'>
                  {/* Kirim objek room, bukan hanya id */}
                  <button onClick={() => openEditModal(room)}
                    className='card-footer-item' style={{ color: 'white' }}>
                    Edit
                  </button>

                  <button onClick={() => deleteRuangan(room.id)}
                    className='card-footer-item'
                    style={{ color: 'white' }}
                  >
                    Hapus
                  </button>
                </footer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RuanganAdmin;
