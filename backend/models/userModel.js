import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const User = db.define('users',{
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    status: DataTypes.STRING,
    prodi: DataTypes.STRING,
    jurusan: DataTypes.STRING
    
},{
    freezeTableName: true
});

export default User;

(async()=>{
    await db.sync();
})();