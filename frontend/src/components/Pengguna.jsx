import React, { useState, useEffect } from 'react';
import axios from "axios";
import SidebarAdmin from './SidebarAdmin';
import AddUser from './AddUser';
import EditUser from './EditUser';

const Pengguna = () => {
    const [users, setUser] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users');
            setUser(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`);
            getUsers();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUserAdded = () => {
        setShowAddModal(false);
        getUsers();
    };

    const handleUserUpdated = () => {
        setShowEditModal(false);
        setSelectedUserId(null);
        getUsers();
    };

    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedUserId(null);
    };

    return (
        <div className="columns" style={{ minHeight: '100vh' }}>
            <div className="column is-one-fifth">
                <SidebarAdmin />
            </div>

            <div className="column has-background-white-ter p-5">
                <div className="mb-5" style={{ marginTop: '6vh' }}>
                    <button
                        className='button is-success is-pulled-right mb-3'
                        onClick={() => setShowAddModal(true)}
                    >
                        Add User
                    </button>
                </div>

                <table className="table is-striped is-fullwidth">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Program Studi</th>
                            <th>Jurusan</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users
                            .filter(user => user.status !== "Admin")
                            .map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>{user.status}</td>
                                    <td>{user.prodi}</td>
                                    <td>{user.jurusan}</td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setShowEditModal(true);
                                            }}
                                            className='button is-info is-small mb-1 mr-1'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className='button is-small is-danger'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* Add User Modal */}
                <AddUser
                    isOpen={showAddModal}
                    onClose={closeModal}
                    onUserAdded={handleUserAdded}
                />

                {/* Edit User Modal */}
                <EditUser
                    isOpen={showEditModal}
                    onClose={closeModal}
                    userId={selectedUserId}
                    onUserUpdated={handleUserUpdated}
                />
            </div>
        </div>
    );
};

export default Pengguna;
