import Proiect from '../entities/Proiect.js';
import Echipa from '../entities/Echipa.js';
import Livrabil from '../entities/Livrabil.js';
import Utilizator from '../entities/Utilizator.js';

export async function getProiecte() {
    try {
        return await Proiect.findAll({
            include: [
                {
                    model: Echipa,
                    as: 'Echipa',  // alias-ul pentru relația 1:1
                    required: true
                },
                {
                    model: Livrabil,
                    as: 'Livrabile', // alias-ul pentru relația 1:N între Proiect și Livrabil
                    required: false
                },
                {
                    model: Utilizator,
                    as: 'Utilizatori', // alias-ul pentru relația N:M prin Evaluare
                    required: false
                }
            ]
        });
    } catch (err) {
        throw new Error('Unable to fetch projects: ' + err.message);
    }
}

export async function getProiectById(id) {
    try {
        const proiect = await Proiect.findByPk(id, {
            include: [
                {
                    model: Echipa,
                    as: 'Echipa',
                    required: true
                },
                {
                    model: Livrabil,
                    as: 'Livrabile',
                    required: false
                },
                {
                    model: Utilizator,
                    as: 'Utilizatori',
                    required: false
                }
            ]
        });

        if (!proiect) {
            throw new Error('Proiect not found');
        }
        return proiect;
    } catch (err) {
        throw new Error('Unable to fetch project: ' + err.message);
    }
}

export async function createProiect(data) {
    try {
        const proiect = await Proiect.create(data, {
            include: [
                {
                    model: Echipa,
                    as: 'Echipa'
                }
            ]
        });
        return proiect;
    } catch (err) {
        throw new Error('Unable to create project: ' + err.message);
    }
}

export async function updateProiect(data, id) {
    try {
        const proiect = await Proiect.findByPk(id);
        if (!proiect) {
            throw new Error('Proiect not found');
        }
        await proiect.update(data);
        return { obj: proiect, error: false };
    } catch (err) {
        return { msg: 'Unable to update project: ' + err.message, error: true };
    }
}

export async function deleteProiect(id) {
    try {
        const proiect = await Proiect.findByPk(id);
        if (!proiect) {
            throw new Error('Proiect not found');
        }
        await proiect.destroy();
        return { obj: proiect, error: false };
    } catch (err) {
        return { msg: 'Unable to delete project: ' + err.message, error: true };
    }
}
