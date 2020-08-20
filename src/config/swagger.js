
require('dotenv').config();
var sw = {
    "swagger": "2.0",
    "info": {
        "description": "Typescript Express Postgres",
        "version": "1.0.0",
        "title": "POC for Makeen Tech"
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }      
    },
    "host": process.env.SWAGGER_HOST || '127.0.0.1:3000',
    "basePath": "/",
    "schemes": [
        "http","https"
    ],      
    "paths": {}
}

swaggerPaths = config => {
    apiConfig(config, (p)=>{
        let res = sw.paths[p.api];        
        if (!res) { res = {}; }
        res[p.method] = { 
            summary: p.summary, 
            tags: [p.tags], 
            produces: ["application/json"], 
            responses: {}            
        };
        // console.log(p.tags.toLowerCase());
        
        if(p.tags.toLowerCase() != "auth") {
            res[p.method]["security"] = [{ 
                "Bearer": [] 
            }];
        }
        if (p.parameters) { res[p.method].parameters = p.parameters; }
        if (p.items) { res[p.method].items = p.items; }
        
        sw.paths[p.api] = res;

        // console.log(sw);
    });
    

    

    // console.log(JSON.stringify(sw));
    // fs.writeFile("output.json", JSON.stringify(sw), 'utf8', function (err) {
    //     if (err) {
    //         console.log("An error occured while writing JSON Object to File.");
    //         return console.log(err);
    //     }     
    //     console.log("JSON file has been saved.");
    // });   
}

apiConfig = (config, callback) => {
    let params = { "api": "", "method": "post", "summary": "", "tags": "", "parameters": [] };
    if(typeof(config) == 'object') {
        for(c in config) {
            // console.log(c);
            if(Array.isArray(config[c])) {
                config[c].forEach(prm=>{
                    if(typeof(prm) == 'object') {
                        params.parameters.push(prm);
                    } else if(!Array.isArray(prm)) {
                        let obj = { name: prm, type: "string", in: "formData" };
                        params.parameters.push(obj);
                    }
                })
            }else{
                let caseSmall = ["method"];
                params[c] = config[c];
                if(caseSmall.includes(c)){
                    params[c] = params[c].toLowerCase();
                }
            }
            
        }
    }
    callback(params);
}
module.exports = {
    sw: sw,
    swagger: swaggerPaths
}
