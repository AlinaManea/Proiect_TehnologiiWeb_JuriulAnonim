// import Utilizator from '../entities/Utilizator.js';

// async function  createUtilizator(utilizator) {
//     return await Utilizator.create(utilizator);
// }

// async function getUtilizatori() {
//     return await Utilizator.findAll();
// }

// async function getUtilizatorById(id) {
//     return await Utilizator.findByPk(id);
// }

// async function updateUtilizator(utilizator,id) {
//     if(parseInt(id)!==utilizator.UtilizatorId)
//         return {error:true,msg:"Entity id diff"}

//     let updateE=await getUtilizatorId(id);
//     if(!updateE)
//         return{error:true,msg:"No entity found"}

//     return{error:false,msg:"",obj:await updateE.update(utilizator)}
// }

// async function deleteUtilizator(id) {
//     let deteleE=await getUtilizatorId(id);
//     if(!deteleE)
//         return{error:true,msg:"No entity found"}

//     return{error:false,msg:"",obj:await deteleE.destroy()}
// }

// export {createUtilizator,getUtilizatori,getUtilizatorById,updateUtilizator,deleteUtilizator}

import Utilizator from "../entities/Utilizator.js";
import Echipa from "../entities/Echipa.js";
import LikeOp from "./Operators.js";

// Funcția de obținere a tuturor utilizatorilor
async function getUtilizatori() {
    return await Utilizator.findAll({
        include: [{ model: Echipa, as: "Membri" }] // Folosim aliasul "Membri"
    });
}

// Funcția de obținere a unui utilizator după ID
async function getUtilizatorById(id) {
    return await Utilizator.findByPk(id, {
        include: [{ model: Echipa, as: "Membri" }] // Folosim aliasul "Membri"
    });
}

async function getUtilizatorByEmail(email) {
    return await Utilizator.findOne({
        where: { UtilizatorEmail: email },
        include: [{ model: Echipa, as: "Membri" }]
    });
}
// Funcția de creare a unui utilizator
async function createUtilizator(utilizator) {
    try {
        return await Utilizator.create(utilizator, {
            include: [{ model: Echipa, as: "Membri" }] // Folosim aliasul "Membri"
        });
    } catch (e) {
        if (e.message.includes("notNull Violation")) {
            throw new Error("Campuri obligatorii lipsesc.");
        } else {
            throw e;
        }
    }
}


async function updateUtilizator(id, utilizator) {
    if (parseInt(id) !== utilizator.UtilizatorId)
        return { error: true, msg: "ID-ul entitatii este diferit." };

    let existingUtilizator = await getUtilizatorById(id);
    if (!existingUtilizator)
        return { error: true, msg: "Entitatea nu a fost gasita." };

    return {
        error: false,
        msg: "",
        obj: await existingUtilizator.update(utilizator),
    };
}

async function deleteUtilizator(id) {
    let utilizatorToDelete = await getUtilizatorById(id);
    if (!utilizatorToDelete)
        return { error: true, msg: "Entitatea nu a fost gasita." };

    return {
        error: false,
        msg: "",
        obj: await utilizatorToDelete.destroy(),
    };
}

// Exemplu de filtrare si paginare
async function getUtilizatoriWithFilterAndPagination(filter) {
    if (!filter.take) filter.take = 10;
    if (!filter.skip) filter.skip = 1;

    let whereClause = {};
    if (filter.utilizatorName) {
        whereClause.Nume = { [LikeOp]: `%${filter.utilizatorName}%` };
    }

    let whereIncludeClause = {};
    if (filter.echipaName) {
        whereIncludeClause.Nume = { [LikeOp]: `%${filter.echipaName}%` };
    }

    return await Utilizator.findAndCountAll({
        distinct: true,
        include: [
            {
                model: Echipa,
                as: "Membri",
                where: whereIncludeClause,
            },
        ],
        where: whereClause,
        limit: parseInt(filter.take),
        offset: parseInt(filter.skip - 1) * parseInt(filter.take),
    });
}

export {
    getUtilizatori,
    getUtilizatorById,
    getUtilizatorByEmail,
    createUtilizator,
    updateUtilizator,
    deleteUtilizator,
    getUtilizatoriWithFilterAndPagination,
};