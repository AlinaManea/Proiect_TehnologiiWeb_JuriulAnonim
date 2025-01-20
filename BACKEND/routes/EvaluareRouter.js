import express from 'express';
import { createEvaluare, getEvaluari, getEvaluareById, updateEvaluare, deleteEvaluare,adaugaJuriu} from '../dataAccess/EvaluareDA.js';
//import  authMiddleware from '../middleware/middlewareAuth.js';
import {authMiddleware, checkRole } from '../middleware/middlewareAuth.js';
import { selecteazaJuriu } from '../dataAccess/juriuController.js';

let evaluareRouter = express.Router();

// Ruta pentru selectarea juriului (cu autentificare și verificare rol profesor)
let juriuSelectat = {}; 

evaluareRouter.get('/selecteaza-juriu/:idProiect/:numarJurati', authMiddleware, checkRole('profesor'), async (req, res) => {
    try {
        const { idProiect, numarJurati } = req.params;

        // Apelează funcția selectează juriul și obține ID-urile studenților selectați
        const jurati = await selecteazaJuriu(idProiect, parseInt(numarJurati));

        // Dacă nu există erori, trimitem lista juraților
        res.status(200).json({ jurati });

    } catch (err) {
        // Dacă a apărut vreo eroare (proiectul are deja un juriu selectat sau alta eroare)
        res.status(400).json({ error: err.message });
    }
});

//Punere in baza de date evaluare

evaluareRouter.post('/adauga-juriu', authMiddleware, checkRole('profesor'), async (req, res) => {
    try {
        const { idProiect, jurati } = req.body;  
        if (!idProiect || !jurati || jurati.length === 0) {
            throw new Error("ID-ul proiectului și lista de jurați sunt obligatorii");
        }

        const result = await adaugaJuriu(idProiect, jurati);
        res.status(200).json({ message: 'Jurații au fost adăugați cu succes', evaluari: result });

    } catch (err) {

        res.status(400).json({ error: err.message });
    }
});

import { acordaNota,esteJuratPentruProiect } from '../dataAccess/EvaluareDA.js';

evaluareRouter.put('/acorda-nota/:proiectId', authMiddleware, checkRole('student'), async (req, res) => {
    try {
        const { proiectId } = req.params;
        const { nota } = req.body;  // Nu mai ai nevoie de utilizatorId în body

        // Verifică dacă utilizatorul este jurat pentru proiectul respectiv
        const esteJurat = await esteJuratPentruProiect(proiectId, req.utilizator.id);
        
        if (!esteJurat) {
            return res.status(403).json({ error: "Nu poți acorda nota acestui proiect. Nu ești jurat pentru acest proiect." });
        }

        // Verifică dacă nota este între 1 și 10
        if (nota < 1 || nota > 10) {
            throw new Error("Nota trebuie să fie între 1 și 10");
        }

        // Acordă nota în baza de date
        const evaluareActualizata = await acordaNota(proiectId, req.utilizator.id, nota);

        // Răspunsul la succes
        res.status(200).json({ message: 'Nota a fost adăugată cu succes', evaluare: evaluareActualizata });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// GET: Obține toate evaluările
evaluareRouter.route('/evaluare').get(async (req, res) => {
    try {
        res.status(200).json(await getEvaluari());
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});

// GET: Obține o evaluare după ID
evaluareRouter.route('/evaluare/:id').get(async (req, res) => {
    try {
        res.status(200).json(await getEvaluareById(req.params.id));
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});

// POST: Crează o evaluare nouă
evaluareRouter.route('/evaluare').post(async (req, res) => {
    try {
        res.status(201).json(await createEvaluare(req.body));
    } catch (err) {
        console.error("Error:", err); 
        res.status(500).json({ message: 'server error', error: err.message });
    }
});

// PUT: Actualizează o evaluare existentă după ID
evaluareRouter.route('/evaluare/:id').put(async (req, res) => {
    try {
        let ret = await updateEvaluare(req.body, req.params.id);
        if (ret.error) {
            res.status(400).json(ret.msg);
        } else {
            res.status(200).json(ret.obj);
        }
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});

// DELETE: Șterge o evaluare după ID
evaluareRouter.route('/evaluare/:id').delete(async (req, res) => {
    try {
        let ret = await deleteEvaluare(req.params.id);
        if (ret.error) {
            res.status(400).json(ret.msg);
        } else {
            res.status(200).json(ret.obj);
        }
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});


// evaluareRouter.post('/selecteaza-juriu/:proiectId', authMiddleware, selecteazaJuriu);
// evaluareRouter.post('/acorda-nota/:proiectId', authMiddleware, acordaNota);
// evaluareRouter.get('/nota-finala/:proiectId', authMiddleware, calculeazaNotaFinala);
export default evaluareRouter;
