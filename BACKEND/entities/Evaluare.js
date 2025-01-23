import { Sequelize } from "sequelize";
import db from '../dbConfig.js';

const Evaluare=db.define("Evaluare", {
    EvaluareId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    UtilizatorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //     model: "Utilizator",
        //     key: "UtilizatorId"
        // }
    },
    ProiectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //     model: "Proiect",
        //     key: "idProiect"
        // }
    },
   
    Nota: {
        type: Sequelize.DECIMAL(4,2),
        allowNull: true, // Inițial poate fi NULL
        // validate: {
        //     min: 1.00,
        //     max: 10.00,
        // }
    },
})

export default Evaluare;