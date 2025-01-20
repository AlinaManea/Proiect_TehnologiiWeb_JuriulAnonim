import Utilizator from '../entities/Utilizator.js';
import Proiect from '../entities/Proiect.js';
import Livrabil from '../entities/Livrabil.js';

import { Op } from 'sequelize';

// Funcție pentru selectarea aleatorie a juriului
export async function selecteazaJuriu(idProiect, numarJurati) {
    try {
        // Găsim proiectul specific
        const proiect = await Proiect.findByPk(idProiect);

        if (!proiect) {
            throw new Error('Proiectul nu a fost găsit!');
        }

        // Găsim utilizatorii care nu sunt în echipa proiectului și au rolul de student
        const studentiDisponibili = await Utilizator.findAll({
            where: {
                EchipaId: { [Op.ne]: proiect.EchipaId },
                UtilizatorRol: 'student'
            }
        });

        if (studentiDisponibili.length < numarJurati) {
            throw new Error('Nu există suficienți studenți disponibili pentru a forma juriul.');
        }

        const juratiSelectati = studentiDisponibili
            .sort(() => 0.5 - Math.random())
            .slice(0, numarJurati);

        return juratiSelectati.map(student => student.UtilizatorId);
    } catch (err) {
        throw new Error('Eroare la selectarea juriului: ' + err.message);
    }
}
