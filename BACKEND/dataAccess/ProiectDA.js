import Proiect from '../entities/Proiect.js';
import Echipa from '../entities/Echipa.js';
import Livrabil from '../entities/Livrabil.js';
import Utilizator from '../entities/Utilizator.js';

export const getLivrabileByProiectId = async (idProiect) => {
    try {
       
        const proiect = await Proiect.findByPk(idProiect, {
            include: [
                {
                    model: Livrabil,
                    as: 'Livrabile', 
                    attributes: ['idLivrabil', 'numeLivrabil', 'dataLivrare', 'videoLink', 'proiectLink']
                },
                {
                    model: Echipa,
                    as: 'Echipa', 
                    attributes: ['EchipaId', 'EchipaNume']
                }
            ]
        });
        
        if (!proiect) {
            throw new Error('Proiectul nu a fost găsit!');
        }

       
        return {
            idProiect: proiect.idProiect,
            titlu: proiect.titlu,
            EchipaId: proiect.EchipaId,
            Livrabile: proiect.Livrabile, 
            Echipa: proiect.Echipa, 
        };
    } catch (err) {
        console.error('Error fetching livrabile by proiect id:', err);
        throw err;
    }
};


export async function getProiecte() {
    try {
        return await Proiect.findAll({
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


export async function creareProiect(data, userId) {
    try {
        const echipa = await Echipa.findByPk(data.EchipaId);
        if (!echipa) {
            throw new Error('Echipa nu a fost găsită!');
        }

        // Verificăm dacă echipa are deja un proiect asociat
        const existingProject = await Proiect.findOne({ where: { EchipaId: data.EchipaId } });
        if (existingProject) {
            throw new Error('Această echipă are deja un proiect asociat!');
        }

        const utilizatoriInEchipa = await Utilizator.findAll({
            where: { EchipaId: data.EchipaId, UtilizatorId: userId }
        });

        if (utilizatoriInEchipa.length === 0) {
            throw new Error('Utilizatorul nu face parte din echipa specificată!');
        }

        // 
        const proiect = await Proiect.create({
            titlu: data.titlu,
            EchipaId: data.EchipaId
        });

        return proiect; 
    } catch (err) {
        // Capturăm eroarea originală fără a o arunca din nou
        console.error('Eroare la crearea proiectului:', err.message);
        throw err; // Aruncăm eroarea așa cum este
    }
}



