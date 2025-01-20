import Evaluare from '../entities/Evaluare.js';
import Proiect from '../entities/Proiect.js';
import Utilizator from '../entities/Utilizator.js';

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


import { Op } from 'sequelize';

// 1. Selectarea aleatorie a juriului
export const selecteazaJuriu = async (req, res) => {
    try {
        const { proiectId } = req.params;
        const DIMENSIUNE_JURIU = 5; // Să avem suficienți jurați pentru a elimina note extreme

        // Găsim proiectul și membrii echipei
        const proiect = await Proiect.findOne({
            where: { idProiect: proiectId },
            include: [{
                model: Utilizator,
                as: 'Membri'
            }]
        });

        if (!proiect) {
            return res.status(404).json({ message: "Proiectul nu există" });
        }

        // Găsim ID-urile membrilor echipei pentru a-i exclude
        const idMembriiEchipa = proiect.Membri.map(membru => membru.UtilizatorId);

        // Selectăm aleator studenți care NU sunt în echipă
        const juratiSelectati = await Utilizator.findAll({
            where: {
                UtilizatorId: { [Op.notIn]: idMembriiEchipa },
                UtilizatorRol: 'student'
            },
            order: Sequelize.literal('RAND()'),
            limit: DIMENSIUNE_JURIU
        });

        // Creăm înregistrări în tabelul Evaluare pentru jurații selectați
        await Promise.all(juratiSelectati.map(jurat => 
            Evaluare.create({
                ProiectId: proiectId,
                UtilizatorId: jurat.UtilizatorId,
                Nota: null // Va fi completată când juratul acordă nota
            })
        ));

        res.json({ message: "Juriul a fost selectat cu succes" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Acordarea notei de către un membru al juriului
export const acordaNota = async (req, res) => {
    try {
        const { proiectId } = req.params;
        const { nota } = req.body;
        const utilizatorId = req.user.id; // Din token-ul de autentificare

        // Verificăm dacă utilizatorul este în juriu
        const evaluare = await Evaluare.findOne({
            where: {
                ProiectId: proiectId,
                UtilizatorId: utilizatorId
            }
        });

        if (!evaluare) {
            return res.status(403).json({ 
                message: "Nu sunteți membru al juriului pentru acest proiect" 
            });
        }

        // Validăm nota (1-10 cu 2 zecimale)
        const notaNumber = parseFloat(nota);
        if (isNaN(notaNumber) || notaNumber < 1 || notaNumber > 10) {
            return res.status(400).json({ 
                message: "Nota trebuie să fie între 1 și 10" 
            });
        }

        // Rotunjim la 2 zecimale
        const notaRotunjita = Math.round(notaNumber * 100) / 100;

        // Salvăm nota
        await evaluare.update({ Nota: notaRotunjita });

        res.json({ message: "Nota a fost acordată cu succes" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Calculul notei finale (pentru profesori)
export const calculeazaNotaFinala = async (req, res) => {
    try {
        const { proiectId } = req.params;

        // Verificăm dacă utilizatorul este profesor
        if (req.user.rol !== 'profesor') {
            return res.status(403).json({ 
                message: "Doar profesorii pot vedea nota finală" 
            });
        }

        // Luăm toate notele pentru proiect
        const evaluari = await Evaluare.findAll({
            where: {
                ProiectId: proiectId,
                Nota: { [Op.not]: null } // Doar notele acordate
            }
        });

        if (evaluari.length < 3) {
            return res.status(400).json({ 
                message: "Nu sunt suficiente note pentru a calcula media" 
            });
        }

        // Sortăm notele și eliminăm cea mai mare și cea mai mică
        const note = evaluari.map(e => e.Nota).sort((a, b) => a - b);
        const noteFiltrate = note.slice(1, -1);

        // Calculăm media
        const suma = noteFiltrate.reduce((acc, curr) => acc + curr, 0);
        const notaFinala = Math.round((suma / noteFiltrate.length) * 100) / 100;

        res.json({
            notaFinala,
            numarNote: note.length,
            noteEliminateMicMare: [note[0], note[note.length - 1]]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};