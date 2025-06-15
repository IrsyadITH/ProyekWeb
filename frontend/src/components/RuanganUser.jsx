import React, { useEffect, useState } from 'react';
import axios from "axios";
import SidebarUser from './SidebarUser';

const RuanganUser = () => {
  const [rooms, setRuangan] = useState([]);

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

  return (
    <div className="columns" style={{ minHeight: '100vh' }}>
      <div className="column is-one-fifth">
        <SidebarUser />
      </div>
      <div className="column has-background-white-ter p-5">
        <div className="has-text-centered mt-5 mb-6">
          <h1 className="title is-2">Informasi Ruangan</h1>
        </div>

        <div className="columns is-multiline">
          {rooms.map(room => (
            <div className="column is-one-third mt-5 p-5" key={room.id}>
              <div className="card" style={{ backgroundColor: '#1e1e2f' }}>
                <header className="card-header">
                  <p className="card-header-title is-centered" style={{ color: 'white' }}>
                    {room.kodeRuangan}
                  </p>
                </header>
                <div className="card-content has-background-white">
                  <div className="columns is-vcentered">
                    <div className="column is-one-third mr-4">
                      <figure className="image is-square">
                        <img
                          src={room.url}
                          alt={`Gambar ${room.kodeRuangan}`}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </figure>
                    </div>
                    <div className="column ml-4">
                      <div className='kapasitas mb-3'>
                        <p><strong>Kapasitas:</strong> {room.kapasitas} Orang</p>
                      </div>
                      <div className='aksesInternet mb-3'>
                        <p><strong>Akses Internet:</strong> {room.aksesInternet}</p>
                      </div>
                      <div className='fasilitas mb-3'>
                        <p><strong>Fasilitas:</strong> {room.fasilitas}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RuanganUser;
