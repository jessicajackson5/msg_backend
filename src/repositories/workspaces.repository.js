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
     async deleteWorkspaceFromOwner (owner_id, workspace_id) {

        //Only delete the workspace if the owner_idis the received as a parameter
        const result = await Workspaces.findOneAndDelete({owner_id, _id: workspace_id})
        //If the result is null, the workspace was not eliminated
        if(!result){
            throw {status: 404, message: 'The workspace was not found'}
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