import { Sequelize } from "sequelize";
import db from '../dbConfig.js';

const Echipa = db.define("Echipa", {
    EchipaId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    EchipaNume: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false,
});

export default Echipa;