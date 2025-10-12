let modInfo = {
	name: "指数",
	id: "ExpoMiantiao",
	author: "Qazxswe308",
	pointsName: "旋律",
	discordName: "反命题at",
	discordLink: "https://www.bilibili.com/video/BV1vL41177sR/?t=35",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 168,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.0.1",
	name: "我不知道",
}

let changelog = `<h1>更新日志：</h1><br>
	<h3>0.0.0.1</h3><br>
		- 初始版本`

let winText = `我们的旅途还会继续......`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]
function n(x) {
	return new ExpantaNum(x)
}
function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = new ExpantaNum(1)
	if (hasUpgrade('q', 11)) gain = gain.mul(upgradeEffect('q',11))
	if (hasUpgrade('q', 12)) gain = gain.mul(upgradeEffect('q',12))

	if (hasUpgrade('q', 16)) gain = gain.pow(upgradeEffect('q',16))
	if (hasUpgrade('q', 22)) gain = gain.pow(upgradeEffect('q',22))

	if (hasUpgrade('q', 31)) gain = n(10).pow(gain.log10().pow(10))
	if (hasUpgrade('q', 32)) gain = n(10).pow(gain.log10().pow(100))
	if (hasUpgrade('q', 33)) gain = n(10).pow(gain.log10().pow(upgradeEffect('q',33)))

	let preGain=gain

	for(i=3;i<=10;i++)if(gain.gte(n(10).pow(n(10).pow(i))))gain=n(10).pow(n(10).pow(gain.log10().log10().div(i).pow(0.125).mul(i)))

	if(gain.gte("ee100"))gain=n(10).pow(n(10).pow(n(10).pow(gain.log10().log10().log10().div(2).pow(0.125).mul(2))))

	player.overflowStrength=preGain.logBase(gain)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	overflowStrength:n(1)
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return player.points.lt("ee3")?"":("由于旋律在1e1000溢出，旋律获取被开"+format(player.overflowStrength)+"次根！")},
	function(){return player.points.lt("ee4")?"":("由于旋律在1e10000溢出^2，旋律溢出的效果更强！")},
	function(){return player.points.lt("ee5")?"":("由于旋律在1e100000溢出^3，旋律溢出^2的效果更强！！")},
	function(){return player.points.lt("ee6")?"":("由于旋律在e1e6溢出^4，旋律溢出^3的效果更强！！！")},
	function(){return player.points.lt("ee7")?"":("由于旋律在e1e7溢出^5，旋律溢出^4的效果更强！！！！")},
	function(){return player.points.lt("ee8")?"":("由于旋律在e1e8溢出^6，旋律溢出^5的效果更强！！！！！")},
	function(){return player.points.lt("ee9")?"":("由于旋律在e1e9溢出^7，旋律溢出^6的效果更强！！！！！！")},
	function(){return player.points.lt("ee10")?"":("由于旋律在e1e10溢出^8，旋律溢出^7的效果更强！！！！！！！")},

	function(){return player.points.lt("ee100")?"":("<br>由于旋律在e1e100元溢出，以上旋律溢出的效果更强！！！！！！！！")},
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("e5e475")
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(86400) // Default is 1 day which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}