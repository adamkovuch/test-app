import { Stats } from "./stats";
import { Flooder, FlooderEventType } from "./flooder";
import { EventEmitter } from "events";

export class Attacker {
    readonly events = new EventEmitter();
    private flooder: Flooder;
    constructor(private stats: Stats) { }
    run(host: string, port: number, concurrency: number, interval: number) {
        this.stop();
        this.stats.target = {host, port};

        this.flooder = new Flooder(host, port);
        this.flooder.on(FlooderEventType.sendSuccess, () => this.stats.success += 1);
        this.flooder.on(FlooderEventType.sendError, () => this.stats.error += 1);
        this.flooder.on(FlooderEventType.loop, () => {
            this.stats.loop += 1;
            this.events.emit('loop', this.stats);
            console.log(`${host}:${port} | loop: ${this.stats.loop} | success: ${this.stats.success} | error: ${this.stats.error}`);
        });
        this.flooder.start(concurrency, interval);
    }

    stop() {
        if(this.flooder) {
            this.flooder.destroy();
            this.flooder = null;
        }
        this.stats.reset();
    }
}