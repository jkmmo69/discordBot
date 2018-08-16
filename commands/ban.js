const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
   if(!bUser) return message.channel.send("Can't find user!");
   let kReason = args.join(" ").slice(22);
   if(!message.member.hasPermission("BAN_MEMBERS")) return;
   if(bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("That person can't be Banned!");
   if(!kReason){
     kReason = "Reason not specified."
   }
   let kickEmbed = new Discord.RichEmbed()
   .setDescription("~Ban~")
   .setColor("#e56b00")
   .addField("Banned User", `${bUser} with ID ${bUser.id}`)
   .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
   .addField("Banned In", message.channel)
   .addField("Tiime", message.createdAt)
   .addField("Reason", kReason);

   let kickChannel = message.guild.channels.find(`name`, "audit-log");
   if(!kickChannel) return message.channel.send("Can't find incidents channel.");
   message.guild.member(bUser).ban(kReason);
   kickChannel.send(kickEmbed);

   return;

}

module.exports.help = {
  name: "ban"
}
