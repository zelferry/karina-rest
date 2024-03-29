let express = require('express');
let fetch = require('node-fetch');
let request = require('request');
let config = require("../config/e926/data.json");
let e6_app = express.Router();

let maker_url = (pos, page, limit) => {
    let url = config.base_url;
    let base = config.endpoint.posts;
    
    let body = `${pos ? `tags=${encodeURI(pos.join('+'))}` : ''}`;
    
    return `${url}${base ? `${base}?${body}` : base}`
}

function auth(user, pass) {
    let buff = new Buffer.from(`${user}:${pass}`);
    let b64 = buff.toString('base64');
    return `Basic ${b64}`;
}

let header = {
    method: "GET",
    headers: {
        "User-Agent": "karinaTwo/4.0.2 (by jonny9075549t2)",
        Authorization: auth(process.env.E6_USER, process.env.E6_PASS)
    }
}

e6_app.post("/posts", async(req, res, next) => {
    let url = maker_url(req.body.tags);
    let result = await fetch(url, header);
    
    let data
    if(!result.ok){
        data = {
            ok: false,
            status: result.status,
            statusText: result.statusText,
            data: {}
        }
    } else {
        data = {
            ok: true,
            status: result.status,
            statusText: result.statusText,
            data: await result.json()
        }
    }
    
    res.send(data);
});

e6_app.post("/autocomplete", async(req, res, next) => {
    let chunks = (req.body.tags).split(' ');
    let search = chunks.pop();
    
    let q = new URLSearchParams({
        'search[name_matches]': search,
        expiry: '7'
    });
    let result = await fetch(`https://e926.net/tags/autocomplete.json?${q.toString()}`, header);
    
    let data
    if(!result.ok){
        data = {
            ok: false,
            status: result.status,
            statusText: result.statusText,
            data: {}
        }
    } else {
        let json_ = await result.json()
        data = {
            ok: true,
            status: result.status,
            statusText: result.statusText,
            data: json_.map((x) => Object({ name: `${chunks.join(' ')} ${x.name}`.trim(), value: `${chunks.join(' ')} ${x.name}`.trim() }))
        }
    }
    //https://e621.net/tags/autocomplete.json?search[name_matches]=webm+meesh
    res.send(data);
});

e6_app.get("/image/:id", async(req, res, next) => {
    let result = await fetch(maker_url([`id:${req.params.id}`]), header);

    let data
    if(!result.ok){
        data = {
            ok: false,
            status: result.status,
            statusText: result.statusText,
            data: {}
        }
    } else {
        let { posts } = await result.json();
        if(posts.length == 0){
            data = {
                ok: false,
                status: 404,
                statusText: "no post",
                data: {}
            }
        } else {
            data = {
                ok: true,
                status: 200,
                statusText: result.statusText,
                data: {
                    url: `https://${req.get('host')}/api/e926/static/file/${posts[0].id}`,
                    width: posts[0].file.width,
                    height: posts[0].file.height,
                    size: posts[0].file.size
                }
            }
        }
    }
    
    res.send(data)
})

e6_app.get("/static/file/:id", async(req, res, next) => {
    let data = await fetch(maker_url([`id:${req.params.id}`]), header);

    if(!data.ok){
        request({ url: `https://http.cat/${data.status}`, encoding: null }, (err, resp, buffer) => {
            res.set("Content-Type", resp.headers['content-type']);
            res.send(resp.body);
        });
    } else if((await data.json().posts).length == 0){
        request({ url: "https://http.cat/404", encoding: null }, (err, resp, buffer) => {
            if (!err && resp.statusCode === 200){
                res.set("Content-Type", resp.headers['content-type']);
                res.send(resp.body);
            }
        });
    } else {
        let { posts } = await data.json();
        let url = posts[0].file.url;

        request({ url: url, encoding: null }, (err, resp, buffer) => {
            if (!err && resp.statusCode === 200){
                res.set("Content-Type", resp.headers['content-type']);
                res.send(resp.body);
            }
        });
    }
});

module.exports = e6_app
//await data.json()