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
        unique:false
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
    
    EchipaId:{
        type:Sequelize.INTEGER,
        allowNull:false
        // references:{
        //     model:"Echipa",
        //     key:"EchipaId"
        // }
    }
}, {
    timestamps: true,  
});

export default Utilizator;