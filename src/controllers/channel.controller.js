import channel_service from "../services/channel.service.js";

class ChannelController {
    async create(request, response) {
        try {
            const { workspace_id } = request.params
            const { name } = request.body
            const { channels } = await channel_service.create(workspace_id, name)
            response
                .status(201)
                .json(
                    {
                        ok: true,
                        message: 'Channel created successfully',
                        status: 201,
                        data: { 
                            channels 
                        }
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
            }
            else {
                console.error('There was an error', error)
                response.status(500).json(
                    {
                        message: error.message,
                        status: 500,
                        ok: false
                    }
                )
            }
        }

    }
    async getAllByWorkspaceId (request, response){
        try{
            const { workspace_id } = request.params
            const channels = await channel_service.getAllByWorkspaceId(workspace_id)
            response.status(200).json(
                {
                    ok: true,
                    message: 'Channels obtained successfully',
                    status: 200,
                    data: { 
                        channels 
                    }
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
            }
            else {
                console.error('There was an error', error)
                response.status(500).json(
                    {
                        message: error.message,
                        status: 500,
                        ok: false
                    }
                )
            }
        }

    }
}

const channel_controller = new ChannelController()
export default channel_controller