import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Jadwal = db.define('jadwal',{
    hari: DataTypes.STRING,
    jam: DataTypes.STRING,
    kodeRuangan: DataTypes.STRING,
    kodeKelas: DataTypes.STRING,
    mataKuliah: DataTypes.STRING,
    dosenPengampu: DataTypes.STRING,
    status: { // Kolom baru: status jadwal (pending, confirmed, rejected)
        type: DataTypes.STRING,
        defaultValue: 'confirmed' // Default untuk jadwal yang ditambahkan admin
    },
    addedBy: { // Kolom baru: siapa yang menambahkan jadwal (admin, dosen)
        type: DataTypes.STRING,
        defaultValue: 'admin' // Default untuk jadwal yang ditambahkan admin
    },
    
},{
    freezeTableName: true
});

export default Jadwal;

(async()=>{
    // Gunakan alter: true agar Sequelize hanya menambahkan kolom baru tanpa menghapus data
    // Jalankan ini SATU KALI SAJA setelah perubahan model
    // Setelah tabel terupdate, Anda bisa menghapus atau mengomentari baris ini
    await db.sync({ alter: true });
    console.log("Jadwal table synced with new columns (status, addedBy).");
})();