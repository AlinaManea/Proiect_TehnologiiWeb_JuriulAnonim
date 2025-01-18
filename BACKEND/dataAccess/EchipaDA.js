import Echipa from "../entities/Echipa.js";
import Utilizator from "../entities/Utilizator.js";
import LikeOp from "./Operators.js";


async function getEchipe() {
    return await Echipa.findAll({ include: [{ model: Utilizator, as: "Membri" }] });
}

async function getEchipaById(id) {
    return await Echipa.findByPk(id, { include: [{ model: Utilizator, as: "Membri" }] });
}

async function createEchipa(echipa) {
    try {
        return await Echipa.create(echipa, {
            include: [{ model: Utilizator, as: "Membri" }],
        });
    } catch (e) {
        if (e.message.includes("notNull Violation")) {
            throw new Error("Campuri obligatorii lipsesc.");
        } else {
            throw e;
        }
    }
}

async function deleteEchipa(id) {
    let echipaToDelete = await getEchipaById(id);
    if (!echipaToDelete)
        return { error: true, msg: "Echipa nu a fost gasita." };

    return {
        error: false,
        msg: "",
        obj: await echipaToDelete.destroy(),
    };
}

export {
    getEchipe,
    getEchipaById,
    createEchipa,
    deleteEchipa,
};