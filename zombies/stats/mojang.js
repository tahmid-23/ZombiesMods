const https = require("https");

module.exports = {
  getUserInfo : (name) => {
    return new Promise((resolve, reject) => {
      https.get(`https://api.mojang.com/users/profiles/minecraft/${name}?at=${Math.round(new Date().getTime() / 1000)}`, (res) => {
        let data = "";
        
        res.on("data", (chunk) => {
          data += chunk;
        });
        
        res.on("end", () => {
          try {
            let json = JSON.parse(data);
            json.success = true;

            resolve(json);            
          } catch {
            reject ({
              success : false,
              error : "Invalid Username!"
            })
          };
        });
      }).on("error", (err) => {
        reject({
          success : false,
          location : "Mojang",
          error : err.message
        })
      });
    });
  }
}