let data = require("../files_json/nekos.json")

class NekoClient1 {
    constructor(){
        let self = this

        self.sfw = [];
        self.nsfw = [];

        Object.keys(data.sfw).forEach(async (endpoint) => {
            self.sfw.push(endpoint)
        })
        Object.keys(data.nsfw).forEach(async (endpoint) => {
            self.nsfw.push(endpoint)
        })
    }
}
module.exports = NekoClient1