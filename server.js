let express = require('express');
let app = express();
let http = require('http');
let bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api/nekos", require("./routers/nekos.js"));
app.use("/api/e621", require("./routers/e6.js"));
app.use("/api/ai", require("./routers/ai.js"));
 
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

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}
    
app.listen(normalizePort(process.env.PORT || '3002'), () => {
  console.log('servidor iniciado');
});

module.exports = app;