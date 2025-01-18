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

      // ------------------- asociere 1-n -----------------------------------
      
    //   Employee.hasMany(Adresa, {as : "Adrese", foreignKey: "EmployeeId"});
    //   Adresa.belongsTo(Employee, {foreignKey: "EmployeeId"});
  
      // --------------------- asociere n-n -------------------------------------

    //   Employee.belongsToMany(Joburi, {through: "JobEmployee", as : "Jobs", foreignKey: "EmployeeId"});
    //   Joburi.belongsToMany(Employee, {through: "JobEmployee", as : "Employees", foreignKey: "JobId"});


    // rel noi
     // Relație 1-N: Utilizator -> Echipa
    //  Echipa.hasMany(Utilizator, { as: "Membri", foreignKey: "EchipaId" });
    //  Utilizator.belongsTo(Echipa, { foreignKey: "EchipaId" });

     Echipa.hasMany(Utilizator, { as: "Membri", foreignKey: "EchipaId" }); // Echipa are mulți utilizatori
     Utilizator.belongsTo(Echipa, { as: "Membri", foreignKey: "EchipaId" }); // Utilizatorul aparține unei echipe
     
// Echipa.hasMany(Utilizator, { as: "Membri", foreignKey: "EchipaId" }); // Echipa are membri
// Utilizator.belongsTo(Echipa, { as: "Echipa", foreignKey: "EchipaId" }); // Utilizatorul aparține unei echipe

 
     // Configurarea relației 1:1
     Echipa.hasOne(Proiect, { as: "Proiect", foreignKey: "EchipaId" });
     Proiect.belongsTo(Echipa, { foreignKey: "EchipaId" });
 
     // Relație 1-N: Proiect -> Livrabil
     Proiect.hasMany(Livrabil, { as: "Livrabile", foreignKey: "ProiectId" });
     Livrabil.belongsTo(Proiect, { foreignKey: "ProiectId" });
 
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