import { Stats } from "./stats";
import { EventEmitter } from "events";
import { httpRequest } from "./http-request";

export class Attacker {
    readonly events = new EventEmitter();
    private intervalHandle: NodeJS.Timeout;
    private capacityUsed: number = 0;
    constructor(private stats: Stats) { }
    async run(host: string, port: number, capacity: number, interval: number) {
        this.stop();
        this.stats.target = {host, port};

        this.intervalHandle = setInterval(async () => {
            if(this.capacityUsed > capacity) {
                console.log(`${host}:${port} | skipped | capacity limit`);
                return;
            }
            try {
                console.log(`${host}:${port} | loop: ${this.stats.loop} | success: ${this.stats.success} | error: ${this.stats.error}`);
                this.capacityUsed += 1;
                this.stats.loop += 1;
                this.events.emit('loop', this.stats);
                let r: any = await httpRequest(host, port);
                
                if(r.res.statusCode >= 200 && r.res.statusCode < 300) {
                    this.stats.success += 1;
                } else {
                    this.stats.error += 1;
                }
                r = null;
            } catch (error) {
                this.stats.error += 1;
            } finally {
                this.capacityUsed -= 1;
            }
        }, interval);
        

        /*this.flooder = new Flooder(host, port);
        this.flooder.on(FlooderEventType.sendSuccess, () => this.stats.success += 1);
        this.flooder.on(FlooderEventType.sendError, () => this.stats.error += 1);
        this.flooder.on(FlooderEventType.loop, () => {
            this.stats.loop += 1;
            this.events.emit('loop', this.stats);
            console.log(`${host}:${port} | loop: ${this.stats.loop} | success: ${this.stats.success} | error: ${this.stats.error}`);
        });
        this.flooder.start(concurrency, interval);*/
    }

    stop() {
        if(this.intervalHandle) {
            clearInterval(this.intervalHandle);
        }
        this.stats.reset();
    }
}