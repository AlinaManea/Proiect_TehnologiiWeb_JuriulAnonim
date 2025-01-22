import express from 'express';
import {
    getLivrabile,
    getLivrabilById,
    createLivrabil,
    updateLivrabil,
    deleteLivrabil,
    creareLivrabil,
} from '../dataAccess/LivrabilDA.js';
import authMiddleware from '../middleware/middlewareAuth.js';
import validator from 'validator';


let livrabilRouter = express.Router();

// GET: Obține toate livrabilele
livrabilRouter.route('/livrabil').get(async (req, res) => {
    try {
        const livrabile = await getLivrabile();
        res.status(200).json(livrabile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: Obține un livrabil după ID
livrabilRouter.route('/livrabil/:id').get(async (req, res) => {
    try {
        const livrabil = await getLivrabilById(req.params.id);
        if (livrabil) {
            res.status(200).json(livrabil);
        } else {
            res.status(404).json({ message: 'Livrabil not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST: Crează un livrabil nou
livrabilRouter.route('/livrabil').post(async (req, res) => {
    try {
        const newLivrabil = await createLivrabil(req.body);
        res.status(201).json(newLivrabil);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT: Actualizează un livrabil existent după ID
livrabilRouter.route('/livrabil/:id').put(async (req, res) => {
    try {
        const updatedLivrabil = await updateLivrabil(req.body, req.params.id);
        if (updatedLivrabil.error) {
            res.status(400).json(updatedLivrabil.msg);
        } else {
            res.status(200).json(updatedLivrabil.obj);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// DELETE: Șterge un livrabil după ID
livrabilRouter.route('/livrabil/:id').delete(async (req, res) => {
    try {
        const deletedLivrabil = await deleteLivrabil(req.params.id);
        if (deletedLivrabil.error) {
            res.status(400).json(deletedLivrabil.msg);
        } else {
            res.status(200).json(deletedLivrabil.obj);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

livrabilRouter.post('/proiect/:idProiect/livrabil', authMiddleware, async (req, res) => {
    const { numeLivrabil, dataLivrare, videoLink, proiectLink } = req.body;
    const { idProiect } = req.params;
    const userId = req.user.id; 

    try {
        if (!numeLivrabil || numeLivrabil.trim() === "") {
            return res.status(400).json({ message: 'Numele livrabilului este obligatoriu!' });
        }

        if (!dataLivrare || !validator.isISO8601(dataLivrare)) {
            return res.status(400).json({
                message: 'Data livrării trebuie să fie într-un format ISO8601 valid (ex: 2025-01-30T12:00:00Z).'
            });
        }

        // if (videoLink && !validator.isURL(videoLink, { protocols: ['http', 'https'] })) {
        //     return res.status(400).json({ message: 'Link-ul video nu este valid!' });
        // }

        // if (proiectLink && !validator.isURL(proiectLink, { protocols: ['http', 'https'] })) {
        //     return res.status(400).json({ message: 'Link-ul proiectului nu este valid!' });
        // }

        if (videoLink && !/^https?:\/\//i.test(videoLink)) {
            return res.status(400).json({ message: 'Link-ul video trebuie să înceapă cu http:// sau https://' });
        }
        
        if (proiectLink && !/^https?:\/\//i.test(proiectLink)) {
            return res.status(400).json({ message: 'Link-ul proiectului trebuie să înceapă cu http:// sau https://' });
        }
        
        const livrabil = await creareLivrabil({
            numeLivrabil,
            dataLivrare,
            videoLink,
            proiectLink,
            idProiect,
            userId
        });

        return res.status(201).json({
            message: 'Livrabilul a fost creat cu succes!',
            livrabil
        });
    } catch (err) {
        console.error(err);
        if (err.message.includes('Nu faceți parte din echipa proiectului')) {
            return res.status(403).json({ message: err.message });
        }
        return res.status(500).json({
            message: 'Eroare la adăugarea livrabilului.',
            error: err.message
        });
    }
});

export default livrabilRouter;
