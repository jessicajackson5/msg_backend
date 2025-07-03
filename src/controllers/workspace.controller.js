import { AVAILABLE_ROLES_WORKSPACE_MEMBERS } from "../dictionaries/availableRoles.dictionary.js"
import workspace_members_repository from "../repositories/workspaceMembers.repository.js"
import workspaces_repository from "../repositories/workspaces.repository.js"

//Garbage storage?
//We do not need to manipulate memory, JS does it for us. 
//A variable is assigned automatically to memory
//An unused variable is removed from memory

class WorkspaceController {
    async create(request, response){
        try{
            const {name, description} = request.body
            const {id} = request.user // ID of the user that made the request

            const workspace_created = await workspaces_repository.create({name, description, owner_id: id})
            await workspace_members_repository.create({
                workspace_id: workspace_created._id,
                user_id: id,
                role: AVAILABLE_ROLES_WORKSPACE_MEMBERS.ADMIN
            })
            response.status(201).json(
                {
                    ok: true, 
                    message:'Workspace created successfully',
                    status: 201,
                    data: {}
                }
            )
        }
        catch(error){
            
            if(error.status){ 
                response.status(error.status).json(
                    {
                        message: error.message, 
                        status: error.status,
                        ok: false
                    }
                )
                return 
            }
            else{
                console.log('There was an error', error)
                response.status(500).json(
                    {
                        message: 'Internal server error', 
                        ok: false
                    }
                )
            }
        }
    }
    async delete(request, response) {
        try {
            const workspace_id = request.params.workspace_id
            const user_id = request.user.id
            await workspaces_repository.deleteWorkspaceFromOwner(user_id, workspace_id)

            response.status(200).json(
                {
                    ok: true,
                    message: 'Workspace deleted successfully',
                    status: 200,
                    data: {}
                }
            )
            return
        } catch (error) {

            if (error.status) {
                response.status(error.status).send(
                    {
                        message: error.message,
                        status: error.status,
                        ok: false
                    }
                )
                return
            } else {
                console.error('There was an error', error)
                response.status(500).json(
                    {
                        message: 'Internal server error',
                        ok: false
                    }
                )
            }
        };
    }

    async getAllbyMember (request, response){
        const {id} = request.user
        //Get a list of all the workspaces a member belongs to
        const workspaces = await workspace_members_repository.getAllbyUserID(id)
        response.json({
            ok: true, 
            status: 200,
            message:'List of workspaces',
            data: {
                workspaces: workspaces
            }
        })
    }
}

const workspace_controller = new WorkspaceController
export default workspace_controller