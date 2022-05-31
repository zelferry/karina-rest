let express = require('express');
let app = express();
let http = require('http');
let bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api/nekos", require("./routers/nekos.js"))
 

const ops = { method: 'GET', headers: { 'User-Agent': 'crosdid/1.0' } };
const fetch = require('node-fetch');

let e6_config = {
	pach: "https://e621.net/",
	pach1:"https://e926.net/"
};

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
});

app.post("/api/fetch/", async(req, res, next)=>{
    var pos = req.body.urls//.trim().split(/ +/g);
    //f (pos && !Array.isArray(pos)) pos = pos.split(' ');
    console.log(pos);
    //let json = await fetch(pos, ops);
    res.send(".")
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

app.listen(80, () => {
  console.log('servidor iniciado');
});
setInterval(() => {
    fetch(`http://${process.env.PROJECT_DOMAIN}.glitch.me/ping`);
    fetch(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 28000); 
