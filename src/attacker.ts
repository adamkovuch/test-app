import { Stats } from "./stats";
import { Flooder, FlooderEventType } from "./flooder";

export class Attacker {
    private flooder: Flooder;
    constructor(private stats: Stats) { }
    run(target: string, port: number, concurrency: number, interval: number) {
        this.stop();
        this.stats.target = target;

        this.flooder = new Flooder(target, port);
        this.flooder.on(FlooderEventType.sendSuccess, () => this.stats.success += 1);
        this.flooder.on(FlooderEventType.sendError, () => this.stats.error += 1);
        this.flooder.on(FlooderEventType.loop, () => {
            this.stats.loop += 1;
            console.log(`${target}:${port} | loop: ${this.stats.loop} | success: ${this.stats.success} | error: ${this.stats.error}`);
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