addLayer("AC", {
    name: "ach",
    symbol: "Ac",
    startData() {
        return {
            unlocked: true,
            points:n(0),
        }
    },
    color: "#ffdd33",
    resource: "成就",
    row: "side",
    update(diff) {
        player.devSpeed = layers.AC.devSpeedCal()
    },
    devSpeedCal() {
        let dev = n(1)
        //if(isEndgame())dev=n(0)
        return dev
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "一个成就",
            done() { return false },
            tooltip: "这是一个成就",
            textStyle: { 'color': '#FFDD33' },
        },
    },
},
)
addLayer("q", {
    name: "指数", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "↑", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        memories: new ExpantaNum(0),
        bitree: new ExpantaNum(0),
        inf: new ExpantaNum(0),
        bestu7eff: new ExpantaNum(1),
    }},
    color: "#CDEC0F",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "指数", // Name of prestige currency
    baseResource: "旋律", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.95, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if(hasUpgrade('p',11))mult=mult.mul(4)
        if(hasUpgrade('p',21))mult=mult.mul(4)
        return mult
    },
    directMult() {
        mult = new ExpantaNum(1)
        if(hasMilestone('p',1))mult=mult.mul(500)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let a=new ExpantaNum(1)
        if(hasUpgrade('q',13))a=a.mul(upgradeEffect('q',13))
        if(hasUpgrade('q',14))a=a.mul(upgradeEffect('q',14))
        if(hasUpgrade('q',21))a=a.mul(upgradeEffect('q',21))
        if(hasUpgrade('p',12))a=a.mul(1.1)
        if(a.gte(1000))a=a.div(1000).pow(0.25).mul(1000)
        if(a.gte(1e44))a=n(10).pow(a.log10().div(44).add(1).logBase(2).mul(44))
        if(inChallenge('p',12))a=a.pow(Math.cos(player.q.resetTime)/2+0.5)
        return a
    },
    passiveGeneration() {
        mult = n(0)
        if(hasUpgrade('p',13))mult=n(0.01)
        if(hasUpgrade('q',43))mult=n(0.01)
        return mult
    },
    memoriesMult() {
        mult = n(1)
        if(hasUpgrade('q',34))mult=mult.mul(upgradeEffect('q',34))
        if(hasUpgrade('q',35))mult=mult.mul(upgradeEffect('q',35))
        if(hasUpgrade('q',36))mult=mult.mul(upgradeEffect('q',36))
        if(hasUpgrade('p',11))mult=mult.mul(4)
        if(hasUpgrade('p',13))mult=mult.mul(40)
        if(hasUpgrade('p',14))mult=mult.mul(upgradeEffect('p',14))
        if(hasUpgrade('p',15))mult=mult.mul(upgradeEffect('p',15))
        if(hasUpgrade('p',21))mult=mult.mul(4)
        if(hasChallenge('p',11))mult=mult.pow(1.025)
        return mult
    },
    bitreeMult() {
        mult = n(0.1)
        if(hasUpgrade('q',41))mult=mult.mul(10)
        if(hasUpgrade('q',44))mult=mult.mul(upgradeEffect('q',44))
        if(hasUpgrade('q',45))mult=mult.mul(upgradeEffect('q',45))
        if(hasUpgrade('q',46))mult=mult.mul(upgradeEffect('q',46))
        if(hasUpgrade('p',11))mult=mult.mul(4)
        if(hasUpgrade('p',14))mult=mult.mul(upgradeEffect('p',14))
        if(hasUpgrade('p',21))mult=mult.mul(4)
        return mult
    },
    infMult() {
        mult = n(0.1)
        if(hasUpgrade('q',51))mult=mult.mul(upgradeEffect('q',51))
        if(hasUpgrade('p',11))mult=mult.mul(4)
        if(hasUpgrade('p',14))mult=mult.mul(upgradeEffect('p',14))
        if(hasUpgrade('p',15))mult=mult.mul(upgradeEffect('p',15))
        if(hasUpgrade('p',21))mult=mult.mul(4)
        if(hasChallenge('p',11))mult=mult.mul(10)
        return mult
    },
    autoUpgrade(){return hasUpgrade('p',16)},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow:1000,
    hotkeys: [
        {key: "p", description: "P：获得声望点", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    update(diff){
        if(hasUpgrade('q',33))player.q.memories=player.q.memories.add(tmp.q.memoriesMult.mul(diff))
        if(hasUpgrade('q',36))player.q.bitree=player.q.bitree.add(tmp.q.bitreeMult.mul(diff))
        if(hasUpgrade('q',46))player.q.inf=player.q.inf.add(tmp.q.infMult.mul(diff))
        if(hasMilestone('p',2))player.q.bestu7eff=player.q.bestu7eff.max(player.overflowStrength)
    },
    milestones: {
    },
    upgrades: {
        11: {
            title: "经典起手",
            description: "指数提升旋律获取",
            effect() {
                let eff = n(10).pow(player.q.points.add(1).log10().pow(0.5).mul(3))
                if(hasUpgrade('q',15))eff=eff.pow(upgradeEffect('q',15))
                if(eff.gte(1e222))eff=n(10).pow(eff.log10().div(222).add(1).logBase(2).mul(222))
                if(eff.gte("ee7"))eff=n(10).pow(eff.log10().div(1e7).add(1).logBase(2).mul(1e7))
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());let b=a;if(this.effect().gte(1e222))a=b+"（一重软上限）";if(this.effect().gte('ee7'))a=b+"（二重软上限）";return a; },
            cost: new ExpantaNum(1),
            unlocked() {return true },
        },
        12: {
            title: "憋笑",
            description: "旋律提升旋律获取",
            effect() {
                let eff = n(10).tetr(player.points.pow(20).add(1).slog().mul(0.8))
                if(hasUpgrade('p',11))eff=eff.pow(2)
                if(hasUpgrade('p',21))eff=eff.pow(2)
                if(hasUpgrade('q',25))eff=eff.pow(eff)
                if(eff.gte("ee5"))eff=n(10).pow(eff.log10().div(1e5).add(1).logBase(2).pow(3).mul(1e5))
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());let b=a;if(this.effect().gte("ee5"))a=b+"（一重软上限）";return a; },
            cost: new ExpantaNum(3e8),
            unlocked() { return hasUpgrade('q',11) },
        },
        13: {
            title: "就这点内容吗？",
            description: "旋律提升指数获取指数",
            effect() {
                let eff = player.points.add(10).log10().pow(0.45).div(2).add(0.5).min(3e5)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect());return a; },
            cost: new ExpantaNum(2e22),
            unlocked() { return hasUpgrade('q',12) },
        },
        14: {
            title: "就这？远远没到无限",
            description: "指数提升指数获取指数",
            effect() {
                let eff = player.q.points.add(10).log10().pow(0.15).div(2).add(0.5).min(3e5)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect());return a; },
            cost: new ExpantaNum(1e145),
            unlocked() { return hasUpgrade('q',13) },
        },
        15: {
            title: "OoM起飞",
            description: "旋律提升第一个升级效果",
            effect() {
                let eff = player.points.add(10).log10().pow(0.375).div(4).add(0.75).min(3e5)
                if(hasUpgrade('q',23))eff=eff.pow(eff)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect());return a; },
            cost: new ExpantaNum("e616"),
            unlocked() { return hasUpgrade('q',14) },
        },
        16: {
            title: "不是指数吗？怎么成软上限了",
            description: "旋律提升旋律获取指数",
            effect() {
                let eff = player.points.add(10).log10().pow(0.225).div(5).add(0.8).min(3e5)
                if(hasUpgrade('q',24))eff=eff.pow(eff)
                if(hasUpgrade('q',26))eff=eff.pow(10)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect());return a; },
            cost: new ExpantaNum("e15480"),
            unlocked() { return hasUpgrade('q',15) },
        },
        21: {
            title: "OoM起飞^2",
            description: "旋律的软上限强度提升指数获取指数",
            effect() {
                let eff = hasMilestone('p',2)?player.q.bestu7eff:player.overflowStrength
                if(eff.gte(3e5))eff=n(10).pow(eff.log10().div(n(3e5).log10()).add(1).logBase(2).mul(n(3e5).log10()))
                if(eff.gte("ee7"))eff=n(10).pow(n(10).pow(eff.log10().log10().div(7).pow(0.125).mul(7)))
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect());let b=a;if(this.effect().gte(3e5))a=b+"（一重软上限）";if(this.effect().gte("ee7"))a=b+"（二重软上限）";return a; },
            cost: new ExpantaNum("e34150"),
            unlocked() { return hasUpgrade('q',16) },
        },
        22: {
            title: "OoM起飞^3",
            description: "指数提升旋律获取指数",
            effect() {
                let eff = player.q.points.add(10).log10().pow(0.4).div(1.6).add(0.375).min(3e5)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect());return a; },
            cost: new ExpantaNum("e52550"),
            unlocked() { return hasUpgrade('q',21) },
        },
        23: {
            title: "OoM起飞^4",
            description: "第五个升级的效果变为自己次方",
            cost: new ExpantaNum("e4388000"),
            unlocked() { return hasUpgrade('q',22) },
        },
        24: {
            title: "整数价格，爽！",
            description: "第六个升级的效果变为自己次方",
            cost: new ExpantaNum("e6e6"),
            unlocked() { return hasUpgrade('q',23) },
        },
        25: {
            title: "你要干什么？？？",
            description: "第二个升级的效果变为自己次方（但是有软上限，诶嘿）",
            cost: new ExpantaNum("e7523000"),
            unlocked() { return hasUpgrade('q',24) },
        },
        26: {
            title: "你要干什么？？？？？",
            description: "第六个升级的效果变为十次方",
            cost: new ExpantaNum("e213210000"),
            unlocked() { return hasUpgrade('q',25) },
        },
        31: {
            title: "给我退，退，退",
            description: "点数获取指数^10",
            cost: new ExpantaNum("e2.2819e9"),
            unlocked() { return hasUpgrade('q',26) },
        },
        32: {
            title: "给我退，退，退^2",
            description: "点数获取指数^100",
            cost: new ExpantaNum("e4.042e14"),
            unlocked() { return hasUpgrade('q',31) },
        },
        33: {
            title: "资源来了吗？有点意思",
            description(){return "每秒获得1源点，基于源点增益点数获取指数（你有"+format(player.q.memories)+"源点）";},
            effect() {
                let eff = player.q.memories.add(1).pow(1.2)
                return eff
            },
            effectDisplay() { let a = "指数^" + format(this.effect());return a; },
            cost: new ExpantaNum("e4.1778e24"),
            unlocked() { return hasUpgrade('q',32) },
        },
        34: {
            title: "终于不用忍受非整数了",
            description: "旋律增加源点获取",
            effect() {
                let eff = player.points.add(1).log10().add(1).log10().add(1).pow(2.5)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum("e3e38"),
            unlocked() { return hasUpgrade('q',33) },
        },
        35: {
            title: "黑洞质量？",
            description: "源点增加源点获取",
            effect() {
                let eff = player.q.memories.add(1).log10().add(1).pow(4.5)
                if(hasUpgrade('q',42))eff=eff.pow(9.5)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum("ee49"),
            unlocked() { return hasUpgrade('q',34) },
        },
        36: {
            title: "指数的魅力",
            description(){return "解锁下一个子资源（二叉树）增加源点获取（你有"+format(player.q.bitree)+"二叉树）";},
            effect() {
                let eff = n(10).pow(player.q.bitree)
                if(hasUpgrade('p',12))eff=eff.pow(upgradeEffect('p',12))
                if(hasUpgrade('p',13))eff=eff.pow(1.2)
                if(hasChallenge('p',11))eff=eff.pow(5)
                if(eff.gte("ee3"))eff=n(10).pow(n(10).pow(eff.log10().log10().div(3).pow(0.35).mul(3)))
                if(eff.gte("ee5"))eff=n(10).pow(n(10).pow(eff.log10().log10().div(5).pow(hasUpgrade('q',51)?0.15:0.1).mul(5)))
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum("ee65"),
            unlocked() { return hasUpgrade('q',35) },
        },
        41: {
            title: "终焉之诗 「Chapter I」",
            description:"二叉树获取x10",
            effect() {
                let eff = n(10)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum("ee125"),
            unlocked() { return hasUpgrade('q',36) },
        },
        42: {
            title: "终焉之诗 「Chapter II」",
            description:"第17个升级的效果变为9.5次方",
            cost: new ExpantaNum("ee255"),
            unlocked() { return hasUpgrade('q',41) },
        },
        43: {
            title: "终焉之诗 「Chapter III」",
            description:"每秒获取1%的指数",
            cost: new ExpantaNum("e1.79769e308"),
            unlocked() { return hasUpgrade('q',42) },
        },
        44: {
            title: "终焉之诗 「Chapter IV」",
            description:"源点增加二叉树获取",
            effect() {
                let eff = player.q.memories.add(1).log10().add(1).log10().add(1).pow(2)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum("ee320"),
            unlocked() { return hasUpgrade('q',43) },
        },
        45: {
            title: "终焉之诗 「Chapter V」",
            description:"旋律增加二叉树获取",
            effect() {
                let eff = player.points.add(10).log10().pow(0.45)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum("ee360"),
            unlocked() { return hasUpgrade('q',44) },
        },
        46: {
            title: "终焉之诗 「Chapter Finale」",
            description(){return "解锁下一个子资源（无限）增加二叉树获取（你有"+format(player.q.inf)+"无限）";},
            effect() {
                let eff = n(10).pow(player.q.inf)
                if(eff.gte("ee3"))eff=n(10).pow(n(10).pow(eff.log10().log10().div(3).pow(0.35).mul(3)))
                if(eff.gte("ee5"))eff=n(10).pow(n(10).pow(eff.log10().log10().div(5).pow(0.1).mul(5)))
                if(eff.gte("ee30"))eff=n(10).pow(n(10).pow(eff.log10().log10().div(30).pow(0.02).mul(30)))
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum("ee500"),
            unlocked() { return hasUpgrade('q',45) },
        },
        51: {
            title: "「End」",
            description:"旋律增加无限获取，削弱二叉树效果软上限",
            effect() {
                let eff = player.points.add(10).log10().pow(0.3)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum("ee666"),
            unlocked() { return hasUpgrade('q',46) },
            style(){return{width:"720px"};},
        },
    },
    layerShown(){return true}
})
addLayer("p", {
tabFormat: {
   "升级": {
        content: [
   "main-display",
    "prestige-button",
    "resource-display",
    "upgrades",
],
    },
   "里程碑": {
        content: [
   "main-display",
    "prestige-button",
    "resource-display",
    "milestones",
],
unlocked(){return hasUpgrade('p',14)},
    },
   "挑战": {
        content: [
   "main-display","blank","challenges",
],
unlocked(){return hasMilestone('p',0)},
    },
    },
    name: "转生", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
        }
    },
    color: "#666EE6",
    branches:['q'],
    requires: function () {
        let a = new ExpantaNum("e476")
        return a
    }, // Can be a function that takes requirement increases into account
    resource: "记忆碎片", // Name of prestige currency
    baseResource: "log(旋律)", // Name of resource prestige is based on
    baseAmount() { return player.points.max(10).log10() }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new ExpantaNum(1/50), // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    passiveGeneration() {
        mult = n(0)
        return mult
    },
    effectDescription() {
        return "使指数层所有效果变为^"+format(layers.p.eff1())
    },
    eff1() {
        let a=n(1)
        return a
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    displayRow:999,
    hotkeys: [
        { key: "t", description: "T：获得超越点", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    challenges:{
        11:{
            name:"指数塔的坍塌",
            challengeDescription:"旋律获取的指数塔层数被开根，之后+2，不会超过原本的获取",
            goalDescription:"e3e55指数",
            rewardDescription:"无限获取x10，二叉树效果^5，源点获取^1.025",
            canComplete(){
                return player.q.points.gte("e3e55")
            },
            unlocked(){
                return hasMilestone('p',0);
            },
        },
        12:{
            name:"正弦与余弦",
            challengeDescription:"基于开始挑战经过时间的正弦加成旋律获取，余弦加成指数获取",
            goalDescription:"e1e476旋律",
            rewardDescription:"记忆碎片升级5的效果不管在不在挑战中都变为四次方",
            canComplete(){
                return player.points.gte("ee476")
            },
            unlocked(){
                return hasMilestone('p',1);
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "累计10记忆碎片",
            effectDescription: "解锁记忆挑战",
            done() { return player.p.total.gte(10) }
        },
        1: {
            requirementDescription: "在第一个挑战中获得e126000旋律",
            effectDescription: "解锁第二个挑战，旋律获取x25，指数获取在最后x500",
            done() { return inChallenge('p',11)&&player.points.gte("e126000") }
        },
        2: {
            requirementDescription: "在第二个挑战中获得e1048旋律",
            effectDescription: "第7个升级的效果基于本次记忆碎片重置的最佳效果",
            done() { return inChallenge('p',12)&&player.points.gte("e1048") }
        },
        3: {
            requirementDescription: "获得ee500旋律",
            effectDescription: "解锁未定义空间",
            done() { return player.points.gte("ee500") }
        },
    },
    upgrades: {
        11: {
            title: "记忆......",
            description: "旋律、指数、源点、二叉树、无限获取x4，升级“憋笑”效果^2",
            cost: new ExpantaNum(1),
            unlocked() { return true },
        },
        12: {
            title: "世界......",
            description: "指数获取^1.1，基于记忆碎片提升二叉树效果",
            effect() {
                let eff = (hasUpgrade('p',21)?player.p.total:player.p.points).add(2).pow(0.23)
                if(eff.gte(5))eff=eff.div(5).pow(0.138).mul(5)
                if(eff.gte(120))eff=eff.div(120).add(1).logBase(2).mul(120)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect());return a; },
            cost: new ExpantaNum(1),
            unlocked() { return hasUpgrade('p',11) },
        },
        13: {
            title: "永恒是什么......",
            description: "源点获取x40，二叉树效果^1.2，保留每秒获取1%的指数",
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade('p',12) },
        },
        14: {
            title: "我们的未来......",
            description: "基于记忆碎片提升源点、二叉树、无限获取",
            effect() {
                let eff =(hasUpgrade('p',21)?player.p.total:player.p.points).add(2).pow(1.2)
                if(eff.gte(60))eff=eff.div(60).pow(0.25).mul(60)
                if(eff.gte(3600))eff=eff.div(3600).add(1).logBase(2).mul(3600)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade('p',13) },
        },
        15: {
            title: "再一次......",
            description: "基于本层升级数量提升源点、无限获取，在挑战中效果变为三次方",
            effect() {
                let eff = n(player.p.upgrades.length).max(1)
                if(hasChallenge('p',12))eff=eff.pow(4)
                else if(player.p.activeChallenge)eff=eff.pow(3)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(5),
            unlocked() { return hasUpgrade('p',14)&&hasChallenge('p',11) },
        },
        16: {
            title: "一定要......",
            description: "自动购买指数层升级",
            cost: new ExpantaNum(20),
            unlocked() { return hasUpgrade('p',15)&&hasChallenge('p',12) },
        },
        21: {
            title: "全部的记忆",
            description: "第2、4个记忆碎片升级基于总记忆碎片，第1个升级效果再生效一次",
            cost: new ExpantaNum(50),
            unlocked() { return hasUpgrade('p',16) },
        },
    },
    layerShown() { return hasUpgrade('q',51)||player.p.unlocked }
})
