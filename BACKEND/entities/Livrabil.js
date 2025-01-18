import { Sequelize } from "sequelize";
import db from '../dbConfig.js';

const Livrabil = db.define("Livrabil", {
    idLivrabil: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idProiect: {
        type: Sequelize.INTEGER,
        allowNull: false
        // references: {
        //     model: "Proiect",
        //     key: "idProiect"
        // }
    },
    EchipaId: {
        type: Sequelize.INTEGER,
        allowNull: false
        // references: {
        //     model: "Echipa",
        //     key: "EchipaId"
        // }
    },
    dataLivrare: {
        type: Sequelize.DATE,
        allowNull: false
    },
    videoLink: {
        type: Sequelize.STRING,
        allowNull: true
    },
    proiectLink: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
});

export default Livrabil;