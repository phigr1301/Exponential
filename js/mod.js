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
	num: "0.0.1.1",
	name: "Memories",
}

let changelog = `<h1>更新日志：</h1><br>
	<h3>v0.0.1.1</h3><br>
		- 更改了离线时间机制<br>
		- 终局：1.79e308旋律<br><br>
	<h3>v0.0.1.0</h3><br>
		- 增加了13个升级，5个里程碑，2个可购买<br>
		- 终局：1e303旋律<br><br>
	<h3>v0.0.0.4</h3><br>
		- 增加了一个层级，10个升级，7个里程碑，1个可点击<br>
		- 终局：解锁空间质量<br><br>
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

	if(player.isOffline||player.offTime!==undefined)return n(0)
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

	if(gain.gte("eee10"))gain=n(10).tetr(gain.slog().sub(4).mul(0.9).add(4))

	if(gain.gte("eeee10"))gain=n(10).tetr(gain.slog().div(5).pow(0.125).mul(5))

	player.overflowStrength=preGain.logBase(gain)
	if(preGain.gte("eeeee10")){player.overflowStrength=preGain.slog().sub(gain.slog());player.useType3=true;player.useType2=false;}
	else if(preGain.gte("eee10")){player.overflowStrength=preGain.log10().logBase(gain.log10());player.useType3=false;player.useType2=true}
	else {player.overflowStrength=preGain.logBase(gain);player.useType3=false;player.useType2=false}
	player.overflowStrength2=preGain.logBase(gain);
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	overflowStrength:n(1),
	overflowStrength2:n(1),
	useType2:false,
	useType3:false,
	isOffline:false,
	enableGameSpeed:false,
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return player.points.lt("ee3")?"":("由于旋律在1e1000溢出，旋律获取"+(player.useType3?"的指数塔减少"+format(player.overflowStrength)+"层！":(player.useType2?"的指数":"")+"被开"+format(player.overflowStrength)+"次根！"))},
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

	function(){return player.points.lt("eeee10")?"":("<br>由于旋律在1.0F5元溢出^(ω^ω)，以上旋律溢出的效果更强！！！！！！！！！！！！！")},
]

// Determines when the game "ends"
function isEndgame() {
	return hasMilestone('p',11)
}

function gba(layer, id) {
	return (player[layer].buyables[id])
}
function sba(layer, id, amt) {
	player[layer].buyables[id] = amt
}

//mass format

function formatMass(x){
	if(x.lt(1e3))return format(x)+"g"
	if(x.lt(1e6))return format(x.div(1e3))+"kg"
	if(x.lt(1.5e56))return format(x.div(1e6))+"t"
	if(x.lt("ee9"))return format(x.div(1.5e56))+"uni"
	if(x.lt("ee24"))return format(x.log10().div(1e9))+"mlt"
	if(x.lt("ee39"))return format(x.log10().div(1e24))+"mgv"
	if(x.lt("ee54"))return format(x.log10().div(1e39))+"giv"
	if(x.lt("ee69"))return format(x.log10().div(1e54))+"tev"
	if(x.lt("ee84"))return format(x.log10().div(1e69))+"pev"
	if(x.lt("ee99"))return format(x.log10().div(1e84))+"exv"
	if(x.lt("ee114"))return format(x.log10().div(1e99))+"zev"
	if(x.lt("ee129"))return format(x.log10().div(1e114))+"yov"
	let arv=x.log10().div(1e9).log10().div(15).floor()
	if(arv.add(2).lt(1000))return format(x.log10().div(1e9).div(n(10).pow(arv.mul(15))))+"arv^"+format(arv.add(2),0)
	return format(x.log10().div(1e9).log10().div(15))+"arvs"
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