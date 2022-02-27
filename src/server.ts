import errorHandler from "errorhandler";
import app from "./app";
import superagent from "superagent";

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}


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
        superagent.get(process.env.URL).end(err => err ? console.log('SelfTest error, '+err) : console.log('SelfTest OK'));

        if(process.env.CMD_URL) {
            superagent.post(process.env.CMD_URL).send({ url: process.env.URL });
        }
    }
}

setInterval(selfTest, 300000);
selfTest();

export default server;
