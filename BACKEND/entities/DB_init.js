
import mysql from "mysql2/promise";
import env from "dotenv";
import Utilizator from "./Utilizator.js";
import Echipa from "./Echipa.js";
import Evaluare from "./Evaluare.js";
import Livrabil from "./Livrabil.js";
import Proiect from "./Proiect.js";
env.config();

function Create_DB(){
    let conn;

    mysql.createConnection({
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD
    })
    .then((connection) => {
    conn = connection
    return connection.query('CREATE DATABASE IF NOT EXISTS Proiect')
    })
    .then(() => {
    return conn.end()
    })
    .catch((err) => {
    console.warn(err.stack)
    })
}

function FK_Config()
{
     // Relație 1-N: Utilizator -> Echipa
    
     Echipa.hasMany(Utilizator, { as: "Membri", foreignKey: "EchipaId" }); 
     Utilizator.belongsTo(Echipa, { as: "Membri", foreignKey: "EchipaId" }); 
 
     // Configurarea relației 1:1
     Echipa.hasOne(Proiect, { as: "Proiect", foreignKey: "EchipaId" });
     Proiect.belongsTo(Echipa, { foreignKey: "EchipaId" });
 
     // Relație 1-N: Proiect -> Livrabil
     Proiect.hasMany(Livrabil, { as: "Livrabile", foreignKey: "idProiect" });
     Livrabil.belongsTo(Proiect, { foreignKey: "idProiect" });
 
     // Relație 1-N: Echipa -> Livrabil
     Echipa.hasMany(Livrabil, { as: "Livrabile", foreignKey: "EchipaId" });
     Livrabil.belongsTo(Echipa, { foreignKey: "EchipaId" });
 
     // Relație N-N: Utilizator <-> Proiect (prin Evaluare)
     
     Utilizator.belongsToMany(Proiect, {
        through: Evaluare,
        as: "Proiecte",
        foreignKey: "UtilizatorId"
    });
    
     Proiect.belongsToMany(Utilizator, {
         through: Evaluare,
         as: "Utilizatori",
         foreignKey: "ProiectId"
     });
 
 
     // // Relație 1-N: Evaluare -> Proiect
     Proiect.hasMany(Evaluare, { as: "Evaluari", foreignKey: "ProiectId" });
     Evaluare.belongsTo(Proiect, { foreignKey: "ProiectId" });
 
     // // Relație 1-N: Evaluare -> Utilizator
     Utilizator.hasMany(Evaluare, { as: "Evaluari", foreignKey: "UtilizatorId" });
     Evaluare.belongsTo(Utilizator, { foreignKey: "UtilizatorId" });
}
function DB_Init()
{
    Create_DB();
    FK_Config();
}
export default DB_Init;