Create the class ChannelRepository that has an async methold (async await) that calls create and will receive the ID of the workspace and name of the channel as parameters and saves it in the channel collection that 

I need you to create a class called ChannelService that has an asynchronous method called createChannel that will receive the workspace Id, validate that exists or throws a status 404 with message "Workspace not found." It waill receive the name of the channel as paraemters and will initiate the create method of ChannelRepository to create teh channel

New session
@channel.services.js @channel.repository.js                                                            
I need to create a method in ChannelRepository that calls findByName that receives the name of the channel and workspace ID as parameters, and is going to look in the channel collection and return  the channel

@channel.repository.js   @channel.service.js                            
Improve the create method in the ChannelService so that it complies with the validation of the name (a string with < 12 characers and that it is not a repeated name) to ensure that the channel if the name exists we use findByName in the ChannelRepository to find the channel and return it

Create middleware called workspaceMiddleware that validates if the workspace exist for 'workspace_id' by calling findById in WorkspaceRepository and if it doesn't exist throw a 404 status "Workspace not found". If you find it validate the client (found in request.user)is a member of the workspace or throw a 403 status "You are not a member of this workspace."