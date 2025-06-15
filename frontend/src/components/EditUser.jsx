import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditUser = ({ isOpen, onClose, userId, onUserUpdated }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [prodi, setProdi] = useState("");
    const [jurusan, setJurusan] = useState("");

    useEffect(() => {
        if (userId) getUserById();
    }, [userId]);

    const getUserById = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users/${userId}`);
            const user = response.data;
            setEmail(user.email);
            setUsername(user.username);
            setPassword(user.password);
            setStatus(user.status);
            setProdi(user.prodi);
            setJurusan(user.jurusan);
        } catch (error) {
            console.error(error);
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/users/${userId}`, {
                email,
                username,
                password,
                status,
                prodi,
                jurusan
            });
            onUserUpdated(); // Refresh list
            onClose(); // Close modal
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={`modal ${isOpen ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Edit User</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <form onSubmit={updateUser}>
                    <section className="modal-card-body">
                        {/* Fields - same as AddUser */}
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
                        <button type="submit" className="button is-success is-pulled-right mb-2 mr-2">Update</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
