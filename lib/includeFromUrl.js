/**
 *  Exports:  includeFromUrl
 *  
 */
const {isURL} = require('./path-utils');


/**
 * [includeFromUrl description]
 * @param  {string} url      [description]
 * @param  {IncludeManager} override [description]
 * @return {string|undefined}          [description]
 */
function includeFromUrl(url/*, override*/) {
    //console.log("get URL ", url);

    return new Promise((resolve, reject) => {
        const http      = require('http'),
              https     = require('https');
        let client = http;
        if (url.toString().indexOf("https") === 0) {
            client = https;
        }
        client.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                //console.log("URL", url, data);
                //resolve(shouldInclude(data, url, override));
                resolve(data);
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
}


module.exports = includeFromUrl;