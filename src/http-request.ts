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
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
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
        }).on('timeout', () => {
            reject('Timeout error');
        }).end();

        
    });
}