import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(3001, { cors: '*' })
export class chatGetway {
  @WebSocketServer()
  server;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message, string): void {
    console.log('running');
    console.log(message);
    this.server.emit('message', message);
  }
}
