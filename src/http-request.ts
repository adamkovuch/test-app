import * as https from "https";

export function httpRequest(url: string, port: number, timeout?: number) {
    return new Promise(async (resolve, reject) => {
        const options: https.RequestOptions = {
            hostname: url,
            port: port,
            method: 'GET',
            timeout: timeout || 3000,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache',
            }
        };
        // Sending the request
        let req = https.request(options, (res) => {
            // Ending the response 
            req.removeAllListeners();
            req.socket.removeAllListeners();
            req.socket.destroy();
            req.destroy();
            req = null;
            resolve({res});
        }).on("error", (err) => {
            reject(err);
        }).end();
    });
}