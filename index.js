const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
const dotenv = require('dotenv'); 
dotenv.config();

const sleep = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
}

if (process.env.TOKEN == null) {
    console.log("An discord token is empty.");
    sleep(60000).then(() => console.log("Service is getting stopped automatically"));
    return 0;
}

const userMoney = new Map();

const discordLogin = async() => {
    try {
        await client.login(process.env.TOKEN);  
    } catch (TOKEN_INVALID) {
        console.log("An invalid token was provided");
        sleep(60000).then(() => console.log("Service is getting stopped automatically"));
    }
}

discordLogin();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}.`);
});

client.on('messageCreate', msg => {
    try { 
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter('디스코드봇 테스트');


        if (msg.content === process.env.PREFIX + 'avatar') {
            embed.setImage(msg.author.displayAvatarURL());
            msg.reply({ embeds: [embed] });
        }

        if (msg.content === process.env.PREFIX + 'help') {
            embed.setTitle('도움말')
                 .setDescription('&일하기: 명령어를 사용하여 일정 시스를 얻습니다.');
            msg.reply({ embeds: [embed] });
        }

        if (msg.content === process.env.PREFIX + '핑') {
            const ping = Date.now() - msg.createdTimestamp;
            embed.setDescription(`핑: ${ping}ms`);
            msg.reply({ embeds: [embed] });
        }

        if (msg.content === process.env.PREFIX + 'server') {
            embed.setDescription(`현재 서버의 이름은 ${msg.guild.name} 입니다.\n총 멤버 수는 ${msg.guild.memberCount} 명 입니다.`);
            msg.reply({ embeds: [embed] });
        }

        if (msg.content === process.env.PREFIX + '일하기') {
            const userId = msg.author.id;
            const existingMoney = userMoney.get(userId) || 0;
            const newMoney = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
            const totalMoney = existingMoney + newMoney;
            userMoney.set(userId, totalMoney);

            if (existingMoney > 0) {
                embed.setDescription(`이전에 얻은 시스: ${existingMoney}\n새로 얻은 시스: ${newMoney}\n총 시스: ${totalMoney}`);
            } else {
                embed.setDescription(`새로 얻은 시스: ${newMoney}\n총 시스: ${totalMoney}`);
            }
            msg.reply({ embeds: [embed] });
        }

        console.log(msg.content);
    } catch (e) {
        console.log(e);
    }
});
