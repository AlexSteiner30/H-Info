const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
})


async function Run()
{
  await client.login("MTAyODY2OTA3NjU1OTY0Njg0Mg.GFBfbM.V-uPh4jRdys-9a3ERFmzxyLCf_iXsVq7VihuB4");
}

function Post(channel, url, title, subtitle, desc, img)
{
  const news = new Discord.MessageEmbed()
    .setTitle(title)
    .setDescription(desc)
    .setImage(img)
    .setTimestamp()

  client.channels.cache.get(channel).send(`Hey <@& 1028667008566427728 > a new news has added!`); 
  client.channels.cache.get(channel).send(news);
}

module.exports.Run = Run;
module.exports.Post = Post;