import { createProjector, getAllProjectors, getProjectorById, updateProjector, deleteProjector } from "../queries/projectorsQueries.js";

// Ajouter un projecteur
export async function addProjector(req, res) {
    try {
        const { nom_projector, batiment, etat } = req.body;
        const result = await createProjector(nom_projector, batiment, etat);
        if (result.success) {
            res.status(201).json({ success: true, message: result.message, id: result.insertId });
        } else {
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// Lister les projecteurs
export async function listProjectors(req, res) {
    try {
        const projectors = await getAllProjectors();
        res.json(projectors);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// Modifier un projecteur
export async function modifyProjector(req, res) {
    try {
        const { nom_projector, batiment, etat } = req.body;
        const { id } = req.params;
        const result = await updateProjector(id, nom_projector, batiment, etat);
        if (result.success) {
            res.json({ success: true, message: result.message });
        } else {
            res.status(404).json({ success: false, message: result.message });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// Supprimer un projecteur
export async function removeProjector(req, res) {
    try {
        const { id } = req.params;
        const result = await deleteProjector(id);
        if (result.success) {
            res.json({ success: true, message: result.message });
        } else {
            res.status(404).json({ success: false, message: result.message });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}