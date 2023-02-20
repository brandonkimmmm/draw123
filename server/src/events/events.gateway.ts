import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class EventsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger: Logger = new Logger(EventsGateway.name);

    @WebSocketServer() wss: Server;

    afterInit(server: Server) {
        this.logger.log('Socket.io listening');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client Connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client Disco nnected: ${client.id}`);
    }

    @SubscribeMessage('messages')
    findAll(client: Socket, payload: string) {
        console.log(client.rooms);
        this.wss.emit('message', payload);
    }
}
