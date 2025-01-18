import express from 'express';
import { getProiecte, getProiectById, createProiect, updateProiect, deleteProiect } from '../dataAccess/ProiectDA.js';

let proiectRouter = express.Router();

// GET: Obține toate proiectele
proiectRouter.route('/proiect').get(async (req, res) => {
    try {
        res.status(200).json(await getProiecte());
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});

// GET: Obține un proiect după ID
proiectRouter.route('/proiect/:id').get(async (req, res) => {
    try {
        res.status(200).json(await getProiectById(req.params.id));
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});

// POST: Crează un proiect nou
proiectRouter.route('/proiect').post(async (req, res) => {
    try {
        res.status(201).json(await createProiect(req.body));
    } catch (err) {
        console.error("Error:", err); 
        res.status(500).json({ message: 'server error', error: err.message });
    }
});

// PUT: Actualizează un proiect existent după ID
proiectRouter.route('/proiect/:id').put(async (req, res) => {
    try {
        let ret = await updateProiect(req.body, req.params.id);
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

// DELETE: Șterge un proiect după ID
proiectRouter.route('/proiect/:id').delete(async (req, res) => {
    try {
        let ret = await deleteProiect(req.params.id);
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

export default proiectRouter;
