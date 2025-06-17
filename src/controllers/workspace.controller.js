import { AVAILABLE_ROLES_WORKSPACE_MEMBERS } from "../dictionaries/availableRoles.dictionary.js"
import workspaces_repository from "../repositories/workspace.repository.js"
import WorkspaceMembers from "../repositories/workspaceMembers.repository.js"

class WorkspaceController {
    async create(request, response){
        try{
            const {name, description} = request.body
            const {id} = request.user  // This is the id of the user that made the request from auth middleware
            const workspace_created = await workspaces_repository.create({name, description, owner_id: id})
            await members_workspace_repository.create({
                workspace_id: workspace_created.id,
                user_id: id,
                role: AVAILABLE_ROLES_WORKSPACE_MEMBERS.ADMIN
            })
    
            response.status(201).json(
                {
                    message: "Workspace created successfully",
                    status: 201,
                    data: {}
                }
            )
            // TO DO - set the role of the member that created the workspace to be the owner? 
        }
        catch(error){
            
            if(error.status){ 
                response.status(error.status).send(
                    {
                        message: error.message, 
                        status: error.status,
                        ok: false
                    }
                )
                return 
            }
            else{
                console.log('Hubo un error', error)
                response.status(500).send({message: 'Error interno del servidor', ok: false})
            }
        }
    }
    // GET ALL WORKSPACES: Get the list of workspace that the user belongs to
    // User can be the owner, co-owner or member
    async getAll(request, response){
        try{
            const {name, description} = request.body
            const {id} = request.user  // This is the id of the user that made the request
            await workspaces_repository.create({name, description})
            response.status(201).send(
                {
                    message: "Workspace created successfully",
                    status: 201,
                    data: {}
                }
            )
        }
        catch(error){
            
            if(error.status){ 
                response.status(error.status).send(
                    {
                        message: error.message, 
                        status: error.status,
                        ok: false
                    }
                )
                return 
            }
            else{
                console.log('Hubo un error', error)
                response.status(500).send({message: 'Error interno del servidor', ok: false})
            }
        }
    }
    async getWorkspaceMembers(request, response){}
    async delete(request, response){
        const { workspace_id } = request.params;
        const {id} = request.user  // This is the id of the user that made the request from auth middleware

        const hasPermission = await workspaceMembersRepository.hasAdminAccess({ workspace_id, user_id });
        //hasAdminAccess also checks for membership
        if (!hasPermission) {
            throw { status: 403, message: 'No tenés permiso para realizar esta acción' };
        }
    }
}

const workspace_controller = new WorkspaceController
export default workspace_controller