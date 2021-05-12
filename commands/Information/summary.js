const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const functions = require("../../handlers/functions");
const fetch = require("node-fetch");
module.exports = {
    name: "summary",
    category: "Information",
    aliases: ["summary", "s", "sum"],
    cooldown: 1,
    usage: "summary [URL]",
    description: "Gives you 5 sentences summarizing the link up.",
    run: async (client, message, args, user, text, prefix) => {
        try{
            if(!args[0]){
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`❌ ERROR | You didn't provide a URL`)
                    .setDescription(`Usage: \`${prefix}${this.usage}\``)
                );
            }
            var URL = args[0];
            if(URL.includes("youtube") || URL.includes("docs") || URL.includes("discord") || !functions.validURL(URL)){
                return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | Couldn't use that URL.`)
                .addField("Requested by", user, false)
            );
            }
            FixedURL = URL.replace(/:/gi, "%3A").replace(/\//gi, "%2F").replace(/:/gi, "%3F");
            if(URL.includes('?')){
                FixedURL = FixedURL.replace(/?/gi, "%3F");
            }
            fetch(`https://aylien-text.p.rapidapi.com/summarize?url=${FixedURL}&sentences_number=1`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "d6f38a8010msh80def6bcd5ffaeap11ccd2jsnb191fc4ab056",
                    "x-rapidapi-host": "aylien-text.p.rapidapi.com"
                }
            })
            .then(response => response.json())
            .then(data => {
              return message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle("Here's your summary!")
                .setDescription(`\`\`\`${data.sentences[0]}\`\`\``)
                .addField("Summarized from ", URL, false)
                .addField("Requested by", user, false)
            )})
            .catch(err => {
                console.log(String(err.stack).bgRed)
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`❌ ERROR | An error occurred`)
                    .setDescription(`\`\`\`${err.stack}\`\`\``)
                    .addField("Requested by", user, false)
                );
            });
        }
        catch (e) {
            console.log(String(e.stack).bgRed)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | An error occurred`)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
                .addField("Requested by", user, false)
            );
        }
    }
}