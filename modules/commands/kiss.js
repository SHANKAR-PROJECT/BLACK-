const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "kiss",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "Hôn người bạn tag",
  commandCategory: "general",
  usages: "kiss [tag người bạn cần hôn]",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": ""
  },
};

module.exports.run = function({
  api,
  event,
  args,
  client,
  global
}) {
  var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  if (!args.join(" ")) return out("Bạn chưa Tag");
  return request('https://nekos.life/api/v2/img/kiss', (err, response, body) => {
    let picData = JSON.parse(body);
    let getURL = picData.url;
    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
    var mention = Object.keys(event.mentions)[0];
    let tag = event.mentions[mention].replace("@", "");
    let callback = function() {
      api.sendMessage({
        body: tag + ", I wanna kiss you ❤️",
        mentions: [{
          tag: tag,
          id: Object.keys(event.mentions)[0]
        }],
        attachment: fs.createReadStream(__dirname + `/cache/anime.${ext}`)
      }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/anime.${ext}`), event.messageID);
    };
    request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/anime.${ext}`)).on("close", callback);
  });
}