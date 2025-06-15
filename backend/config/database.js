import { Sequelize } from "sequelize";

const db = new Sequelize('simarukDB', 'root', '',{
    host: "localhost",
    dialect: "mysql"
});

export default db;