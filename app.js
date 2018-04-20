const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./settings.json').token;

client.on('ready',() => {
    console.log("UAT Bot has logged on");
    client.user.setActivity("Solo Camping");
    /* For changing bot's username, only run once per name change
    client.user.setUsername("Robo-ky");
    */
});

//prefix for bot commands
var prefix = "!"

client.on('message', message => {

    //reduce bot workload by ignoring messages without prefix
    if(!message.content.startsWith(prefix)) return;

    //required to have bot ignore its own messages
    if(message.author.bot) return;

    //ignore dm's
    if(message.channel.type === "dm"){
        message.reply("stop sliding into my dm's...");
        return;
    }

    /*if(message.author.id === "134657571335176192"){
        message.channel.send("You can't command me, Sho");
        return;
    }*/

	//Parse and split into vars. the base command is command, args[] are each argument spaced out
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	//print args and command to console for testing
	client.log("Command: " + command);
	client.log("Arg 1 : " + args[1]);
	client.log("Arg 2 : " + args[2]);
	
    //command 1
    if(message.content.startsWith(prefix + 'hi')){
        message.channel.send("Hello, I am Jimmy Bot");
    } else

    //command 2
    if(message.content.startsWith(prefix + 'un')){
        message.channel.send("<:un:397192404127711234>");
    } else
    
    //command 3
    if(message.content.startsWith(prefix + "upset")){
        message.channel.send("I'm not upset");
    } else

    //command 4 -- UAT roleID: 374686400307789824
    if(message.content.startsWith(prefix + "uat"))
    {
        if(message.member.roles.find("name", "admins"))
        {
            let prisoner = message.mentions.members.first();

            if(prisoner == null)
            {
                message.channel.send("User does not exist");
                return;
            }

            prisoner.addRole("374686400307789824").catch(console.error);

            message.channel.send("Sending " + prisoner.displayName + " to UAT");
            message.channel.send({files: ["./images/uat.jpg"]});
            message.guild.channels.find("name", "uat").send("Welcome to UAT, " + prisoner.displayName + ". You're locked up for...[ETERNITY]");
        }

        else 
        {
            message.channel.send("Only admins can send members to UAT");
        }
    } else

    //command 5
    if(message.content.startsWith(prefix + "free"))
    {
        if(message.member.roles.find("name", "admins"))
        {
            let prisoner = message.mentions.members.first();

            if(prisoner == null)
            {
                message.channel.send("User does not exist");
                return;
            }

            prisoner.removeRole("374686400307789824").catch(console.error);
            
            message.channel.send(prisoner.displayName + " was freed from UAT");
        }

        else message.channel.send("Only admins can free from UAT");
    } else

    //command 6
    if(message.content.startsWith(prefix + "comfy"))
    {
        var rand = Math.floor((Math.random() * 1000) + 1);
        var picture;

        if(rand == 1)
        {
            message.channel.send("SSR COMFY!!!");
            picture = "./images/comfiest.jpg";
        }
        else if (rand > 1 && rand <= 60 )
        {
            rand = Math.floor((Math.random() * 10) + 1);
            picture = "./images/SRcomfy" + rand + ".jpg";
        }
        else
        {
            rand = Math.floor((Math.random() * 42) + 1);
            picture = "./images/comfy" + rand + ".jpg";
        }
        
        message.channel.send({files: [picture]});
    }

    /*
    if(message.content.startsWith(prefix + "findRole")){
        if(message.member.roles.find("name", "admins")){
            message.channel.send("You're an admin");
        }
        else message.channel.send("You're not an admin");
    }*/

    //etc
});

client.login(token);