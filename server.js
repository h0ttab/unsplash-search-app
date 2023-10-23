const http = require('http');
const url = require('url')
const port = 3000;
const host = '89.191.229.4';
const API_KEY = '9gjvoXWa0NBklahjBs3QbNGnDsn7NnAUg6bqWktidPg';
const axios = require('axios');


const server = http.createServer((req, res)=>{

    let reqParams = url.parse(req.url, true).query;

    if (reqParams.query && reqParams.page) {

    (async function (){
        const {data} = await axios.get(`https://api.unsplash.com/search/photos/`, {
        params : {
            query: `${reqParams.query}`,
            page: reqParams.page ?? 1,
            per_page: 12,
        },
        headers : {
            "Authorization": `Client-ID ${API_KEY}`,
        }})
        
        res.writeHead(200, {
            'Content-type': 'application/json',
	        "Access-Control-Allow-Origin": "*",
        })
        res.end(JSON.stringify(data))
    })();
    } else {
        res.writeHead(200, {
            'Content-type': 'text/plain',
	    "Access-Control-Allow-Origin": "*",
        })
        res.end('Hello world!')
    }
}).listen(port, host, () =>{
    console.log(`Server is running on ${host}:${port}`);
})