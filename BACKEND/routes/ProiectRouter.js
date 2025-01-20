import express from 'express';
import { getProiecte, getProiectById, createProiect, updateProiect, deleteProiect, creareProiect,getLivrabileByProiectId} from '../dataAccess/ProiectDA.js';
import authMiddleware from '../middleware/middlewareAuth.js';

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


//craere proiecte de catre utilizator
proiectRouter.post('/creareproiect', authMiddleware, async (req, res) => {
    const { titlu, EchipaId } = req.body;
    const userId = req.user.id;
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Numai studenții pot crea proiecte!' });
    }

    if (!titlu || !EchipaId) {
        return res.status(400).json({ message: 'Titlu și EchipaId sunt necesare!' });
    }

    try {
        const proiect = await creareProiect({ titlu, EchipaId }, userId);
        return res.status(201).json(proiect); 
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Eroare la crearea proiectului: ' + err.message });
    }
});


// Ruta pentru vizualizarea livrabilelor pentru toată lumea

proiectRouter.get('/proiect/:idProiect/livrabile', authMiddleware, async (req, res) => {
    try {
        const { idProiect } = req.params;
        const proiect = await getLivrabileByProiectId(idProiect);

        res.status(200).json(proiect);
    } catch (err) {
        if (err.message === 'Proiectul nu a fost găsit!') {
            return res.status(404).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });
    }
});

export default proiectRouter;