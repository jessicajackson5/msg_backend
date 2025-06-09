import Workspaces from "../models/Workspace.model.js";
class WorkspacesRepository {
    /**
     * Crea un nuevo workspace en la base de datos.
     * 
     * @param {Object} data - Un objeto con los datos del workspace a crear.
     * @param {string} data.name - El nombre del workspace.
     * @param {string} data.owner_id - El id del usuario propietario del workspace.
     * @param {string} [data.description] - La descripcion del workspace.
     * @param {Date} [data.created_at] - La fecha de creacion del workspace.
     */
    /**
     * Este metodo crea un workspace
     */
    async create({ name, owner_id, description, created_at }) {
        try{
            const workspace = new Workspaces({
                name,
                owner_id,
                description,
                created_at,
            });
            await workspace.save();
            console.log("Workspace creado exitosamente!");
        }
        catch(error){
            console.error("An error occurred");
        }
    
    }
}
const workspaces_repository = new WorkspacesRepository();
export default workspaces_repository;