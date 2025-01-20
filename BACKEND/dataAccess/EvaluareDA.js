import Evaluare from '../entities/Evaluare.js';
import Proiect from '../entities/Proiect.js';
import Utilizator from '../entities/Utilizator.js';
import Echipa from '../entities/Echipa.js';


// GET: Obține toate evaluările
export async function getEvaluari() {
    try {
        return await Evaluare.findAll({
            include: [
                {
                    model: Proiect,
                    as: 'Proiecte',  
                    required: true
                },
                {
                    model: Utilizator,
                    as: 'Utilizatori',  
                    required: true
                }
            ]
        });
    } catch (err) {
        throw new Error('Unable to fetch evaluations: ' + err.message);
    }
}

// GET: Obține o evaluare după ID
export async function getEvaluareById(id) {
    try {
        const evaluare = await Evaluare.findByPk(id, {
            include: [
                {
                    model: Proiect,
                    as: 'Proiecte',
                    required: true
                },
                {
                    model: Utilizator,
                    as: 'Utilizatori',
                    required: true
                }
            ]
        });

        if (!evaluare) {
            throw new Error('Evaluare not found');
        }
        return evaluare;
    } catch (err) {
        throw new Error('Unable to fetch evaluation: ' + err.message);
    }
}

export async function createEvaluare(data) {
    try {
        // Crearea unei evaluări direct, fără includerea modelelor asociate
        const evaluare = await Evaluare.create(data);
        
        return evaluare;
    } catch (err) {
        console.error("Error creating evaluation:", err);
        throw new Error('Unable to create evaluation: ' + err.message);
    }
}

// PUT: Actualizează o evaluare existentă după ID
export async function updateEvaluare(data, id) {
    try {
        const evaluare = await Evaluare.findByPk(id);
        if (!evaluare) {
            throw new Error('Evaluare not found');
        }
        await evaluare.update(data);
        return { obj: evaluare, error: false };
    } catch (err) {
        return { msg: 'Unable to update evaluation: ' + err.message, error: true };
    }
}

// DELETE: Șterge o evaluare după ID
export async function deleteEvaluare(id) {
    try {
        const evaluare = await Evaluare.findByPk(id);
        if (!evaluare) {
            throw new Error('Evaluare not found');
        }
        await evaluare.destroy();
        return { obj: evaluare, error: false };
    } catch (err) {
        return { msg: 'Unable to delete evaluation: ' + err.message, error: true };
    }
}




// // 1. Selectarea aleatorie a juriului
// export const selecteazaJuriu = async (req, res) => {
//     try {
//         const { proiectId } = req.params;
//         const DIMENSIUNE_JURIU = 5; 

//         // Găsim proiectul și membrii echipei
//         const proiect = await Proiect.findOne({
//             where: { idProiect: proiectId },
//             include: [{
//                 model: Utilizator,
//                 as: 'Membri'
//             }]
//         });

//         if (!proiect) {
//             return res.status(404).json({ message: "Proiectul nu există" });
//         }

//         // Găsim ID-urile membrilor echipei pentru a-i exclude
//         const idMembriiEchipa = proiect.Membri.map(membru => membru.UtilizatorId);

//         // Selectăm aleator studenți care NU sunt în echipă
//         const juratiSelectati = await Utilizator.findAll({
//             where: {
//                 UtilizatorId: { [Op.notIn]: idMembriiEchipa },
//                 UtilizatorRol: 'student'
//             },
//             order: Sequelize.literal('RAND()'),
//             limit: DIMENSIUNE_JURIU
//         });

//         // Creăm înregistrări în tabelul Evaluare pentru jurații selectați
//         await Promise.all(juratiSelectati.map(jurat => 
//             Evaluare.create({
//                 ProiectId: proiectId,
//                 UtilizatorId: jurat.UtilizatorId,
//                 Nota: null // Va fi completată când juratul acordă nota
//             })
//         ));

//         res.json({ message: "Juriul a fost selectat cu succes" });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// 1. Selectarea aleatorie a juriului
// export const selecteazaJuriu = async (proiectId, numarJurati) => {
//     try {
//         // 1. Găsim echipa proiectului
//         const proiect = await Proiect.findOne({
//             where: { idProiect: proiectId },
//             include: [{
//                 model: Echipa,
//                 as: 'Proiect',
//                 include: [{
//                     model: Utilizator,
//                     as: 'Membri',
//                     attributes: ['UtilizatorId'] // Ne interesează doar ID-urile utilizatorilor din echipă
//                 }]
//             }]
//         });

//         if (!proiect) {
//             throw new Error("Proiectul nu există");
//         }

//         // 2. Extragem membrii echipei proiectului
//         const idMembriiEchipa = proiect.Proiect.Membri.map(membru => membru.UtilizatorId);

//         // 3. Selectăm studenții care nu sunt în echipa proiectului
//         const juratiSelectati = await Utilizator.findAll({
//             where: {
//                 UtilizatorRol: 'student', // Filtrăm doar studenții
//                 UtilizatorId: { [Op.notIn]: idMembriiEchipa } // Excludem membrii echipei
//             },
//             order: Sequelize.literal('RAND()'), // Selectare aleatorie
//             limit: numarJurati
//         });

//         // 4. Returnăm ID-urile studenților selectați
//         return juratiSelectati.map(jurat => jurat.UtilizatorId);

//     } catch (error) {
//         throw new Error("Eroare la selectarea juriului: " + error.message);
//     }
// };

 
import { Sequelize, Op } from 'sequelize';

 export const selecteazaJuriu = async (proiectId, numarJurati) => {
    try {
        // 1. Verifică dacă proiectul există
        const proiect = await Proiect.findOne({
            where: { idProiect: proiectId },
        });

        if (!proiect) {
            throw new Error("Proiectul nu există");
        }

        // 2. Găsește membrii echipei care nu trebuie să fie selectați ca jurați
        const membriiEchipei = await Utilizator.findAll({
            where: { EchipaId: proiect.EchipaId }, // Găsim membrii echipei acestui proiect
            attributes: ['UtilizatorId'],
        });

        const idMembriiEchipa = membriiEchipei.map(membru => membru.UtilizatorId);

        // 3. Selectează studenți care nu sunt în echipa proiectului
        const juratiSelectati = await Utilizator.findAll({
            where: {
                UtilizatorRol: 'student',  // Asigură-te că sunt studenți
                UtilizatorId: { [Op.notIn]: idMembriiEchipa },  // Exclude membrii echipei
            },
            order: Sequelize.literal('RAND()'),  // Selectează aleatoriu
            limit: numarJurati,
        });

        // 4. Verifică dacă proiectul are deja un juriu
        const juriuExistent = await Evaluare.findOne({
            where: { ProiectId: proiectId },
        });

        if (juriuExistent) {
            throw new Error("Proiectul are deja un juriu selectat!");
        }

        // 5. Construiește lista de evaluări pentru fiecare jurat selectat
        const evaluari = juratiSelectati.map(jurat => ({
            ProiectId: proiectId,       // ID-ul proiectului
            UtilizatorId: jurat.UtilizatorId, // ID-ul juratului (studentului)
            Nota: null,  // Inițial, nota este NULL
        }));

        // 6. Adaugă jurații în tabela Evaluare
        await Evaluare.bulkCreate(evaluari);

        // 7. Returnează ID-urile studenților selectați ca jurați
        return juratiSelectati.map(jurat => jurat.UtilizatorId);
    } catch (error) {
        throw new Error("Eroare la selectarea juriului: " + error.message);
    }
};



export const adaugaJuriu = async (idProiect, jurati) => {
    try {
        // Verificăm dacă jurații au fost deja adăugați pentru proiectul respectiv
        const jurațiExistenti = await Evaluare.findAll({
            where: { ProiectId: idProiect, UtilizatorId: { [Op.in]: jurati } },
            attributes: ['UtilizatorId']
        });

        // Extragem ID-urile juraților existenți pentru a le evita
        const idJuratiExistenti = jurațiExistenti.map(jurat => jurat.UtilizatorId);

        // Filtrăm lista de jurați pentru a păstra doar cei care nu au fost adăugați deja
        const juratiDeAdaugat = jurati.filter(juratId => !idJuratiExistenti.includes(juratId));

        // Dacă nu sunt jurați de adăugat, aruncăm o eroare
        if (juratiDeAdaugat.length === 0) {
            throw new Error('Toți jurații au fost deja adăugați pentru acest proiect');
        }

        // Creăm un array de evaluări pentru fiecare jurat selectat care nu a fost încă adăugat
        const evaluari = juratiDeAdaugat.map(juratId => ({
            ProiectId: idProiect,
            UtilizatorId: juratId,
            Nota: null,  // Inițial, Nota este NULL
        }));

        // Adăugăm evaluările în tabela Evaluare
        const result = await Evaluare.bulkCreate(evaluari);

        // Returnăm evaluările adăugate
        return result;
    } catch (err) {
        throw new Error(err.message);
    }
};

//Verificare daca e jurat
export const esteJuratPentruProiect = async (proiectId, utilizatorId) => {
    // Căutăm dacă există o evaluare pentru utilizatorul respectiv și proiectul respectiv
    const evaluare = await Evaluare.findOne({
        where: {
            ProiectId: proiectId,
            UtilizatorId: utilizatorId
        }
    });

    // Dacă nu există evaluare, utilizatorul nu este jurat pentru acel proiect
    return evaluare ? true : false;
};

//Acordare nota 
export const acordaNota = async (proiectId, utilizatorId, nota) => {
    try {
        // Verificăm dacă evaluarea există deja
        const evaluare = await Evaluare.findOne({
            where: { ProiectId: proiectId, UtilizatorId: utilizatorId },
        });

        // Dacă evaluarea nu există, aruncăm o eroare
        if (!evaluare) {
            throw new Error("Evaluarea nu există pentru acest utilizator și proiect");
        }

        // Validăm nota (de exemplu, între 1 și 10)
        if (nota < 1 || nota > 10) {
            throw new Error("Nota trebuie să fie între 1 și 10");
        }

        // Actualizăm nota
        evaluare.Nota = nota;
        await evaluare.save(); // Salvăm modificările în baza de date

        return evaluare; // Returnăm evaluarea actualizată
    } catch (err) {
        throw new Error(err.message);
    }
};