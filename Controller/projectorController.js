
import * as queries from "../queries/projectorsQueries.js";


// Ajouter un projecteur
export async function addProjector(req, res) {
    try {
        const { nom_projector, batiment, etat } = req.body;
        if (!nom_projector || !batiment) {
            return res.status(400).json({ success: false, message: "Nom du projecteur et bâtiment requis" });
        }

        const result = await queries.createProjector(nom_projector, batiment, etat);
        return res.status(201).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

// Lister tous les projecteurs
export async function listProjectors(req, res) {
    try {
        const projectors = await queries.getAllProjectors();
        return res.status(200).json({ success: true, projectors });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

// Modifier l'état d'un projecteur
export async function modifyProjector(req, res) {
    try {
        const { id } = req.params;
        const { nom_projector, batiment, etat } = req.body;

        if (!etat) {
            return res.status(400).json({ success: false, message: "L'état du projecteur est requis" });
        }

        const result = await queries.updateProjector(id, nom_projector, batiment, etat);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });

    }
}

// Supprimer un projecteur
export async function removeProjector(req, res) {
    try {
        const { id } = req.params;
        const result = await queries.deleteProjector(id);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

export default { addProjector, listProjectors, modifyProjector, removeProjector };

