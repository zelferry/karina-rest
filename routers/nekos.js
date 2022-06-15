var express = require('express');
var app1 = express.Router();

const client = require('nekos.life');
const neko = new client();

let datajson = new(require("../utils/nekos_resolve.js"))()

app1.get("/", function(req, res){
    //console.log(datajson)
    res.send({
        send: true,
        info: {
            library: "https://www.npmjs.com/package/nekos.life",
            routers: [
                {
                    name: "sfw",
                    usage: "<Url>/api/nekos/sfw/:tag",
                    examples: [
                        "<Url>/api/nekos/sfw/meow"
                    ]
                }/*
                {
                    name: "nsfw",
                    usage: "<Url>/api/nekos/nsfw/:tag",
                    examples: [
                        "<Url>/api/nekos/nsfw/neko"
                    ]
                }*/
            ]
        }
    })
});

app1.get("/sfw/:tag", async function(req, res){
    let tags = req.params.tag;

    if(!tags){
        return res.send({
            send: false,
            error: "não a tags",
            tags: datajson.sfw
        })
    } else if(!(datajson.tags).includes(tags)){
        return res.send({
            send: false,
            error: "tag inválida",
            tags: datajson.tags
        })
    } else {
        return res.send(await neko.sfw[tags]())
    }
});

/*app1.get("/nsfw/:tag", async function(req, res){
    let tags = req.params.tag;

    if(!tags){
        return res.send({
            send: false,
            error: "não a tags",
            tags: datajson.nsfw
        })
    } else if(!(datajson.nsfw).includes(tags)){
        return res.send({
            send: false,
            error: "tag inválida",
            tags: datajson.nsfw
        })
    } else {
        
        return res.send(await neko.nsfw[tags]())
    }
})*/

module.exports = app1