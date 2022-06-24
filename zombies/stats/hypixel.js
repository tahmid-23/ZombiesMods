const https = require("https");
const mojang = require("./mojang.js");
const fs = require("fs");

module.exports = {
  getStats : (name) => {
    return new Promise((resolve, reject) => {
      
      mojang.getUserInfo(name).then((response) => {
        const name = response.name;
        const uuid = response.id;
        
        https.get(`https://api.hypixel.net/player?key=${process.env.TOKEN}&uuid=${uuid}`, (res) => {
          
          let data = "";
          
          res.on("data", (chunk) => {
            data += chunk;
          })
          
          res.on("end", () => {
            try {
              let json = JSON.parse(data).player;
              
              try {
                let rank = {
                  packageRank : json.packageRank,
                  newPackageRank : json.newPackageRank,
                  monthlyPackageRank : json.monthlyPackageRank,
                  rankPlusColor : json.rankPlusColor,
                  monthlyRankColor : json.monthlyRankColor,
                  rank : json.rank,
                  prefix : json.prefix,
                  name : name
                }
                
                try {
                  json = json.stats.Arcade;
                  json.rank = rank;
                  
                  resolve({
                    success : true,
                    stats : json
                  });
                  
                  console.log(__dirname);
                  fs.writeFile(`${__dirname}/records/${uuid}.json`, JSON.stringify(json), 'utf8', (err) => {
                    if (err) {
                      console.log(err);
                    }
                  });
                } catch {
                  reject({
                    success : false,
                    error : `It looks like ${name} hasn't played Zombies before!`,
                    found : true,
                    rank : rank
                  });
                }
              } catch {
                reject({
                  success : false,
                  found : true,
                  name : name,
                  error : `It looks like ${name} hasn't played Hypixel before!`
                });
              }
            } catch {
              reject({
                success : false,
                error : "An error occurred while communicating to the Hypixel server!"
              });
            };
          });
          
        }).on("error", (err) => {
          reject({
            success : false,
            location : "Hypixel",
            error : err.message
          });
        });
      }).catch((response) => {
        reject(response);
      });
      
    });
  }
}