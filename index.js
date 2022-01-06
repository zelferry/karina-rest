const express = require('express');
const app = express();

var yiff = require("yiff_api")
let y = new yiff.e621()

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}
/*
app.use('/api', function(req, res, next){
  var key = req.query['api-key'];

  if (!key) return next(error(400, 'api key required'));

  if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

  req.key = key;
  next();
});*/
var apiKeys = ["1754b0397100b9b08602c17bacea2862853c6b5395da94ce185e7ba3f19021acbbe702b700ae3d21c0c57820ddfbd28bcdd659eba1eddfe8d82cdbf517f214c2b632c3d9ee8ab2e28068126401104c368a653a174a489495a77b12878dbb268eeb0f7622cde15534d4814f8ee085f9c063973ff43f53c16eee4326036e9bf10c03a6426c520e394668931f7d609dcb4d08c2b1641476e709d26e745f0da01e2acd4c00ee3278a065b033028a15ea4822bc64a2cb4bd753f539534e3d127a5a87","hypabxnsoqn1p3","19372937193738","foo"] 

app.get("/api/e6/:tags?", async(req, res, next)=>{
    var pos = req.query.tags;
    if (pos && !Array.isArray(pos)) pos = pos.split(' ');
 
    let json = await y.getposts(encodeURI(pos));
    res.send(json)
})

app.use(function(err, req, res, next){
  res.status(err.status || 500);
    
  res.send({
      error: err.message,
      status: (err.status || 500)
  });
});

app.use(function(req, res){
  res.status(404);
  res.send({ 
      error: "Sorry, can't find that",
      status: 404
  })
});

app.listen(3000, () => {
  console.log('server started');
});