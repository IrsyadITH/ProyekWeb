// src/pages/Dashboard.js (Isi file ini sama dengan yang saya berikan untuk UmumDashboard.js)
import React from 'react';
import ScheduleTable from '../components/scheduleTable';
import 'bulma/css/bulma.min.css';

const Dashboard = () => { // <--- Pastikan nama komponennya 'Dashboard'
  return (
    <section className="section">
      <div className="container">
        <h1 className="title has-text-centered">JADWAL MATA KULIAH</h1>
        <ScheduleTable />
      </div>
    </section>
  );
};

export default Dashboard;