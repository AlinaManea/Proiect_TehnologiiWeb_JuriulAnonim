import Evaluare from '../entities/Evaluare.js';
import Proiect from '../entities/Proiect.js';
import Utilizator from '../entities/Utilizator.js';

// GET: Obține toate evaluările
export async function getEvaluari() {
    try {
        return await Evaluare.findAll({
            include: [
                {
                    model: Proiect,
                    as: 'Proiecte',  
                    required: true
                },
                {
                    model: Utilizator,
                    as: 'Utilizatori',  
                    required: true
                }
            ]
        });
    } catch (err) {
        throw new Error('Unable to fetch evaluations: ' + err.message);
    }
}

// GET: Obține o evaluare după ID
export async function getEvaluareById(id) {
    try {
        const evaluare = await Evaluare.findByPk(id, {
            include: [
                {
                    model: Proiect,
                    as: 'Proiecte',
                    required: true
                },
                {
                    model: Utilizator,
                    as: 'Utilizatori',
                    required: true
                }
            ]
        });

        if (!evaluare) {
            throw new Error('Evaluare not found');
        }
        return evaluare;
    } catch (err) {
        throw new Error('Unable to fetch evaluation: ' + err.message);
    }
}

export async function createEvaluare(data) {
    try {
        // Crearea unei evaluări direct, fără includerea modelelor asociate
        const evaluare = await Evaluare.create(data);
        
        return evaluare;
    } catch (err) {
        console.error("Error creating evaluation:", err);
        throw new Error('Unable to create evaluation: ' + err.message);
    }
}

// PUT: Actualizează o evaluare existentă după ID
export async function updateEvaluare(data, id) {
    try {
        const evaluare = await Evaluare.findByPk(id);
        if (!evaluare) {
            throw new Error('Evaluare not found');
        }
        await evaluare.update(data);
        return { obj: evaluare, error: false };
    } catch (err) {
        return { msg: 'Unable to update evaluation: ' + err.message, error: true };
    }
}

// DELETE: Șterge o evaluare după ID
export async function deleteEvaluare(id) {
    try {
        const evaluare = await Evaluare.findByPk(id);
        if (!evaluare) {
            throw new Error('Evaluare not found');
        }
        await evaluare.destroy();
        return { obj: evaluare, error: false };
    } catch (err) {
        return { msg: 'Unable to delete evaluation: ' + err.message, error: true };
    }
}
