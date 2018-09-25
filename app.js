const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./settings.json').token;
const fs = require("fs");

client.uat = require("./uat.json");
client.devincoin = require("./devincoin.json");

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
	let commander = message.author;
	console.log("---");
	console.log("User: " + commander.username);
	console.log("Command: " + command);
	console.log("Arg 1 : " + args[0]);
	console.log("Arg 2 : " + args[1]);
	
    //command 1
    if(message.content.startsWith(prefix + 'hi')){
        message.channel.send("Hello, I am Jimmy Bot");
    } else

    //command 2
    if(message.content.startsWith(prefix + 'un')){
        //message.channel.send("<:un:397192404127711234>");
		unFile = "./images/un.png";
		message.channel.send({files: [unFile]});
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
			
			if(prisoner.roles.has("377626418349080595"))
			{
				message.channel.send("Upupupu...");
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
			
			//if NaN set to 120
			if(isNaN(parseInt(args[1])))
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

            message.channel.send("Sending " + prisoner.displayName + " to UAT for " + args[1] + " seconds!");
            message.channel.send({files: ["./images/uat.jpg"]})
			.then(msg => {
				msg.delete(5000)
			});
            message.guild.channels.find("name", "uat").send("Welcome to UAT, " + prisoner.displayName + ". You're locked up for... " + args[1] + " seconds!");
        }

        else 
        {
			let prisoner = message.mentions.members.first();

            if(prisoner == null)
            {
                message.channel.send("User does not exist");
                return;
            }
			
			if(prisoner.roles.has("377626418349080595"))
			{
				message.channel.send("Upupupu...");
				return;
			}
			
			if(prisoner.roles.has("374686400307789824"))
			{
				message.channel.send("This user is already in UAT!");
				return;
			}
			
            //message.channel.send("Only admins can send members to UAT");
			if(!client.devincoin[commander.id])
			{
				//if no data exists on the user, add the user with base amount of 10 coins
				client.devincoin[commander.id] = {
					devincoins: 10
				}
			
				fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
					if(err) throw err;
				});
			}
		
			if(client.devincoin[commander.id].devincoins < 25){
				message.channel.send("You've not enough devincoins. Begone, peasant.");
				return;
			}
		
			if(message.member.roles.has("374686400307789824"))
			{
				message.channel.send("Prisoners don't get to UAT people!");
				return;
			}
			//decrease devinco
			client.devincoin[commander.id].devincoins -= 25;
		
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
				});
			
			//create what to add to the json file
			client.uat[prisoner.id] = {
				guild: message.guild.id,
				time: Date.now() + 120 * 1000
			}
			
			fs.writeFile("./uat.json", JSON.stringify(client.uat, null, 4), err => {
				if(err) throw err;
			});
			
            prisoner.addRole("374686400307789824").catch(console.error);

            message.channel.send("Sending " + prisoner.displayName + " to UAT for 120 seconds!");
            message.channel.send({files: ["./images/uat.jpg"]})
			.then(msg => {
				msg.delete(5000)
			});
            message.guild.channels.find("name", "uat").send("Welcome to UAT, " + prisoner.displayName + ". You're locked up for... " + 120 + " seconds!");
        }
    } else

	//burst UAT 
	if(message.content.startsWith(prefix + "burstuat"))
	{
		let prisoner = message.mentions.members.first();

            if(prisoner == null)
            {
                message.channel.send("User does not exist");
                return;
            }
			
			if(prisoner.roles.has("377626418349080595"))
			{
				message.channel.send("Upupupu...");
				return;
			}
			
			if(prisoner.roles.has("374686400307789824"))
			{
				message.channel.send("This user is already in UAT!");
				return;
			}
			
            //message.channel.send("Only admins can send members to UAT");
			if(!client.devincoin[commander.id])
			{
				//if no data exists on the user, add the user with base amount of 10 coins
				client.devincoin[commander.id] = {
					devincoins: 10
				}
			
				fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
					if(err) throw err;
				});
			}
		
			if(client.devincoin[commander.id].devincoins < 1){
				message.channel.send("You've not enough devincoins. Begone, peasant.");
				return;
			}
		
			if(message.member.roles.has("374686400307789824"))
			{
				message.channel.send("Prisoners don't get to UAT people!");
				return;
			}
			//decrease devinco
			let bursttime = client.devincoin[commander.id].devincoins*4 + 22;
			client.devincoin[commander.id].devincoins = 0;
		
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
				});
			
			//create what to add to the json file
			client.uat[prisoner.id] = {
				guild: message.guild.id,
				time: Date.now() + bursttime * 1000
			}
			
			fs.writeFile("./uat.json", JSON.stringify(client.uat, null, 4), err => {
				if(err) throw err;
			});
			
            prisoner.addRole("374686400307789824").catch(console.error);

            message.channel.send("Sending " + prisoner.displayName + " to UAT for " + bursttime + " seconds!");
            message.channel.send({files: ["./images/uat.jpg"]})
			.then(msg => {
				msg.delete(5000)
			});
            message.guild.channels.find("name", "uat").send("Welcome to UAT, " + prisoner.displayName + ". You're locked up for... " + bursttime + " seconds!");
	}
	else
	
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
		if(!client.devincoin[commander.id])
		{
		//if no data exists on the user, add the user with base amount of 10 coins
			client.devincoin[commander.id] = {
				devincoins: 10
			}
			
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
			});
		}
		
		if(client.devincoin[commander.id].devincoins < 1){
			message.channel.send("You've not enough devincoins. Begone, peasant.");
			return;
		}
		
		if(message.member.roles.has("374686400307789824"))
			{
				message.channel.send("Prisoners don't get to be comfy!");
				return;
			}
		
		//decrease devincoin
		client.devincoin[commander.id].devincoins--;
		
		fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
			});
	
		//begin gacha
        var rand = Math.floor((Math.random() * 100) + 1);
        var picture;

		//case SSR, 3% chance
        if(rand >=1 && rand <= 3)
        {
			message.channel.send("SSR COMFY!!!");
			rand = Math.floor((Math.random() * 3) +1);
            picture = "./images/comfiest" + rand + ".jpg";
			client.devincoin[commander.id].devincoins += 100;
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
			});
        }
        else if (rand > 3 && rand <= 9)	//case SR, 6% chance
        {
			message.channel.send("SR COMFY!!!");
            rand = Math.floor((Math.random() * 17) + 1);
            picture = "./images/SRcomfy" + rand + ".jpg";
			client.devincoin[commander.id].devincoins += 10;
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
			});
        }
		else if (rand > 9 && rand <= 13) //case uat, 4% chance
		{
			picture = "./images/uat.jpg";
			//create what to add to the json file
			client.uat[message.member.id] = {
				guild: message.guild.id,
				time: Date.now() + parseInt(120) * 1000
			}
			
			fs.writeFile("./uat.json", JSON.stringify(client.uat, null, 4), err => {
				if(err) throw err;
			});
			
            message.member.addRole("374686400307789824").catch(console.error);
            message.guild.channels.find("name", "uat").send("Welcome to UAT, " + message.member.displayName + ". You're locked up for... " + 120 + " seconds!");
		}
        else	//case normal
        {
            rand = Math.floor((Math.random() * 55) + 1);
            picture = "./images/comfy" + rand + ".jpg";
        }
		
		//send comfy image to channel
        message.channel.send({files: [picture]});
    } else
	
	//command 7
	if(command == "devincoins")
	{
		
		if(!client.devincoin[commander.id])
		{
		//if no data exists on the user, add the user with base amount of 10 coins
			client.devincoin[commander.id] = {
				devincoins: 10
			}
			
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
			});
		}
		
		message.channel.send("You have " + client.devincoin[commander.id].devincoins + " devincoins.");
	} else
	
	//command 8
	if(command == "award")
	{
		//if NaN return
		if(isNaN(parseInt(args[1])))
		{
			message.channel.send("Invalid amount.");
			return;
		}
			
		if(message.member.roles.find("name", "admins"))
        {
			let prisoner = message.mentions.members.first();

            if(prisoner == null)
            {
                message.channel.send("User does not exist");
                return;
            }
			
			if(!client.devincoin[prisoner.id])
			{
			//if no data exists on the user, add the user with base amount of 10 coins
			client.devincoin[prisoner.id] = {
				devincoins: 10
			}
			
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
			});
			}
			
			client.devincoin[prisoner.id] = {
				devincoins: client.devincoin[prisoner.id].devincoins + parseInt(args[1])
			}
			
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
			});
			message.channel.send("Devincoins awarded.");
			
		
		
		}
	} else

	//command 9
	if(command == "role")
	{
		let role = message.guild.roles.find("name", args[1]);

		if(!role){
			message.channel.send("I do not know that role");
			return;
		}

		if(role == "Sent to UAT (Muted)"){
			message.channel.send("Why would you want to go to UAT...")
			return;
		}

		if(args[0] == "add" || args[0] == "Add")
		{
			message.member.addRole(role).catch(console.error);
			message.channel.send("You have been added to the role, " + role.name);
		}

		else if (args[0] == "remove" || args[0] == "Remove")
		{
			message.member.removeRole(role).catch(console.error);
			message.channel.send("You have been removed from the role, " + role.name);
		}

		else {
			message.channel.send("I do not know that command.");
		}
	} else

	//comand 10
	    //command RPS GAME
    if(message.content.startsWith(prefix + "rock") || message.content.startsWith(prefix + "paper") || message.content.startsWith(prefix + "scissors"))
    {
		if(!client.devincoin[commander.id])
		{
		//if no data exists on the user, add the user with base amount of 10 coins
			client.devincoin[commander.id] = {
				devincoins: 10
			}
			
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
			});
		}
		
		if(args[0] == undefined)
			{
				args[0] = 1
			}
		
		if(isNaN(parseInt(args[0])) || args[0] <= 0 || Math.floor(args[0]) == 0)
		{
			message.channel.send("Invalid amount.");
			return;
		}
		
		let rpsbet = parseInt(args[0]);
		
		if(client.devincoin[commander.id].devincoins < rpsbet){
			message.channel.send("Don't be challenging me if you can't front the money!");
			return;
		}
		
		if(message.member.roles.has("374686400307789824"))
			{
				message.channel.send("Prisoners don't get to play games!");
				return;
			}
		
		//decrease devinco
		client.devincoin[commander.id].devincoins -= rpsbet;
		
		fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
			});
	
        var randRPS = Math.floor((Math.random() * 3) + 1);
        var pictureRPS;

		if(randRPS == 1)
		{
			pictureRPS = "./images/scissors.jpg";
			if(message.content.startsWith(prefix + "rock"))
			{
				//message.channel.send("You beat me!");
				client.devincoin[commander.id].devincoins += 2 * rpsbet;
				fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
				});
			}
			else if(message.content.startsWith(prefix + "scissors"))
			{
				//message.channel.send("Double KO!");
				client.devincoin[commander.id].devincoins += rpsbet;
				fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
				});
			}
			else if(message.content.startsWith(prefix + "paper"))
			{
				//message.channel.send("You lose!");
				//client.devincoin[commander.id].devincoins += 0;
				//fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				//if(err) throw err;
				//});
			}
		}
		else if(randRPS == 2)
		{
			pictureRPS = "./images/rock.jpg";
			if(message.content.startsWith(prefix + "paper"))
			{
				//message.channel.send("You beat me!");
				client.devincoin[commander.id].devincoins += 2 * rpsbet;
				fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
				});
			}
			else if(message.content.startsWith(prefix + "rock"))
			{
				//message.channel.send("Double KO!");
				client.devincoin[commander.id].devincoins += rpsbet;
				fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
				});
			}
			else if(message.content.startsWith(prefix + "scissors"))
			{
				//message.channel.send("You lose!");
				//client.devincoin[commander.id].devincoins += 0;
				//fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				//if(err) throw err;
				//});
			}
			
		}
		else if(randRPS == 3)
		{
			pictureRPS = "./images/paper.jpg";
			if(message.content.startsWith(prefix + "scissors"))
			{
				//message.channel.send("You beat me!");
				client.devincoin[commander.id].devincoins += 2*rpsbet;
				fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
				});
			}
			else if(message.content.startsWith(prefix + "paper"))
			{
				//message.channel.send("Double KO!");
				client.devincoin[commander.id].devincoins += rpsbet;
				fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				if(err) throw err;
				});
			}
			else if(message.content.startsWith(prefix + "rock"))
			{
				//message.channel.send("You lose!");
				//client.devincoin[commander.id].devincoins += 0;
				//fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
				//if(err) throw err;
				//});
			}
		}
		else
		{
			message.channel.send("Hang on! I'm not ready!");
		}
        message.channel.send({files: [pictureRPS]});
    }
	else
	//command nu
	if(message.content.startsWith(prefix + 'nu')){
        //message.channel.send("<:un:397192404127711234>");
		unFile = "./images/nu.png";
		message.channel.send({files: [unFile]});
    }
	//else
		
	//Command Steal Game
	/*if(message.content.startsWith(prefix + "steal"))
	{
	
	if(args[1] == undefined)
	{
		args[1] = 1
	}
	if(isNaN(parseInt(args[1])) || args[1] <= 0 || Math.floor(args[1]) == 0)
	{
		message.channel.send("Invalid amount.");
		return;
	}
	
		
	let stealbet = parseInt(args[1]);
	let prisoner = message.mentions.members.first();
	
	if(prisoner == null)
            {
                message.channel.send("User does not exist");
                return;
            }
			
	var randSteal = Math.floor((Math.random() * 2) + 1);
	if(client.devincoin[prisoner.id].devincoins < stealbet)
	{
		message.channel.send("You can't steal what they don't have!");
		return;
	}
	else if(client.devincoin[commander.id].devincoins < stealbet)
	{
		message.channel.send("You can't even afford the risk!");
		return;
	}
	else if(randSteal == 1)
	{
		message.channel.send("You successfully stole from");
		message.mentions.members.first()
			client.devincoin[commander.id].devincoins += stealbet;
			client.devincoin[prisoner.id] = {
				devincoins: client.devincoin[prisoner.id].devincoins - parseInt(args[1])
			}
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
			if(err) throw err;
			});
	}
	else if(randSteal == 0)
	{
		message.mentions.members.first()
		message.channel.send("beat you down and stole your money instead.");
		client.devincoin[commander.id].devincoins -= stealbet;
		client.devincoin[prisoner.id] = {
				devincoins: client.devincoin[prisoner.id].devincoins + parseInt(args[1])
			}
			fs.writeFile("./devincoin.json", JSON.stringify(client.devincoin, null, 4), err => {
			if(err) throw err;
			});
	}
	else
	{
		message.channel.send("Hang on! I'm not ready!");
	}*/






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