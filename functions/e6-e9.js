class json_data {
    constructor(){
        this.fetch = require('node-fetch');
        this.urls = {
            e6: "https://e621.net/",
            e9: "https://e926.net/"
        }
    }
    async e6(pos, limit, page){
        if (pos && pos.length > 40){
            return {
                error: "You may only supply up to 40 tags.",
                send: false,
                status: "???",
                body: {
                    tags: pos,
                    tags_limit: 40,
                    current_tags: pos.length
                }
            }
        } else if (limit && limit > 320){
            return {
                error: "You may only request up to 320 posts at a time.",
                send: false,
                status: "???",
                body: {
                    limit: 320,
                    current_limit: limit
                }
            }
        } else {
            let e621 = this.urls.e6;
            let data_1 = `${pos ? `tags=${pos.join('+')}` : ''}${limit ? `&limit=${limit}` : ''}${page ? `&page=${page}` : ''}`;
            
            let url = e621 + 'posts.json?' + data_1;
            let result = await this.fetch(url, { 
                method: 'GET', 
                headers: {
                    'User-Agent': 'crosdid/1.0'
                }
            });
            return result.json()
        }
    }
}
module.exports = json_data