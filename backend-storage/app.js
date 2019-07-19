const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const redis = require("redis");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = redis.createClient("redis://redis");
client.on("error", function (err) {
  console.log("Error " + err);
});

app.get("/", function(req, res, next) {
  res.send('OK');
});

app.post("/save", function(req, res, next) {
  if(req.body.location && req.body.script && req.body.blocklySource) {
    // TODO: whitelist?
    const data = {
      location: req.body.location,
      script: req.body.script,
      blocklySource: req.body.blocklySource
    };
    client.set(req.body.location, JSON.stringify(data), (err, ok) => {
      console.log('wrote', data.location);
      res.end()
    });
  }

});

app.post("/load", function(req, res, next) {
  client.get(req.body.location, (err, reply) => {
    if (err) {
      res.status(500);
      res.end(err.message);
      return;
    }
    if (reply) {
      res.send(reply);
    } else {
      res.sendStatus(404);
    }
  });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
