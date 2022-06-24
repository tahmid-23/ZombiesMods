const https = require("https");
const express = require("express");
const app = express();
const fs = require("fs");
const hypixel = require("./zombies/stats/hypixel.js");
const mojang = require("./zombies/stats/mojang.js")

app.get("/zombies/stats", (req, res) => {  
  if (req.query.name == undefined) {    
    res.send({
      success : false,
      error : "Please enter a valid name!"
    });
  } else {
    hypixel.getStats(req.query.name).then((response) => {
      res.send(response);
    }).catch((response) => {
      res.send(response);
    })
  }
});


app.get("/zombies/mods/:modid", (req, res) => {
  res.sendFile(__dirname + "/zombies/mods/" + req.params.modid + "/update.json");
});

app.use("/zombies/mods/", (req, res, next) => { 
  if (req.query.modid != null && req.query.version != null) {
    fs.readFile(`${__dirname}/zombies/mods/${req.query.modid}/update.json`, (err, data) => {
      if (err) {
        res.status(204).send();
      } else {
        const json = JSON.parse(data);
        const filename = `${req.query.modid}-${json.promos[`${req.query.version}-recommended`]}-${req.query.version}.jar`;
        const path = `${__dirname}/zombies/mods/${req.query.modid}/${filename}`;
        
        fs.access(path, fs.constants.F_OK, (err) => {
          if (!err) {
            res.setHeader("content-disposition", `attachment; filename=${filename}`);
            res.sendFile(path);
          } else {
            res.status(204).send();
          }
        });  
      }
    });
  } else {
    express.static(__dirname + "/zombies/mods/public/")(req, res, next);    
  }
});

app.use('/steank', (req, res) => {
    res.redirect('https://tiktok.com');
});

app.use('/marvin', (req, res) => {
    res.send('<script>window.onload = function() {window.location.href = "https://www.tiktok.com/";}</script>');
});

app.use('/bingbong.js', (req, res) => {
  res.sendFile(__dirname + "/bingbong.js");
})

app.use('/marvin2', (req, res) => {
    res.send('<script src="/bingbong.js"></script>');
});

app.get("/", (req, res) => {
  res.status(200).send();
});

app.listen(3000, () => {
  console.log("App listening at http://localhost:3000");
});