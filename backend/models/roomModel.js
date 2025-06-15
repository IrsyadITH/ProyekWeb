import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Ruangan = db.define('ruangan',{
    kodeRuangan: DataTypes.STRING,
    kapasitas: DataTypes.STRING,
    aksesInternet: DataTypes.STRING,
    fasilitas: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING
    
},{
    freezeTableName: true
});

export default Ruangan;

(async()=>{
    await db.sync();
})();