let modInfo = {
	name: "指数",
	id: "ExpoMiantiao",
	author: "InfiniteDream",
	pointsName: "旋律",
	discordName: "反命题at",
	discordLink: "https://www.bilibili.com/video/BV1vL41177sR/?t=35",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 168,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.0.3",
	name: "Memories",
}

let changelog = `<h1>更新日志：</h1><br>
	<h3>v0.0.0.3</h3><br>
		- 增加了3个升级，3个里程碑，2个挑战<br>
		- 终局：解锁未定义空间<br><br>
	<h3>v0.0.0.2</h3><br>
		- 增加了一个层级，4个升级，1个里程碑<br>
		- 终局：解锁记忆挑战<br><br>
	<h3>v0.0.0.1</h3><br>
		- 增加了一个层级，25个升级<br>
		- 终局：e5e475点数`

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
    if(hasUpgrade('p',11))gain=gain.mul(4)
    if(hasMilestone('p',1))gain=gain.mul(25)
    if(hasUpgrade('p',21))gain=gain.mul(4)

	if (hasUpgrade('q', 16)) gain = gain.pow(upgradeEffect('q',16))
	if (hasUpgrade('q', 22)) gain = gain.pow(upgradeEffect('q',22))

	if (hasUpgrade('q', 31)) gain = n(10).pow(gain.log10().pow(10))
	if (hasUpgrade('q', 32)) gain = n(10).pow(gain.log10().pow(100))
	if (hasUpgrade('q', 33)) gain = n(10).pow(gain.log10().pow(upgradeEffect('q',33)))

	if(inChallenge('p',11))gain=n(10).tetr(gain.slog().pow(0.5).add(2)).min(gain)
	if(inChallenge('p',12))gain=n(10).pow(gain.log10().pow(Math.sin(player.q.resetTime)/2+0.5))

	let preGain=gain

	for(i=3;i<=10;i++)if(gain.gte(n(10).pow(n(10).pow(i))))gain=n(10).pow(n(10).pow(gain.log10().log10().div(i).pow(0.125).mul(i)))

	for(i=2;i<=5;i++)if(gain.gte(n(10).pow(n(10).pow(n(10).pow(i)))))gain=n(10).pow(n(10).pow(n(10).pow(gain.log10().log10().log10().div(i).pow(0.125).mul(i))))

	if(gain.gte("eee10"))gain=n(10).tetr(gain.slog().sub(3).mul(0.9).add(3))

	player.overflowStrength=preGain.logBase(gain)
	if(preGain.gte("eeee10")){player.overflowStrength=preGain.log10().logBase(gain.log10());player.useType2=true}
	else {player.overflowStrength=preGain.logBase(gain);player.useType2=false}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	overflowStrength:n(1),
	overflowStrength2:n(1),
	useType2:false,
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return player.points.lt("ee3")?"":("由于旋律在1e1000溢出，旋律获取"+(player.useType2?"的指数":"")+"被开"+format(player.overflowStrength)+"次根！")},
	function(){return player.points.lt("ee4")?"":("由于旋律在1e10000溢出^2，旋律溢出的效果更强！")},
	function(){return player.points.lt("ee5")?"":("由于旋律在1e100000溢出^3，旋律溢出^2的效果更强！！")},
	function(){return player.points.lt("ee6")?"":("由于旋律在e1e6溢出^4，旋律溢出^3的效果更强！！！")},
	function(){return player.points.lt("ee7")?"":("由于旋律在e1e7溢出^5，旋律溢出^4的效果更强！！！！")},
	function(){return player.points.lt("ee8")?"":("由于旋律在e1e8溢出^6，旋律溢出^5的效果更强！！！！！")},
	function(){return player.points.lt("ee9")?"":("由于旋律在e1e9溢出^7，旋律溢出^6的效果更强！！！！！！")},
	function(){return player.points.lt("ee10")?"":("由于旋律在e1e10溢出^8，旋律溢出^7的效果更强！！！！！！！")},

	function(){return player.points.lt("ee100")?"":("<br>由于旋律在e1e100元溢出，以上旋律溢出的效果更强！！！！！！！！")},
	function(){return player.points.lt("ee1000")?"":("由于旋律在e1e1000元溢出^2，以上旋律溢出的效果更强！！！！！！！！！")},
	function(){return player.points.lt("eee4")?"":("由于旋律在e1e10000元溢出^3，以上旋律溢出的效果更强！！！！！！！！！！")},
	function(){return player.points.lt("eee5")?"":("由于旋律在ee1e5元溢出^4，以上旋律溢出的效果更强！！！！！！！！！！！")},

	function(){return player.points.lt("eee10")?"":("<br>由于旋律在ee1e10元溢出^ω，以上旋律溢出的效果更强！！！！！！！！！！！！")},
]

// Determines when the game "ends"
function isEndgame() {
	return hasMilestone('p',3)
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