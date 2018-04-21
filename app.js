const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./settings.json').token;
const fs = require("fs");

client.uat = require("./uat.json");

client.on('ready',() => {
    console.log("UAT Bot has logged on");
    client.user.setActivity("Solo Camping");
    /* For changing bot's username, only run once per name change
    client.user.setUsername("Robo-ky");
    */
	
	//check uat timer
	client.setInterval(() => {
		for(let i in client.uat) {
			let time = client.uat[i].time;
			let guildId = client.uat[i].guild;
			let guild = client.guilds.get(guildId);
			let member = guild.members.get(i);
			let mutedRole = "374686400307789824";
			
			if(Date.now() > time) {
				console.log("${i} is now free from UAT!");
				
				member.removeRole("374686400307789824");
				delete client.uat[i];
				
				fs.writeFile("./uat.json", JSON.stringify(client.uat), err => {
					if(err) throw err;
					console.log("Role removed from " + member.user.tag + ".");
				});
			}
		}
	}, 5000);
	
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
	console.log("---");
	console.log("User: " + message.author.username);
	console.log("Command: " + command);
	console.log("Arg 1 : " + args[0]);
	console.log("Arg 2 : " + args[1]);
	
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
			
			if(prisoner.roles.has("374686400307789824"))
			{
				message.channel.send("This user is already in UAT!");
				return;
			}
			
			//check if no time given, default to 120 seconds
			if(args[1] == undefined)
			{
				args[1] = 120
			}
			//create what to add to the json file
			client.uat[prisoner.id] = {
				guild: message.guild.id,
				time: Date.now() + parseInt(args[1]) * 1000
			}
			
			fs.writeFile("./uat.json", JSON.stringify(client.uat, null, 4), err => {
				if(err) throw err;
			});
			
            prisoner.addRole("374686400307789824").catch(console.error);

            message.channel.send("Sending " + prisoner.displayName + " to UAT");
            message.channel.send({files: ["./images/uat.jpg"]})
			.then(msg => {
				msg.delete(5000)
			});
            message.guild.channels.find("name", "uat").send("Welcome to UAT, " + prisoner.displayName + ". You're locked up for... " + args[1] + " seconds!");
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
			
			delete client.uat[prisoner.id];
			fs.writeFile("./uat.json", JSON.stringify(client.uat), err => {
					if(err) throw err;
					console.log("Role removed from " + prisoner.user.tag + ".");
				});
            
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