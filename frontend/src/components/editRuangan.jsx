import React, { useState, useEffect } from 'react';
import axios from "axios";

const EditRuangan = ({ room, onSuccess }) => {
  const [formData, setFormData] = useState({
    kodeRuangan: '',
    kapasitas: '',
    aksesInternet: '',
    fasilitas: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Isi formData dengan data ruangan yang diterima
  useEffect(() => {
    if (room) {
      setFormData({
        kodeRuangan: room.kodeRuangan || '',
        kapasitas: room.kapasitas || '',
        aksesInternet: room.aksesInternet || '',
        fasilitas: room.fasilitas || '',
      });
      setPreview(room.url || '');
      setFile(null); // reset file saat buka modal edit baru
    }
  }, [room]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('kodeRuangan', formData.kodeRuangan);
      data.append('kapasitas', formData.kapasitas);
      data.append('aksesInternet', formData.aksesInternet);
      data.append('fasilitas', formData.fasilitas);
      if (file) {
        data.append('file', file);
      }

      // PATCH dengan ID ruangan
      await axios.patch(`http://localhost:5000/ruangan/${room.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onSuccess(); // Tutup modal dan refresh data
    } catch (error) {
      console.error('Gagal mengedit ruangan:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Kode Ruangan</label>
        <div className="control">
          <input
            type="text"
            className="input"
            name='kodeRuangan'
            value={formData.kodeRuangan}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Kapasitas</label>
        <div className="control">
          <input
            type="text"
            className="input"
            name='kapasitas'
            value={formData.kapasitas}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Akses Internet</label>
        <div className="control">
          <input
            type="text"
            className="input"
            name='aksesInternet'
            value={formData.aksesInternet}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Fasilitas</label>
        <div className="control">
          <input
            type="text"
            className="input"
            name='fasilitas'
            value={formData.fasilitas}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Image</label>
        <div className="control">
          <label className='file-label'>
            <input
              type="file"
              className="input"
              name='file-input'
              onChange={loadImage}
            />
          </label>
        </div>
      </div>

      {preview && (
        <figure className='image is-128x128'>
          <img src={preview} alt="Preview" />
        </figure>
      )}

      <div
        className="field is-flex is-justify-content-end pt-2"
        style={{ paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
      >
        <button
          type="submit"
          className="button is-success is-normal has-text-white"
          style={{ minWidth: '100px' }}
        >
          Update
        </button>
      </div>
    </form>
  )
}

export default EditRuangan;
