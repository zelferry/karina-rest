let express = require('express');
let nodemailer = require("nodemailer");
let read = require('fs').readFileSync;
let ejs = require("ejs").compile(read(`${process.cwd()}/ejs/email.ejs`, 'utf8'));

let kofi_app = express.Router();
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

let fetch = require('node-fetch');
let request = require('request');
let vip_model = require("../mongo_db/models/vip_user.js")
let { v4: uuidv4 } = require('uuid');

let ids_1 = {
    "9810f9559a": "vip_30",
    "0943bebfb7": "vip_60"
}
let ids_2 = {
    "vip_30": "30 dias",
    "vip_60": "60 dias"
}

kofi_app.post("/", async(req, res, next) => {
    let data = req.body.data;

    if(!data){
        console.log("sem nada na resposta");
        return res.json({ success: false });
    } else {
        let obj = JSON.parse(data);
        if(obj.verification_token == process.env.KOFI_TOKEN){
            if(obj.type == "Shop Order"){
                let product = obj.shop_items;
                let keys = []

                let expiration_date = new Date();
                expiration_date.setDate(expiration_date.getDate() + 2);
                for(let obj1 of product){
                    let token = obj1.direct_link_code;
                    keys.push({
                        key: uuidv4(),
                        type: ids_1[token],
                        dates: {
                            createAt: new Date(),
                            expiresAt: expiration_date
                        },
                        used: false
                    });
                }
                
                let mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: 'zelferrybrburryoficial@gmail.com'/*obj.email*/,
                    subject: 'key de vip-user comprada',
                    html: ejs({
                        keys_: keys.map((x) => {
                            return {
                                key: x.key,
                                type: ids_2[x.type]
                            }
                        })
                    })
                }

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`email enviado: ${info.response}`);
                        
                        for(let obj2 of keys) {
                            let new_ = new vip_model({
                                key: obj2.key,
                                type: obj2.type,
                                dates: {
                                    create_at: obj2.dates.createAt,
                                    expires_at: obj2.dates.expiresAt
                                },
                                used: false
                            });

                            new_.save().catch(e => console.log(e));
                        }
                    }
                });
                
                return res.json({ success: true });
            }   
        } else {
            return res.json({ success: false });
        }
    }
});

module.exports = kofi_app