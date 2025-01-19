import { Sequelize } from "sequelize";
import db from '../dbConfig.js';

const Utilizator=db.define("Utilizator",{
    UtilizatorId:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement: true,
    },
    UtilizatorNume:{
        type: Sequelize.STRING,
        allowNull:false
    },
    UtilizatorEmail:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    UtilizatorParola:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:false
    },
    UtilizatorRol:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    UtilizatorRol: {
        type: Sequelize.ENUM("student", "profesor"), 
        allowNull: false,
    },
}, {
    timestamps: true,  
});

export default Utilizator;