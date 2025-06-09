import workspaces_repository from "../repositories/workspace.repository"

class WorkspaceController {
    async create(request, response){
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
}

const workspace_controller = new workspace_controller
export default workspace_controller