import { Sequelize } from "sequelize";
import env from 'dotenv';
import { DB_USERNAME,DB_PASSWORD } from "./Const.js";

env.config();

const db=new Sequelize({
    dialect: 'mysql',
    database: 'Proiect',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging:false,
    define:{
        timestamps:false,
        freezeTableName:true
    }
})

export default db;