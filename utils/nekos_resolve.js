let data = require("../files_json/nekos.json")

class NekoClient1 {
    constructor(){
        let self = this

        self.tags = [];

        Object.keys(data).forEach(async(endpoint) => {
            self.tags.push(endpoint)
        });
    }
}
module.exports = NekoClient1