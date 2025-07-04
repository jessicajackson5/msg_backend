import { AVAILABLE_ROLES_WORKSPACE_MEMBERS } from "../dictionaries/availableRoles.dictionary.js"
import workspace_members_repository from "../repositories/workspaceMembers.repository.js"
import userRepository from "../repositories/users.repository.js"
import workspaces_repository from "../repositories/workspaces.repository.js"

class WorkspaceMembersController {
    async add(request, response) {
        try {
            //Add a new member
            //1:Save the ID who is making the request
            const { id } = request.user

            //2:Save el workspace_id
            const { workspace_id } = request.params

            //3:Save the user role
            //Here you have to chose the business logic
            //Option 1: Client choose the role to assign to the user
            //Option 2: Automatically assign the role
            
            //4: Get the mail of who you're adding
            
            const { role, email } = request.body

            if(
                !Object.values(AVAILABLE_ROLES_WORKSPACE_MEMBERS).includes(role)
            ){
                throw{
                    status: 400,
                    message: 'Invalid role'
                }
            }

            const user_found = await userRepository.findByEmail({email})

            if(!user_found ){
                throw {status: 404, message: 'Usar not found'}
            }

            // Check if the member already exists, and do not add them again
            const members = await workspace_members_repository.getAllbyWorkspaceID(workspace_id)

            if(members.find(member => {
                return member.user_id.equals(user_found._id)
            })){
                throw {
                    message: 'The user is already a member of this workspace', 
                    status: 400
                }
            }

            
            //Problema: Cualquiera puede agregar miembro, esto solo deberia poder hacerlo el dueño del workspace
            //Solucion: Buscar el workspace por id y checkear que el owner_id coincida con el id del usuario que hace la consulta

            const workspace_found = await workspaces_repository.getById(workspace_id)
            if(!workspace_found){
                throw {
                    status: 404, 
                    message: 'Workspace does not exist'
                }
            }

            if(!workspace_found.owner_id.equals(id)){
                throw {
                    status: 403,
                    message: 'You cannot take this action as you are not the workspace owner'
                }
            }

            await workspace_members_repository.create({
                user_id: user_found._id,
                workspace_id: workspace_id,
                role: role
            })

            response.status(201).json(
                {
                    ok: true,
                    status: 201,
                    message: 'Member successfully added',
                    data: {}
                }
            )
        }
        catch (error) {
            if (error.status) {
                response.status(error.status).json(
                    {
                        message: error.message,
                        status: error.status,
                        ok: false
                    }
                )
                return
            }
            else {
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
}

const workspace_members_controller = new WorkspaceMembersController()
export default workspace_members_controller