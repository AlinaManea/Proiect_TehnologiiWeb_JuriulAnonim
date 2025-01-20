import Livrabil from '../entities/Livrabil.js';
import Proiect from '../entities/Proiect.js';
import Echipa from '../entities/Echipa.js';
import Utilizator from '../entities/Utilizator.js';



// Obține toate livrabilele
export const getLivrabile = async () => {
    try {
        return await Livrabil.findAll({
            include: [
                {
                    model: Proiect,
                    as: 'Proiect',
                    attributes: ['titlu'] // Exemplu de a include doar câteva câmpuri ale proiectului
                },
                {
                    model: Echipa,
                    as: 'Echipa',
                    attributes: ['id', 'nume'] // Include doar câmpurile necesare din Echipa
                }
            ]
        });
    } catch (err) {
        console.error('Error fetching livrables:', err);
        throw err;
    }
};

// Obține un livrabil după ID
export const getLivrabilById = async (id) => {
    try {
        return await Livrabil.findOne({
            where: { idLivrabil: id },
            include: [
                {
                    model: Proiect,
                    as: 'Proiect',
                    attributes: ['titlu']
                },
                {
                    model: Echipa,
                    as: 'Echipa',
                    attributes: ['id', 'nume']
                }
            ]
        });
    } catch (err) {
        console.error('Error fetching livrable by id:', err);
        throw err;
    }
};

// Crează un livrabil nou
export const createLivrabil = async (data) => {
    try {
        const newLivrabil = await Livrabil.create(data);
        return newLivrabil;
    } catch (err) {
        console.error('Error creating livrable:', err);
        throw err;
    }
};

// Actualizează un livrabil existent
export const updateLivrabil = async (data, id) => {
    try {
        const livrabil = await Livrabil.findByPk(id);
        if (!livrabil) {
            return { error: true, msg: 'Livrabil not found' };
        }

        await livrabil.update(data);
        return { error: false, obj: livrabil };
    } catch (err) {
        console.error('Error updating livrable:', err);
        throw err;
    }
};

// Șterge un livrabil
export const deleteLivrabil = async (id) => {
    try {
        const livrabil = await Livrabil.findByPk(id);
        if (!livrabil) {
            return { error: true, msg: 'Livrabil not found' };
        }

        await livrabil.destroy();
        return { error: false, obj: 'Livrabil deleted successfully' };
    } catch (err) {
        console.error('Error deleting livrable:', err);
        throw err;
    }
};


export const creareLivrabil = async ({ dataLivrare, videoLink, proiectLink, idProiect, userId, numeLivrabil }) => {
    try {
        // Verificăm dacă proiectul există
        const proiect = await Proiect.findByPk(idProiect);
        if (!proiect) {
            throw new Error('Proiectul nu a fost găsit!');
        }

        // Verificăm dacă echipa proiectului există
        const echipa = await Echipa.findByPk(proiect.EchipaId);
        if (!echipa) {
            throw new Error('Echipa proiectului nu a fost găsită!');
        }

        // Verificăm dacă utilizatorul face parte din echipa proiectului
        const utilizatorInEchipa = await Utilizator.findOne({
            where: { EchipaId: echipa.EchipaId, UtilizatorId: userId } // Condiție corectă de interogare
        });

        if (!utilizatorInEchipa) {
            throw new Error('Nu faceți parte din echipa proiectului!');
        }

        // Creăm livrabilul
        const livrabil = await Livrabil.create({
            dataLivrare,
            videoLink,
            proiectLink,
            numeLivrabil,
            idProiect: idProiect,
            EchipaId: echipa.EchipaId,  
        });

        return livrabil;
    } catch (err) {
        throw new Error(err.message);
    }
};
