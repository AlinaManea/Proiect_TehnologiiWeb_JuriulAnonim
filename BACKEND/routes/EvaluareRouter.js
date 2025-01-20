import express from 'express';
import { createEvaluare, getEvaluari, getEvaluareById, updateEvaluare, deleteEvaluare } from '../dataAccess/EvaluareDA.js';
import  authMiddleware from '../middleware/middlewareAuth.js';
import Proiect from '../entities/Proiect.js';
import Livrabil from '../entities/Livrabil.js';

import { selecteazaJuriu } from '../dataAccess/juriuController.js';

let evaluareRouter = express.Router();


// Ruta pentru selectarea juriului
// evaluareRouter.get('/selecteaza-juriu/:idProiect/:numarJurati', async (req, res) => {
//     try {
//         const { idProiect, numarJurati } = req.params;
//         const jurati = await selecteazaJuriu(idProiect, parseInt(numarJurati));
//         res.status(200).json(jurati);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

let juriuSelectat = {}; // Obiect pentru stocarea juriului selectat per proiect

// După selectarea juriului, se salveaza ID-urile în `juriuSelectat`
evaluareRouter.get('/selecteaza-juriu/:idProiect/:numarJurati', async (req, res) => {
    try {
        const { idProiect, numarJurati } = req.params;
        const jurati = await selecteazaJuriu(idProiect, parseInt(numarJurati));
        
        // Salvează ID-urile utilizatorilor selectați ca juriu pentru proiectul respectiv
        juriuSelectat[idProiect] = jurati;

        res.status(200).json(jurati);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
