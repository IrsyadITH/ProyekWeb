import React, { useState } from 'react';
import axios from 'axios';

const AddUser = ({ isOpen, onClose, onUserAdded }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("Mahasiswa");
    const [prodi, setProdi] = useState("Ilmu Komputer");
    const [jurusan, setJurusan] = useState("Teknik Elektro dan Komputer");

    const saveUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/users', {
                email,
                username,
                password,
                status,
                prodi,
                jurusan
            });
            onUserAdded(); // refresh list
            onClose(); // close modal
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={`modal ${isOpen ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Add User</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <form onSubmit={saveUser}>
                    <section className="modal-card-body">
                        {/* Fields */}
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input type="email" className="input" value={email}
                                    onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                                <input type="password" className="input" value={password}
                                    onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Username</label>
                            <div className="control">
                                <input type="text" className="input" value={username}
                                    onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Status</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="Mahasiswa">Mahasiswa</option>
                                        <option value="Dosen">Dosen</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Program Studi</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select value={prodi} onChange={(e) => setProdi(e.target.value)}>
                                        <option value="Ilmu Komputer">Ilmu Komputer</option>
                                        <option value="Sistem Informasi">Sistem Informasi</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Jurusan</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select value={jurusan} onChange={(e) => setJurusan(e.target.value)}>
                                        <option value="Teknik Elektro dan Komputer">Teknik Elektro dan Komputer</option>
                                        <option value="Teknologi Produksi dan Industri">Teknologi Produksi dan Industri</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button type="submit" className="button is-success is-pulled-right">Save</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
