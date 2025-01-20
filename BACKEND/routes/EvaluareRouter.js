import express from 'express';
import { createEvaluare, getEvaluari, getEvaluareById, updateEvaluare, deleteEvaluare,adaugaJuriu, acordaNota,esteJuratPentruProiect,getToateNotelePtProfesor,getNotaPropriuProiect} from '../dataAccess/EvaluareDA.js';
import {authMiddleware, checkRole } from '../middleware/middlewareAuth.js';
import { selecteazaJuriu } from '../dataAccess/juriuController.js';


let evaluareRouter = express.Router();

// Ruta pentru selectarea juriului (cu autentificare și verificare rol profesor)
let juriuSelectat = {}; 
evaluareRouter.get('/selecteaza-juriu/:idProiect/:numarJurati', authMiddleware, checkRole('profesor'), async (req, res) => {
    try {
        const { idProiect, numarJurati } = req.params;
        const jurati = await selecteazaJuriu(idProiect, parseInt(numarJurati));
        res.status(200).json({ jurati });

    } catch (err) {
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



// Rută pentru acordarea notei
evaluareRouter.put('/acorda-nota/:proiectId', authMiddleware, async (req, res) => {
    try {
        const { proiectId } = req.params;
        const { nota } = req.body;
        const utilizatorId = req.user.id; 

        const esteJurat = await esteJuratPentruProiect(proiectId, utilizatorId);
        if (!esteJurat) {
            return res.status(403).json({ message: 'Nu sunteți autorizat să acordați notă pentru acest proiect' });
        }

        const evaluareActualizata = await acordaNota(proiectId, utilizatorId, nota);
        res.status(200).json(evaluareActualizata);

    } catch (error) {
        console.error('Eroare la acordarea notei:', error);
        res.status(500).json({ message: error.message });
    }
});

// Ruta pentru profesor - vizualizarea listelor cu proiecte + notele finale aferente
evaluareRouter.get('/note-finale', authMiddleware, checkRole('profesor'), async (req, res) => {
    try {
        const noteFinale = await getToateNotelePtProfesor();
        res.status(200).json(noteFinale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rută pentru student - vedere nota propriului proiect
evaluareRouter.get('/nota-mea', authMiddleware, async (req, res) => {
    try {
        const utilizatorId = req.user.id;
        const notaProiect = await getNotaPropriuProiect(utilizatorId);
        res.status(200).json(notaProiect);
    } catch (error) {
        res.status(500).json({ message: error.message });
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


export default evaluareRouter;
