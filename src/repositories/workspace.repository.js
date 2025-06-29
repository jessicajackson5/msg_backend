import Workspaces from "../models/Workspace.model.js";
class WorkspacesRepository {
    async create({ name, owner_id, description }) {

            const workspace = new Workspaces({
                name,
                owner_id,
                description,
            })
            await workspace.save()
            return workspace
        }
        catch(error){
            console.error("An error occurred");
        }
    async deleteWorkspaceFromOwner (owner_id, workspace_id) {
        //Eliminar el workspace solo si el 
        const result = await Workspaces.findOneAndDelete({owner_id, _id: workspace_id})
        console.log(result)
        // If it returns null the workspace was not eliminated            
        if(!result){
            throw {status: 404, message: 'El workspace a eliminar no existe'}
        }
    }
    async deleteById(workspace_id){
        return await Workspaces.findOneAndDelete({_id: workspace_id})
    }
    async getById (workspace_id){
        return await Workspaces.findById(workspace_id)
    }
}

const workspaces_repository = new WorkspacesRepository();
export default workspaces_repository;