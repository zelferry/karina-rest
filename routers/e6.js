let express = require('express');
let fetch = require('node-fetch');
let request = require('request');
let config = require("../config/e621/data.json");

let e6_app = express.Router();

let maker_url = (pos, page, limit) => {
    let url = config.base_url;
    let base = config.endpoint.posts;
    
    let body = `${pos ? `tags=${pos.join('+')}` : ''}`;
    
    return `${url}${base ? `${base}?${body}` : base}`
}

let request_url = (_tags) => {
    let base2

    if(process.env.REPLIT_ENVIRONMENT){
        base2 = `${require("../config/client/endpoint_test.json")}/api/e6?tags=${_tags.join('+')}`
    } else {
        base2 = maker_url(_tags)
    }

    return base2
}

e6_app.post("/posts", async(req, res, next) => {
    let _body = {
        tags: req.body.tags/*.trim().split(/ +/g)/*,
        limit: req.body.limit,
        page: req.body.page*/
    }

    let url = request_url(_body.tags/*, _body.limit, _body.page*/);

    let result = await fetch(url, config.fetch_data);

    //console.log(await result.json())
    res.send({
        success: true,
        ...(await result.json())
    });
})

e6_app.get("/static/file", async(req, res, next) => {
    const url = 'https://static1.e621.net/data/3c/e9/3ce97aecf30e3cf4b2338457d53218be.jpg';

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