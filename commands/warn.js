const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async (bot, message, args) => {

  //!warn @daeshan <reason>
  if(!message.member.hasPermission("KICK_MEMBERS")) return;
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply("User is a nil value.");
  if(wUser.hasPermission("KICK_MEMBERS")) return;
  let reason = args.join(" ").slice(22);
  if(!reason) reason = "Was not set."
  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };

  warns[wUser.id].warns++;

  fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  let warnEmbed = new Discord.RichEmbed()
  .setDescription("Warns")
  .setAuthor(message.author.username)
  .setColor("#fc6400")
  .addField("Warned User", `<@${wUser.id}>`)
  .addField("Warned In", message.channel)
  .addField("Number of Warnings", warns[wUser.id].warns)
  .addField("Reason", reason);

  let warnchannel = message.guild.channels.find(`name`, "warns");
  if(!warnchannel) return message.reply("Couldn't find channel");

  warnchannel.send(warnEmbed);
  if(warns[wUser.id].warns == 7){
    message.channel.send(`<@${wUser.id}> Your one warning away from getting kicked.`);
  }
  if(warns[wUser.id].warns == 8){
    message.guild.member(wUser).kick(reason);
  }


}

module.exports.help = {
  name: "warn"
}
