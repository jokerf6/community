import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaService } from './prisma.services';
@WebSocketGateway(3001, { cors: '*' })
export class chatGetway {
  constructor(private readonly prisma: PrismaService) {}
  @WebSocketServer()
  server;
  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() message: string): void {
    console.log(` running`);
    console.log(message);
    this.server.emit('receive_message', message);
  }

  @SubscribeMessage('Connect')
  async connect(@MessageBody() userId: string) {
    console.log(`join ${userId}`);
    await this.prisma.user.update({
      data: {
        online: true,
      },
      where: {
        id: userId,
      },
    });
  }
  @SubscribeMessage('disConnect')
  async disConnect(@MessageBody() userId: string) {
    console.log(`leave ${userId}`);

    await this.prisma.user.update({
      data: {
        online: false,
      },
      where: {
        id: userId,
      },
    });
  }
}
