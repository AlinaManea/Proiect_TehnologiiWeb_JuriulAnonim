import express from 'express';
import { createEvaluare, getEvaluari, getEvaluareById, updateEvaluare, deleteEvaluare,adaugaJuriu, acordaNota,esteJuratPentruProiect,getToateNotelePtProfesor,getNotaPropriuProiect,getProiecteEvaluare} from '../dataAccess/EvaluareDA.js';
import {authMiddleware, checkRole } from '../middleware/middlewareAuth.js';
import { selecteazaJuriu } from '../dataAccess/juriuController.js';


let evaluareRouter = express.Router();

// Ruta pentru selectarea juriului (cu autentificare și verificare rol profesor)
let juriuSelectat = {}; 
// Selectare juriu
evaluareRouter.get(
    '/selecteaza-juriu/:idProiect/:numarJurati',
    authMiddleware,
    checkRole('profesor'),
    async (req, res) => {
      try {
        const { idProiect, numarJurati } = req.params;
        const jurati = await selecteazaJuriu(idProiect, parseInt(numarJurati));
        res.status(200).json({ jurati });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  );
  
  // Adăugare juriu în baza de date
  evaluareRouter.post(
    '/adauga-juriu',
    authMiddleware,
    checkRole('profesor'),
    async (req, res) => {
      try {
        const { idProiect, jurati } = req.body;
  
        if (!idProiect || !jurati || jurati.length === 0) {
          throw new Error("ID-ul proiectului și lista de jurați sunt obligatorii");
        }
  
        const result = await adaugaJuriu(idProiect, jurati);
        res.status(200).json({
          message: 'Jurații au fost adăugați cu succes',
          evaluari: result
        });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  );
  

// de vazut proiect de evaluat - student

evaluareRouter.get('/proiecte-evaluare/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
      console.log("Fetching projects for user:", userId); 

      const proiecte = await getProiecteEvaluare(userId);
      console.log("Projects found:", proiecte); 

      res.status(200).json(proiecte);
  } catch (error) {
      console.error("Error fetching projects for evaluation:", error.message); 
      res.status(500).json({ message: 'Eroare la preluarea proiectelor pentru evaluare.', error: error.message });
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



export default evaluareRouter;