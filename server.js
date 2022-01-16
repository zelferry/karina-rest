const express = require('express');
const app = express();
const http = require('http');


const ops = { method: 'GET', headers: { 'User-Agent': 'crosdid/1.0' } };
const fetch = require('node-fetch');
let e6_config = {
	pach: "https://e621.net/",
	pach1:"https://e926.net/"
};

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

async function getposts(pos, limit, page) {
		//if (pos && !Array.isArray(pos)) pos = pos.split(' ');

		if (pos && pos.length > 40)
			throw new TypeError('You may only supply up to 40 tags.');

		if (limit && limit > 320)
			throw new TypeError('You may only request up to 320 posts at a time.');

		let e621 = e6_config.pach;
		let a = `${pos ? `tags=${pos.join('+')}` : ''}${
			limit ? `&limit=${limit}` : ''
		}${page ? `&page=${page}` : ''}`;

		let result = e621 + 'posts.json?' + a;
  console.log(result)
		let vc = await fetch(result,ops);
		return vc.json()
	}

app.use("/api/nekos", require("./routers/nekos.js"))

app.all("/", (req,res,next) => {
    res.send({
        error: "rota alterada para <Url>/api",
        send: false,
        status: "???"
    });
})


app.get("/api", (req, res, next) => {
    let json1 = JSON.stringify(require("./files_json/api_info.json"))
    res.send(json1)
})

app.get("/api/e6/:tags?", async(req, res, next)=>{
    var pos = (req.query.tags).trim().split(/ +/g);
    //f (pos && !Array.isArray(pos)) pos = pos.split(' ');
    console.log(pos);
    let json = await getposts(pos)
    res.send(json)
})

app.get("/ping", (req,res) => {
    console.log(`[ ${Date.now()} ] ping recebido`)
    res.sendStatus(200)
})

app.use(function(err, req, res, next){
  res.status(err.status || 500);
    
  res.send({
      error: err.message,
      send: false,
      status: (err.status || 500)
  });
});

app.use(function(req, res){
  res.status(404);
  res.send({ 
      error: "Sorry, can't find that",
      send: false,
      status: 404
  })
});

app.listen(3000, () => {
  console.log('servidor iniciado');
});
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/ping`);
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000); 