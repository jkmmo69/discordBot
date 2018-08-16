const botconfig = require('./botconfig.json');
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: false});
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });

});


bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);

  bot.user.setActivity("The server", {type: "WATCHING"});

});


bot.on('guildMemberAdd', member => {
  // logs when a player joins and gives them role
  const channel = member.guild.channels.find('name', 'join-log');
  let Role = member.guild.roles.find("name","The people")
  if (!Role) return;
  if (!channel) return;
  member.addRole(Role);
  channel.send(`${member} Joined the Server.`);
});


bot.on('guildMemberRemove', member => {
  // logs when a player leaves
  const channel = member.guild.channels.find('name', 'join-log');
  if (!channel) return;
  channel.send(`${member} Left the Server.`);
});


bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return message.reply("Don't dm me again.");

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);


});
bot.login(botconfig.token);
