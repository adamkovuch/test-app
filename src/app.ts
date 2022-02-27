import express from "express";
import bodyParser from "body-parser";
import { Stats } from "./stats";
import { Attacker } from "./attacker";

// Create Express server
const app = express();
const stats = new Stats();
const attacker = new Attacker(stats);

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    if(stats.isRun) {
        res.status(200).send({
            target: stats.target,
            success: stats.success,
            errors: stats.errors,
            loop: stats.loop
        });
    } else {
        res.status(200).send(null);
    }
});

app.post('/attack', (req, res) => {
    if(!req.body.target) {
        res.sendStatus(400);
        return;
    }
    attacker.run(req.body.target, req.body.concurrency || 100, req.body.interval || 1000);
    res.sendStatus(201);
});

app.delete('/attack', (req, res) => {
    attacker.stop();
    res.sendStatus(200);
});

export default app;
