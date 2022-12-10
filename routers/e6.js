let express = require('express');
let fetch = require('node-fetch');
let request = require('request');
let config = require("../config/e621/data.json");

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

let data9 = {
    method: "GET",
    headers: {
        "User-Agent": "karinaTwo/4.0.2 (by jonny9075549t2)",
        Authorization: auth(process.env.USER, process.env.PASS)
    }
}

e6_app.post("/posts", async(req, res, next) => {
    let _body = {
        tags: req.body.tags/*.trim().split(/ +/g)/*,
        limit: req.body.limit,
        page: req.body.page*/
    }

    let url = maker_url(_body.tags/*, _body.limit, _body.page*/);

    let result = await fetch(url, data9);

    console.log(await result)
    res.send({
        success: true,
        ...(await result.json())
    });
})

e6_app.get("/image/:id", async(req, res, next) => {
    let data = await fetch(maker_url([`id:${req.params.id}`]), data9);
    let { posts } = await data.json();

    let url_final

    if(!posts.length) {
        url_final = {
            success: false,
            status: "???",
            message: "no post"
        }
    } else {
        url_final = {
            success: true,
            status: 200,
            message: "ok",
            files: {
                url: `https://${req.get('host')}/api/e621/static/file/${posts[0].id}`,
                width: posts[0].file.width,
                height: posts[0].file.height,
                size: posts[0].file.size
            }
        }
    }
    
    res.send(url_final)
})

e6_app.get("/static/file/:id", async(req, res, next) => {
    let data = await fetch(maker_url([`id:${req.params.id}`]), data9);
    let { posts } = await data.json();

    let url = posts[0].file.url
    //console.log(req.get('host'));
  request({
    url: url,
    encoding: null
  }, 
  (err, resp, buffer) => {
    if (!err && resp.statusCode === 200){
      res.set("Content-Type", resp.headers['content-type']);
      res.send(resp.body);
    }
  });
})

module.exports = e6_app