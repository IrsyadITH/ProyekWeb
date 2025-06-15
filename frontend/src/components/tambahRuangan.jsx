import React, { useState } from 'react';
import axios from "axios";

const TambahRuangan = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    kodeRuangan: '',
    kapasitas: '',
    aksesInternet: '',
    fasilitas: []
  });
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFasilitasChange = (e) => {
    const { value, checked } = e.target;
    const updatedFasilitas = checked
      ? [...formData.fasilitas, value]
      : formData.fasilitas.filter(item => item !== value);
    setFormData({ ...formData, fasilitas: updatedFasilitas });
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('kodeRuangan', formData.kodeRuangan);
      data.append('kapasitas', formData.kapasitas);
      data.append('aksesInternet', formData.aksesInternet);
      data.append('fasilitas', formData.fasilitas.join(', '));
      if (file) {
        data.append('file', file);
      }

      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/ruangan', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      onSuccess?.();
    } catch (error) {
      console.error('Gagal menambahkan ruangan:', error);
      setErrorMsg(error.response?.data?.msg || "Gagal menambahkan ruangan");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMsg && <p className="has-text-danger">{errorMsg}</p>}

      <div className="field">
        <label className="label">Kode Ruangan</label>
        <div className="control">
          <input type="text" className="input" name='kodeRuangan' onChange={handleChange} required />
        </div>
      </div>
      <div className="field">
        <label className="label">Kapasitas Ruangan</label>
        <div className="control">
          <input type="text" className="input" name='kapasitas' onChange={handleChange} required />
        </div>
      </div>
      <div className="field">
        <label className="label">Akses Internet</label>
        <div className="control">
          <div className="select is-fullwidth">
            <select name="aksesInternet" onChange={handleChange} required>
              <option value="">Pilih akses</option>
              <option value="LAN">LAN</option>
              <option value="WiFi">WiFi</option>
              <option value="LAN dan WiFi">LAN dan WiFi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Fasilitas</label>
        <div className="control">
          {["Smart TV", "AC", "Papan Tulis"].map(fasilitas => (
            <label key={fasilitas} className="checkbox mr-3">
              <input
                type="checkbox"
                value={fasilitas}
                checked={formData.fasilitas.includes(fasilitas)}
                onChange={handleFasilitasChange}
              />{' '}
              {fasilitas}
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="label">Image</label>
        <div className="control">
          <label className='file-label'>
            <input type="file" className="input" name='file-input' onChange={loadImage} required />
          </label>
        </div>
      </div>

      {preview && (
        <figure className='image is-128x128'>
          <img src={preview} alt="Preview" />
        </figure>
      )}

      <div className="field is-flex is-justify-content-end pt-2"
        style={{ paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }} >
        <button
          type="submit"
          className="button is-success is-normal has-text-white"
          style={{ minWidth: '100px' }}
        >
          Tambah
        </button>
      </div>
    </form>
  );
};

export default TambahRuangan;
