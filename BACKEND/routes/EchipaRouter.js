import express from 'express';
import db from '../dbConfig.js';
import {
    getEchipe,
    getEchipaById,
    createEchipa,
    deleteEchipa
} from '../dataAccess/EchipaDA.js';

let echipaRouter = express.Router();

// GET: Obține toate echipele
echipaRouter.route('/echipa').get(async (req, res) => {
    try {
        res.status(200).json(await getEchipe());
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});

// GET: Obține o echipă după ID
echipaRouter.route('/echipa/:id').get(async (req, res) => {
    try {
        res.status(200).json(await getEchipaById(req.params.id));
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});

// POST: Crează o echipă nouă
echipaRouter.route('/echipa').post(async (req, res) => {
    try {
        res.status(201).json(await createEchipa(req.body));
    } catch (err) {
        console.error("Error:", err); 
        res.status(500).json({ message: 'server error', error: err.message });
    }
    
});

// PUT: Actualizează o echipă existentă după ID
echipaRouter.route('/echipa/:id').put(async (req, res) => {
    try {
        let ret = await updateEchipa(req.body, req.params.id);
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

// DELETE: Șterge o echipă după ID
echipaRouter.route('/echipa/:id').delete(async (req, res) => {
    try {
        let ret = await deleteEchipa(req.params.id);
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

export default echipaRouter;
