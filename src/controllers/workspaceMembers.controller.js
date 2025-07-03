import { AVAILABLE_ROLES_WORKSPACE_MEMBERS } from "../dictionaries/availableRoles.dictionary.js"
import workspaces_repository from "../repositories/workspace.repository.js"
import usersRouter from "../routes/users.router.js"

class workspaceMembersController {
    async add(request,response){
        try {
            const { id } = request.user
            const { workspace_id } = request.params
            const { role, email } = request.body
            const user_found = await usersRepository.findByEmail({email})
            if(!user_found){
                throw {
                    status: 404, 
                    message: "User not found"
                }
            }
            // Ensure the member is not already in the workspace (avoid duplicates)
            const members = await members_workspace_repository.getAllbyWorkspaceID(workspace_id)
            if(members.find(member => member._id===user_found._id)){
                throw {
                    status: 400,
                    message: 'The user is already a member of this workspace'
                }
            }

            if(Object.values(AVAILABLE_ROLES_WORKSPACE_MEMBERS).includes(role)){
                throw {
                    status: 400,
                    messsage: "Invalid role"
                }
            }
            const workspace_found = await workspaces_repository.getById(workspace_id)
            if(!workspace_found) {
                throw {
                    status: 404,
                    message: "Workspace not found"
                }
            }
            if(workspace_found.owner_id !== id){
                throw{
                    status: 403,
                    message: "You don't have permission as you are not the owner"
                }
            }
         
            await members_workspace_repository.create({
                user_id: id,
                workspace_id: workspace_id,
                role: role
            })
            response.status(201).json(
                {
                    ok: true,
                    status: 201,
                    message: 'Member added successfully',
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
                console.log('There was an error', error)
                response.status(500).send({message: 'Internal sever error', ok: false})
            }
        }
    }
}
const members_workspace_controller = new workspaceMembersController()
export default members_workspace_controller