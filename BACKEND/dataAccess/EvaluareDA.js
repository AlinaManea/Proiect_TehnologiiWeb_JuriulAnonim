import Evaluare from '../entities/Evaluare.js';
import Proiect from '../entities/Proiect.js';
import Utilizator from '../entities/Utilizator.js';
import Echipa from '../entities/Echipa.js';
import Livrabil from '../entities/Livrabil.js';


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
 
import { Sequelize, Op } from 'sequelize';
export const selecteazaJuriu = async (proiectId, numarJurati) => {
    try {
      // Verifică existența proiectului
      const proiect = await Proiect.findOne({
        where: { idProiect: proiectId },
      });
  
      if (!proiect) {
        throw new Error("Proiectul nu există");
      }
  
      // Verifică dacă există deja un juriu
      const juriuExistent = await Evaluare.findOne({
        where: { ProiectId: proiectId },
      });
  
      if (juriuExistent) {
        throw new Error("Proiectul are deja un juriu selectat!");
      }
  
      // Găsește membrii echipei
      const membriiEchipei = await Utilizator.findAll({
        where: { EchipaId: proiect.EchipaId },
        attributes: ['UtilizatorId'],
      });
  
      const idMembriiEchipa = membriiEchipei.map(membru => membru.UtilizatorId);
  
      // Selectează jurați random
      const juratiSelectati = await Utilizator.findAll({
        where: {
          UtilizatorRol: 'student',
          UtilizatorId: { [Op.notIn]: idMembriiEchipa },
        },
        order: Sequelize.literal('RAND()'),
        limit: numarJurati,
      });
  
      // Creează evaluările
      const evaluari = juratiSelectati.map(jurat => ({
        ProiectId: proiectId,
        UtilizatorId: jurat.UtilizatorId,
        Nota: null,
      }));
  
      await Evaluare.bulkCreate(evaluari);
  
      return juratiSelectati.map(jurat => jurat.UtilizatorId);
    } catch (error) {
      throw new Error("Eroare la selectarea juriului: " + error.message);
    }
  };
  
  // Logica pentru adăugarea juriului
  export const adaugaJuriu = async (idProiect, jurati) => {
    try {
      const jurațiExistenti = await Evaluare.findAll({
        where: {
          ProiectId: idProiect,
          UtilizatorId: { [Op.in]: jurati }
        },
        attributes: ['UtilizatorId']
      });
  
      const idJuratiExistenti = jurațiExistenti.map(jurat => jurat.UtilizatorId);
      const juratiDeAdaugat = jurati.filter(juratId => !idJuratiExistenti.includes(juratId));
  
      if (juratiDeAdaugat.length === 0) {
        throw new Error('Toți jurații au fost deja adăugați pentru acest proiect');
      }
  
      const evaluari = juratiDeAdaugat.map(juratId => ({
        ProiectId: idProiect,
        UtilizatorId: juratId,
        Nota: null,
      }));
  
      const result = await Evaluare.bulkCreate(evaluari);
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  };
  
  // SA IA PROIECT JUARTULL sa vada

//   export const getProiecteEvaluare = async (userId) => {
//     try {
//         const proiecte = await Evaluare.findAll({
//             where: { UtilizatorId: userId },
//             include: [
//                 {
//                     model: Proiect,
//                     as: "Proiect", 
//                     include: [
//                         {
//                             model: Livrabil,
//                             as: "Livrabile"
//                         }
//                     ]
//                 }
//             ]
//         });

//         return proiecte.map(evaluare => ({
//             proiectId: evaluare.Proiect.idProiect,
//             titlu: evaluare.Proiect.titlu,
//             livrabile: evaluare.Proiect.Livrabile.map(livrabil => ({
//                 idLivrabil: livrabil.idLivrabil,
//                 numeLivrabil: livrabil.numeLivrabil,
//                 dataLivrare: livrabil.dataLivrare,
//                 videoLink: livrabil.videoLink,
//                 proiectLink: livrabil.proiectLink
//             }))
//         }));
//     } catch (error) {
//         throw new Error('Eroare la preluarea proiectelor pentru evaluare.');
//     }
// };

// export const getProiecteEvaluare = async (userId) => {
//     try {
//         // const proiecte = await Evaluare.findAll({
//         //     where: { UtilizatorId: userId },
//         //     include: [
//         //         {
//         //             model: Proiect,
//         //             as: "Proiect", 
//         //             include: [
//         //                 {
//         //                     model: Livrabil,
//         //                     as: "Livrabile"
//         //                 }
//         //             ]
//         //         }
//         //     ]
//         // });
//         const proiecte = await Evaluare.findAll({
//             where: { 
//                 UtilizatorId: userId,
//                 nota: null  // Luăm doar proiectele care nu au încă notă
//             },
//             include: [
//                 {
//                     model: Proiect,
//                     as: "Proiect",
//                     include: [
//                         {
//                             model: Livrabil,
//                             as: "Livrabile"
//                         }
//                     ]
//                 }
//             ]
//         });

//         console.log("Projects retrieved from DB:", proiecte); // DEBUG

//         return proiecte.map(evaluare => ({
//             proiectId: evaluare.Proiect.idProiect,
//             titlu: evaluare.Proiect.titlu,
//             livrabile: evaluare.Proiect.Livrabile.map(livrabil => ({
//                 idLivrabil: livrabil.idLivrabil,
//                 numeLivrabil: livrabil.numeLivrabil,
//                 dataLivrare: livrabil.dataLivrare,
//                 videoLink: livrabil.videoLink,
//                 proiectLink: livrabil.proiectLink
//             }))
//         }));
//     } catch (error) {
//         console.error("Error in getProiecteEvaluare:", error.message); // DEBUG
//         throw new Error('Eroare la preluarea proiectelor pentru evaluare.');
//     }
// };


export const getProiecteEvaluare = async (userId) => {
    try {
        const evaluari = await Evaluare.findAll({
            where: { 
                UtilizatorId: userId,
                Nota: null 
            },
            include: [
                {
                    model: Proiect,
                    include: [
                        {
                            model: Livrabil,
                            as: 'Livrabile'
                        }
                    ]
                }
            ]
        });

        return evaluari.map(evaluare => ({
            proiectId: evaluare.Proiect.idProiect,
            titlu: evaluare.Proiect.titlu,
            livrabile: evaluare.Proiect.Livrabile.map(livrabil => ({
                idLivrabil: livrabil.idLivrabil,
                numeLivrabil: livrabil.numeLivrabil,
                videoLink: livrabil.videoLink,
                proiectLink: livrabil.proiectLink
            })),
            evaluareId: evaluare.EvaluareId
        }));
    } catch (error) {
        throw new Error('Eroare la preluarea proiectelor pentru evaluare: ' + error.message);
    }
};

//Verificare daca e jurat
export const esteJuratPentruProiect = async (proiectId, utilizatorId) => {
    const evaluare = await Evaluare.findOne({
        where: {
            ProiectId: proiectId,
            UtilizatorId: utilizatorId
        }
    });
    return evaluare ? true : false;
};

//Acordare nota 
export const acordaNota = async (proiectId, utilizatorId, nota) => {
    try {
        const evaluare = await Evaluare.findOne({
            where: { ProiectId: proiectId, UtilizatorId: utilizatorId }
        });

        if (!evaluare) {
            throw new Error("Evaluarea nu există pentru acest utilizator și proiect");
        }

        if (nota < 1 || nota > 10) {
            throw new Error("Nota trebuie să fie între 1 și 10");
        }

        evaluare.Nota = nota;
        await evaluare.save(); 

        return evaluare; 
    } catch (err) {
        throw new Error(err.message);
    }
};

export const calculeazaNotaFinala = async (proiectId) => {
    try {
        const evaluari = await Evaluare.findAll({
            where: {
                ProiectId: proiectId,
                Nota: {
                    [Sequelize.Op.ne]: null 
                }
            },
            attributes: ['Nota']
        });

        if (evaluari.length < 3) {
            throw new Error("Nu sunt suficiente note pentru a calcula media (minim 3 note necesare)");
        }


        const note = evaluari.map(ev => parseFloat(ev.Nota)).sort((a, b) => a - b);
        
        note.shift(); 
        note.pop();    

        const suma = note.reduce((acc, nota) => acc + nota, 0);
        const media = (suma / note.length).toFixed(2);

        return parseFloat(media);
    } catch (error) {
        throw new Error(`Eroare la calcularea notei finale: ${error.message}`);
    }
};

// Funcție pentru obținerea tuturor notelor finale (pentru profesor)
export const getToateNotelePtProfesor = async () => {
    try {
        const proiecte = await Proiect.findAll({
            attributes: ['idProiect', 'titlu'],
            include: [{
                model: Echipa,
                as: 'Echipa',
                attributes: ['EchipaNume']
            }]
        });

        // pentru fiecare proiect, este calculata nota finală
        const rezultate = await Promise.all(proiecte.map(async (proiect) => {
            try {
                const notaFinala = await calculeazaNotaFinala(proiect.idProiect);
                return {
                    idProiect: proiect.idProiect,
                    titluProiect: proiect.titlu,
                    numeEchipa: proiect.Echipa?.EchipaNume,
                    notaFinala: notaFinala
                };
            } catch (err) {
                return {
                    idProiect: proiect.idProiect,
                    titluProiect: proiect.titlu,
                    numeEchipa: proiect.Echipa?.EchipaNume,
                    notaFinala: null,
                    mesaj: "Note insuficiente"
                };
            }
        }));

        return rezultate;
    } catch (error) {
        throw new Error(`Eroare la obținerea notelor: ${error.message}`);
    }
};

// Funcție pentru obținerea notei propriului proiect (pentru student)
export const getNotaPropriuProiect = async (utilizatorId) => {
    try {
       
        const utilizator = await Utilizator.findByPk(utilizatorId, {
            include: [{
                model: Echipa,
                as: 'Membri',
                include: [{
                    model: Proiect,
                    as: 'Proiect'
                }]
            }]
        });

        if (!utilizator.Membri?.Proiect) {
            throw new Error("Nu aveți un proiect asociat");
        }

        const proiectId = utilizator.Membri.Proiect.idProiect;
        const notaFinala = await calculeazaNotaFinala(proiectId);

        return {
            titluProiect: utilizator.Membri.Proiect.titlu,
            numeEchipa: utilizator.Membri.EchipaNume,
            notaFinala: notaFinala
        };
    } catch (error) {
        throw new Error(`Eroare la obținerea notei: ${error.message}`);
    }
};