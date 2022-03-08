import errorHandler from "errorhandler";
import app from "./app";
import request from "request";

/**
 * Error Handler. Provides full stack
 */
app.use(errorHandler());


/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});


const selfTest = () => {
    if(process.env.URL) {
        const req = request.get({url: process.env.URL}, (err) => {
            err ? console.log('SelfTest error, '+err) : console.log('SelfTest OK');
            req.destroy();
        });
    }
}

setInterval(selfTest, 300000);

selfTest();

export default server;
