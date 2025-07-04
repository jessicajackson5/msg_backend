import channel_messages_service from "../services/channelMessages.service.js"

class MessagesController {
    async create(request, response){
        try{
            const messages_list = await channel_messages_service.create({
                user_id: request.user.id, 
                channel_id: request.channel._id, 
                content: request.body.content
            })
            response.json({
                ok: true,
                status: 201,
                data: {
                    messages: messages_list
                },
                message: 'Message created successfully'
            })

        }
        catch(error){
            if(error.status){ 
                response.status(error.status).send(
                    {
                        message: error.message, 
                        ok: false
                    }
                )
                return 
            }
            else{
                console.log('There was an error', error)
                response.status(500).send({message: 'Internal server error', ok: false})
            }
        }

    }

    async getAllbyChannel(request, response){
        try{
            const {channel_id} = request.params
            const messages_list = await channel_messages_service.getAllbyChannelId({channel_id: channel_id})

            response.json({
                ok: true,
                status: 200,
                message: 'Messages obtained successfully',
                messages: messages_list
            })
        }
        catch(error){
            if(error.status){ 
                response.status(error.status).send(
                    {
                        message: error.message, 
                        ok: false
                    }
                )
                return 
            }
            else{
                console.log('There was an error', error)
                response.status(500).send({message: 'Internal server error', ok: false})
            }
        }
    }
}

const messages_controller = new MessagesController()
export default messages_controller
