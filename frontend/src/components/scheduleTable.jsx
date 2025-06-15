import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import './ScheduleTable.css';
import { FaTrash } from 'react-icons/fa';

const DAYS_FOR_TABLE = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "MINGGU"];
const TIME_SLOTS_FOR_TABLE = ["07.30 - 09.00", "09.05 - 10.35", "10.40 - 12.10", "13.30 - 15.00", "15.05 - 16.35", "16.40 - 18.10"];

const formatRoomCodeForDisplay = (code) => {
  if (code && code.startsWith('R') && code.length > 1 && !code.includes(' ')) {
    return `R ${code.substring(1)}`;
  }
  return code;
};

const ScheduleTable = forwardRef((props, ref) => {
  const [schedules, setSchedules] = useState([]);
  const [roomCodes, setRoomCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(DAYS_FOR_TABLE[0]);

  const currentUser = localStorage.getItem('username'); // Pastikan username disimpan saat login

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/jadwal');
      setSchedules(response.data);
    } catch (error) {
      console.error('Gagal memuat data jadwal:', error);
    }
  };

  const fetchRoomCodes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rooms/codes');
      setRoomCodes(response.data);
    } catch (error) {
      console.error('Gagal memuat daftar kode ruangan:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchRoomCodes();
      await fetchSchedules();
      setLoading(false);
    };
    fetchData();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchSchedules,
  }));

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/jadwal/${id}`);
      await fetchSchedules();
    } catch (error) {
      console.error('Gagal menghapus jadwal:', error);
      alert('Terjadi kesalahan saat menghapus jadwal.');
    }
  };

  if (loading) return <p>Memuat data jadwal dan ruangan...</p>;

  const filteredSchedules = schedules.filter(item => item.hari === selectedDay);

  const scheduleByTimeAndRoom = TIME_SLOTS_FOR_TABLE.reduce((acc, time) => {
    acc[time] = roomCodes.reduce((roomAcc, code) => {
      roomAcc[code] = filteredSchedules.find(
        (item) => item.jam === time && item.kodeRuangan === code
      );
      return roomAcc;
    }, {});
    return acc;
  }, {});

  return (
    <div className="schedule-container">
      <nav className="schedule-nav">
        <ul>
          {DAYS_FOR_TABLE.map(day => (
            <li key={day}>
              <button
                className={selectedDay === day ? 'is-active' : ''}
                onClick={() => setSelectedDay(day)}
              >
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>JAM</th>
              {roomCodes.map(code => (
                <th key={code}>{formatRoomCodeForDisplay(code)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS_FOR_TABLE.map(time => (
              <tr key={time}>
                <td className="time-slot">{time}</td>
                {roomCodes.map(code => {
                  const item = scheduleByTimeAndRoom[time][code];
                  return (
                    <td key={code}>
                      {item ? (
                        <div>
                          <strong>{item.mataKuliah}</strong><br />
                          {item.kodeKelas}<br />
                          {item.dosenPengampu}
                          {item.addedBy === currentUser && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <FaTrash
                                className="delete-icon"
                                style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => handleDelete(item.id)}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ScheduleTable;
