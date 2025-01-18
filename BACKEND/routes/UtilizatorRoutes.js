import express from 'express';
import db from '../dbConfig.js';
import { getUtilizatori, getUtilizatorById, createUtilizator, updateUtilizator, deleteUtilizator } from '../dataAccess/UtilizatorDA.js';

let utilizatorRouter = express.Router();

// GET: Obține toți utilizatorii
utilizatorRouter.route('/utilizator').get(async (req, res) => {
    try {
        res.status(200).json(await getUtilizatori());
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});

// GET: Obține un utilizator după ID
utilizatorRouter.route('/utilizator/:id').get(async (req, res) => {
    try {
        res.status(200).json(await getUtilizatorById(req.params.id));
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});

// POST: Crează un utilizator nou
utilizatorRouter.route('/utilizator').post(async (req, res) => {
    try {
        res.status(201).json(await createUtilizator(req.body));
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'server error' });
    }
});

// PUT: Actualizează un utilizator existent după ID
utilizatorRouter.route('/utilizator/:id').put(async (req, res) => {
    try {
        let ret = await updateUtilizator(req.body, req.params.id);
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

// DELETE: Șterge un utilizator după ID
utilizatorRouter.route('/utilizator/:id').delete(async (req, res) => {
    try {
        let ret = await deleteUtilizator(req.params.id);
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

export default utilizatorRouter;
