var fs = require('fs');
const request = require('request');
var Output = "";
let url = 'https://teamtrees.org/'
var DataPath = './www/data/TeamTrees.csv'
var HTMLPath = './HTML.txt'
var TreePointer = 1335;
var TreePointerOld = TreePointer;

let Sekunde = 1000;
let Minute = Sekunde*60;
let Stunde = Minute*60;
let Tag = Stunde*24;
let Monat = Tag*(365/12);
let Jahr = Tag*365;

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/www'));
app.listen('3333');

const Telebot = require('telebot');
const bot = new Telebot({
	token: 'Token',
	limit: 1000,
        usePlugins: ['commandButton']
});
//getTrees()

console.log("Start Time: " + getHourUTC(new Date()));


function getTrees() {
	console.log("Pushed: getTrees");
	request(url, (err, res, body) => {
			var Trees = "";
			var LT = fs.readFileSync('./www/data/TeamTrees.csv');
			var LTarr = LT.toString().split(/\s+/);
			var LTarr = LTarr.toString().split(",");
			var LastTree = LTarr[LTarr.length-2]
			if (err) { return console.log(err); }
			
			var bodyarr = body.split('"')
			console.log(bodyarr.length)
			if(typeof bodyarr[TreePointer] !== 'undefined'){
				if(isNaN(bodyarr[TreePointer])) {
					TreePointerOld = TreePointer;
					console.log("Not A number");
					for(var i = 0; i < bodyarr.length;i++){
						Output = Output + i + ":" + bodyarr[i] + " ";
						console.log(i);
						if(bodyarr[i].indexOf("counter-wrap") >= 0){
							TreePointer = i+6;
							console.log("Found!" + i);
						}
					}
					fs.writeFile("HTML.txt", Output, (err) => {if (err) console.log(err);
						console.log("HTML File has updated");
						bot.sendDocument(-1001423197733, HTMLPath);
					});
					bot.sendMessage(-1001423197733,"WARNING: Webpadge changed\nTrying to auto map HTML -->\nNew TreePointer is: " + TreePointer + "\nTreePointer was: " + TreePointerOld + "\nIf the post that came now still not contains the right Tree Amount, contact @BolverBlitz now!");
				}
			
				var TreeDiff = bodyarr[TreePointer] - LastTree;
				Trees = "\n" + getDateTime(new Date()) + "," + bodyarr[TreePointer] + "," + TreeDiff
				TreesChart = "\n" + getDateTime(new Date()) + "," + bodyarr[TreePointer]/1000 + "," + TreeDiff
			
				fs.appendFile('./www/data/TeamTrees.csv', Trees, (err) => {if (err) console.log(err);
					log("Trees: " + bodyarr[TreePointer] + " Diff " + TreeDiff)
				});
				fs.appendFile('./www/data/TeamTreesChart.csv', TreesChart, (err) => {if (err) console.log(err);
					log("Trees: " + bodyarr[TreePointer]/1000 + " Diff " + TreeDiff)
				});
				bot.sendMessage(-1001423197733, "Trees planted: " + numberWithCommas(bodyarr[TreePointer]) + "\nNew trees: " + numberWithCommas(TreeDiff) + "\n[View Graph](home.bolverblitz.net:3333)" + "\n\n[Plant more!](teamtrees.org)", { parseMode: 'markdown' });
			}else{
				Trees = "\n" + getDateTime(new Date()) + "," + LastTree + "," + "0"
				TreesChart = "\n" + getDateTime(new Date()) + "," + LastTree/1000 + "," + "0"
			
				fs.appendFile('./www/data/TeamTrees.csv', Trees, (err) => {if (err) console.log(err);
					log("Trees: " + bodyarr[TreePointer] + " Diff " + TreeDiff)
				});
				fs.appendFile('./www/data/TeamTreesChart.csv', TreesChart, (err) => {if (err) console.log(err);
					log("Trees: " + bodyarr[TreePointer]/1000 + " Diff " + TreeDiff)
				});
				bot.sendMessage(-1001423197733, "The Webpadge is down..." + "\n[View Graph](home.bolverblitz.net:3333)" + "\n\n[Plant more!](teamtrees.org)", { parseMode: 'markdown' });
				}
	});
}

function getTrees24() {
	console.log("Pushed: getTrees24");
	setTimeout(function(){
		request(url, (err, res, body) => {
			var Trees = "";
			var LT = fs.readFileSync('./www/data/TeamTrees.csv');
			var LTarr = LT.toString().split(/\s+/);
			var LTarr = LTarr.toString().split(",");
			if(LTarr.length >= 146){
			var LastTree24 = LTarr[LTarr.length-146]
			//console.log(LastTree24)
			}
			if (err) { return console.log(err); }
			
			var bodyarr = body.split('"')
			
			if(typeof bodyarr[TreePointer] !== 'undefined'){
			
			
			var TreeDiff24 = bodyarr[TreePointer] - LastTree24;
				bot.sendMessage(-1001068986550, "Trees planted: " + numberWithCommas(bodyarr[TreePointer]) + "\nNew trees(24h): " + numberWithCommas(TreeDiff24) + "\n[View Graph](home.bolverblitz.net:3333)\n\n" + getDiffTotalToCurrentRateWeek() + "\n\n[Plant more!](teamtrees.org)", { parseMode: 'markdown' });
			}else{
				bot.sendMessage(-1001068986550, "The Webpadge is down..." + "\n[View Graph](home.bolverblitz.net:3333)" + "\n\n[Plant more!](teamtrees.org)", { parseMode: 'markdown' });
			}
		});
	}, 1);//900000
}
		
function getDateTime(date) {

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	return year + "-" + month + "-" + day;
}

function getHourUTC(date) {

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	return hour-1 + "" + min;
}

function getMinUTC(date) {

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	return min;
}
	
function log(info) {
	console.log("[" + getDateTime(new Date()) + "]" + " " + info)
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getlast24h() {
    var LT = fs.readFileSync('./www/data/TeamTrees.csv');
	var LTarr = LT.toString().split(/\s+/);
	var LTarr = LTarr.toString().split(",");
	var LastTree24 = Number(LTarr[LTarr.length-2]);
	var LastTree24end = Number(LTarr[LTarr.length-146]);
	var last24hTrees = LastTree24 - LastTree24end;
	return last24hTrees;
}

function getlast7d() {
    var LT = fs.readFileSync('./www/data/TeamTrees.csv');
	var LTarr = LT.toString().split(/\s+/);
	var LTarr = LTarr.toString().split(",");
	var LastTree24 = Number(LTarr[LTarr.length-2]);
	var LastTree24end = Number(LTarr[LTarr.length-1010]);
	var last24hTrees = LastTree24 - LastTree24end;
	return last24hTrees;
}

function getCurrentTrees() {

	var LT = fs.readFileSync('./www/data/TeamTrees.csv');
	var LTarr = LT.toString().split(/\s+/);
	var LTarr = LTarr.toString().split(",");
	return Number(LTarr[LTarr.length-2]);

			
}

function getDiffTotalToCurrentRateWeek() {
	var newDate = "12/31/2019"; //Must Be Completed at!
	
	var startDateUnix = new Date().getTime();
	var TimeDoneUnix = new Date(newDate).getTime()
	
	var DiffSekunden = startDateUnix/1000 - TimeDoneUnix/1000;
	
	if(DiffSekunden < 0){
		var DiffSekundenZukunft = DiffSekunden*(-1);
		var TageVerbleibend = Math.floor(DiffSekundenZukunft/(Tag/1000))
		
		var TreesPerDayForLast7Days = Math.floor(getlast7d()/7);
		var TreesPlantetForVerbleibendeTage = TageVerbleibend * TreesPerDayForLast7Days;
		
		var currentTrees = getCurrentTrees();
		var TreesHochgerechnet = currentTrees + TreesPlantetForVerbleibendeTage;
		
		if(TreesHochgerechnet >= 20000000) { //Check if we will win!
			return "Yeha! At the current rate, we will plant " + numberWithCommas(TreesHochgerechnet) +" trees out of 20M by the end of 2019\nWe currently have " + numberWithCommas(currentTrees) + " and plant ~" + numberWithCommas(TreesPerDayForLast7Days) + " per day\n\nTimeStamp: " + getDateTimeUTC(new Date()) + " (UTC)"
		}else{ //Or Loose
			return "Oh NO! At the current rate, we will only plant " + numberWithCommas(TreesHochgerechnet) +" trees out of 20M by the end of 2019\nWe currently have " + numberWithCommas(currentTrees) + " and plant ~" + numberWithCommas(TreesPerDayForLast7Days) + " per day\n\nTimeStamp: " + getDateTimeUTC(new Date()) + " (UTC)"
		}

		
	}else{
		return "Its Over. Its 2020!"
	}
}

function getDateTimeUTC(date) {
		

		var hour = date.getUTCHours();
		hour = (hour < 10 ? "0" : "") + hour;

		var min  = date.getUTCMinutes();
		min = (min < 10 ? "0" : "") + min;

		var sec  = date.getUTCSeconds();
		sec = (sec < 10 ? "0" : "") + sec;

		var year = date.getUTCFullYear();

		var month = date.getUTCMonth() + 1;
		month = (month < 10 ? "0" : "") + month;

		var day  = date.getUTCDate();
		day = (day < 10 ? "0" : "") + day;

		return day + "." + month + "." + year + " " + hour + ":" + min + ":" + sec;
	}

bot.start();

bot.on('/id',(msg) => {
msg.reply.text(msg.chat.id);
bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on(['/start', '/help'],(msg) => {
msg.reply.text("Hello, i´ll post the stats every 30min to @TeamTreesLog and once a day to [@EverythingScienceChat](https://t.me/joinchat/BVSfuz-3cLYa38iD3ISeOg)\nYou can have the data with /pushdata\n\nYou can also use /last24h or /last7d to get the amount of trees planted in that given timespan\n\nWanna see if we win? Well i can´t tell you for sure but i can look at the last week and extrapolate it for you with /canwewin", { parseMode: 'markdown', webPreview: false });
bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on('/last24h',(msg) => {
msg.reply.text("In the last 24h " + numberWithCommas(getlast24h()) + " were Trees planted.");
bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on('/last7d',(msg) => {
msg.reply.text("In the last 7d " + numberWithCommas(getlast7d()) + " were Trees planted.");
bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on('/canwewin',(msg) => {
msg.reply.text("Well: " + getDiffTotalToCurrentRateWeek());
bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on('/pushdata',(msg) => {
	console.log("PushData from User " + msg.from.username + " in Chat " + msg.chat.username);
bot.sendDocument(msg.chat.id, DataPath);
msg.reply.text("If there is a 0 in the row Diff, that means the webpadge was not reachable.\nThis file starts at 2019-10-26 11.45 UTC and was measured every 30 min from then.");
bot.deleteMessage(msg.chat.id, msg.message_id);
});

setInterval(function(){
	if(getHourUTC(new Date()) === '1200'){
		getTrees24();
	}else{
		console.log("Not Time for ES: " + getHourUTC(new Date()))
	}
	if(getMinUTC(new Date()) === '15'){
		getTrees();
	}
	if(getMinUTC(new Date()) === '45'){
		getTrees();
	}
}, 60000); //60000
