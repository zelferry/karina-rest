const axios = require('axios')

const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')

const app = require("express").Router()

let _model

app.get('/anti_nsfw/:tags?', async (req, res) => {
  if (!req.query.tags) res.status(400).send('Missing image')
  else {
    const pic = await axios.get(`${req.query.tags}`, { responseType: 'arraybuffer', });
      const image = await tf.node.decodeImage(pic.data,3)
      
      const predictions = await _model.classify(image)
    image.dispose();

    res.json(predictions)
  }
})

const load_model = async () => {
  _model = await nsfw.load()
}

// Keep the model in memory, make sure it's loaded only once
load_model().then(() => {})

module.exports = app