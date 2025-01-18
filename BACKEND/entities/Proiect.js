import { Sequelize } from "sequelize";
import db from '../dbConfig.js';

const Proiect = db.define("Proiect", {
    idProiect: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
    },
    titlu: {
        type: Sequelize.STRING,
        allowNull: false
    },
    EchipaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // Marcat ca UNIQUE pentru a evidenția relația 1:1
        // references: {
        //     model: "Echipa", // Numele modelului asociat
        //     key: "EchipaId"  // Coloana PK din tabela Echipa
        // }
    },
});

export default Proiect;