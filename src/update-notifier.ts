import { Server } from "ws";
import { EventEmitter } from "events";

type UpdateNotifierEventType = 'receive' | 'connect';
export class UpdateNotifier {
    private eventEmmiter = new EventEmitter();
    private readonly socket: Server;
    constructor(server: any) {
        this.socket = new Server({ server }, () => {
            console.log('Socket created');
        });

        this.socket.on('connection', (ws) => {
            console.log('Client connected');
            ws.on('close', () => {
                console.log('Client disconnected');
            });

            ws.on('message', (data) => {
                this.eventEmmiter.emit('receive', data);
            });
        });

        this.socket.on('connection', (data: any) => this.eventEmmiter.emit('connect', data));
    }

    send(data: any) {
        this.socket.clients.forEach((client) => {
            client.send(JSON.stringify(data));
        });
    }

    on(event: UpdateNotifierEventType, cb: (data: {cmd: string, data: any}) => void) {
        this.eventEmmiter.on(event, (data) => data ? cb(JSON.parse(data)): cb(null));
    }
    once(event: UpdateNotifierEventType, cb: (data: {cmd: string, data: any}) => void) {
        this.eventEmmiter.once(event, (data) => data ? cb(JSON.parse(data)): cb(null));
    }

    off(event: UpdateNotifierEventType, cb: (data: {cmd: string, data: any}) => void) {
        this.eventEmmiter.off(event, (data) => data ? cb(JSON.parse(data)): cb(null));
    }
}