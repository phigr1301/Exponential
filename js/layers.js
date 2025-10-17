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
            name: "指数的世界",
            done() { return player.q.points.gte("ee10") },
            onComplete(){player.AC.points=player.AC.points.add(1)},
            tooltip: "获得ee10指数",
            textStyle: { 'color': '#FFDD33' },
        },
        12: {
            name: "回忆的碎片",
            done() { return player.p.points.gte(1) },
            onComplete(){player.AC.points=player.AC.points.add(1)},
            tooltip: "获得1记忆碎片",
            textStyle: { 'color': '#FFDD33' },
        },
        13: {
            name: "未知的空间",
            done() { return hasMilestone('p',3)},
            onComplete(){player.AC.points=player.AC.points.add(1)},
            tooltip: "解锁未定义空间",
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
        if(hasMilestone('p',2))player.q.bestu7eff=player.q.bestu7eff.max(player.overflowStrength2)
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
                let eff = hasMilestone('p',2)?player.q.bestu7eff:player.overflowStrength2
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
                eff=eff.pow(tmp.x.blockEff)
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
    baseResource: function(){return  tmp.p.baseAmount.gte("1e700")?"log(旋律)（已达软上限）":"log(旋律)"}, // Name of resource prestige is based on
    baseAmount() {
        let a=player.points.max(10).log10() 
        if(a.gte("1e700"))a=n(10).pow(a.log10().div(700).pow(0.75).mul(700))
        if(a.gte("ee4"))a=n(10).pow(n(10).pow(a.log10().log10().div(4).pow(0.4).mul(4)))
        return a
    },
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new ExpantaNum(1/50), // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        mult=mult.mul(tmp.x.crystalEff)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    passiveGeneration() {
        mult = n(0)
        if(hasMilestone('p',6))mult=n(0.025)
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
            name:"指数塔的崩塌",
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
        4: {
            requirementDescription: "累计1e4记忆碎片",
            effectDescription: "无限残念获取x1.5，解锁一个升级",
            done() { return player.p.total.gte(1e4) },
            unlocked(){return hasMilestone('p',3)}
        },
        5: {
            requirementDescription: "累计5e4记忆碎片 & ee600旋律",
            effectDescription: "星体晶石获取x4，时空方块效果更好，解锁一个升级",
            done() { return player.p.total.gte(5e4)&&player.points.gte("ee600") },
            unlocked(){return hasMilestone('p',3)}
        },
        6: {
            requirementDescription: "累计3e8记忆碎片",
            effectDescription: "每秒获得2.5%的记忆碎片",
            done() { return player.p.total.gte(3e8) },
            unlocked(){return hasMilestone('p',3)}
        },
        7: {
            requirementDescription: "获得ee1000旋律",
            effectDescription: "解锁空间质量",
            done() { return player.points.gte("ee1000") }
        },
        8: {
            requirementDescription: "累计1e262记忆碎片",
            effectDescription: "质量获取^1.1",
            done() { return player.p.total.gte(1e262) }
        },
        9: {
            requirementDescription: "累计1e281记忆碎片",
            effectDescription: "质量获取^1.1",
            done() { return player.p.total.gte(1e281) }
        },
        10: {
            requirementDescription: "累计1e303记忆碎片",
            effectDescription: "恭喜通关！",
            done() { return player.p.total.gte(1e303) }
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
        22: {
            title: "来点直接的增益",
            description: "质量获取x1e100，升级“质量压缩 V”的效果再次变为1.8次方",
            cost: new ExpantaNum(1e30),
            unlocked() { return hasUpgrade('p',21)&&hasMilestone('p',7) },
        },
        23: {
            title: "不会发散吧？",
            description: "质量获取x1e1000，升级“质量压缩 V”的效果再次变为3次方",
            cost: new ExpantaNum(5e38),
            unlocked() { return hasUpgrade('p',22) },
        },
        24: {
            title: "真的不会发散吗？",
            description: "质量获取x1e10000，升级“质量压缩 V”的效果再次变为5次方",
            cost: new ExpantaNum(1e55),
            unlocked() { return hasUpgrade('p',23) },
        },
        25: {
            title: "我能感觉到就在发散的边缘",
            description: "质量获取^10",
            cost: new ExpantaNum(1e75),
            unlocked() { return hasUpgrade('p',24) },
        },
        26: {
            title: "最后的QoL",
            description: "自动购买质量可购买，质量获取^1.5",
            cost: new ExpantaNum(1e195),
            unlocked() { return hasUpgrade('p',25) },
        },
    },
    layerShown() { return hasUpgrade('q',51)||player.p.unlocked }
})
const EXPLORE_LENGTH=10
const EXPLORE_TEXT=["暂无","你在未定义空间随意乱逛，看到了很多奇异的景象。","你在空间的边缘捡到了一块星体晶石，获得星体晶石x1。","空间的中心隐藏着某人的念想，获得无限残念x1。","时空凝聚而成的方块浮现在你眼前，获得时空方块x1。","由于未定义空间什么都会发生，你在一分钟内探索了3.103827K64座指数塔。","你惊讶的发现这个空间中也有RBNR，但可惜只做到乘法能量。","你Stack Overflow了，接下来10秒无法继续探索。","你用力打碎了f_{BO}(10)秒的时间墙。","你发现这个空间运行的时间复杂度是O(n!)。","有人告诉你探索这个空间一共有10种不同的消息。"]
const BLOCK_GAIN=[0,0,0,0,1,0,0,0,0,0,0]
const CRYSTAL_GAIN=[0,0,1,0,0,0,0,0,0,0,0]
const THOUGHT_GAIN=[0,0,0,1,0,0,0,0,0,0,0]
const EXPLORE_INTERVAL=[0,1,1,1,1,1,1,10,1,1,1]
addLayer("x", {
tabFormat: {
   "里程碑": {
        content: [
   "prestige-button",
   "blank",
    function(){return(player.x.unlocked?"milestones":"blank");},
],
   unlocked() { return player.x.unlocked },
    },
   "???": {
        content: [
   "prestige-button",
],
   unlocked() { return !player.x.unlocked },
    },
   "空间": {
        content: [
    ["display-text","欢迎来到未定义空间。在这里，你遇到的一切都是未定义的，因此你可能看到如“QqQe308倒拔垂杨柳”之类的奇异景象。"],
    "blank",
    ["display-text","本层级有三种资源：时空方块、星体晶石、无限残念。可以通过探索空间获取。"],
    "blank",
    ["display-text",function(){return "<h2>你有<span style=\"color:#e1a043\">"+format(player.x.block)+"</span>时空方块，源点效果<span>^"+format(tmp.x.blockEff)+"</span></h2><br><h2>你有<span style=\"color:#3fe769\">"+format(player.x.crystal)+"</span>星体晶石，记忆碎片获取<span>x"+format(tmp.x.crystalEff)+"</span></h2><br><h2>你有<span style=\"color:#a267e5\">"+format(player.x.thought)+"</span>无限残念，用于购买升级</h2>"}],
    "blank",
    ["clickable",11],
    "blank",
    ["display-text",function(){let a="<h3>探索记录: </h3>";for(i=0;i<=4;i++)a+=("<br>"+(i+1)+"."+EXPLORE_TEXT[player.x.lastExplore[i]]);return a}]
],
   unlocked() { return player.x.unlocked },
    },
   "升级": {
        content: [
    ["display-text","欢迎来到未定义空间。在这里，你遇到的一切都是未定义的，因此你可能看到如“QqQe308倒拔垂杨柳”之类的奇异景象。"],
    "blank",
    ["display-text","本层级有三种资源：时空方块、星体晶石、无限残念。可以通过探索空间获取。"],
    "blank",
    ["display-text",function(){return "<h2>你有<span style=\"color:#a267e5\">"+format(player.x.thought)+"</span>无限残念，用于购买升级</h2>"}],
    "blank",
    "upgrades",
],
   unlocked() { return hasMilestone('x',0) },
    },
   "质量": {
        content: [
    ["display-text","达到ee1020旋律后，基于旋律和三种资源自动获取空间质量。"],
    "blank",
    ["display-text",function(){return "<h2>你有<span style=\"color:#f3f3f3\">"+formatMass(player.x.mass)+"</span>空间质量<span>(+"+(player.x.mass.gte(10)&&tmp.x.massGain.div(20).gte(player.x.mass.mul(1e5))?format(tmp.x.massGain.div(20).log10().sub(player.x.mass.log10()).mul(20))+"OoMs":formatMass(tmp.x.massGain))+"/s)</span>，三种资源获取<span>x"+format(tmp.x.massEff)+"</span></h2>"}],
    "blank",
    "buyables",
],
   unlocked() { return hasMilestone('p',7) },
    },
    },
    name: "未定义空间", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ø", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
            block:new ExpantaNum(0),
            crystal:new ExpantaNum(0),
            thought:new ExpantaNum(0),
            ecd:0,
            lastExplore:[0,0,0,0,0],
            mass:new ExpantaNum(0),
        }
    },
    color: function(){
        if(player.x.unlocked)return "#E0E4E9"
        return "#D018EF"
    },
    branches:['q'],
    requires: function () {
        let a = new ExpantaNum("ee500")
        if(player.x.unlocked)a=n(1e309)
        return a
    }, // Can be a function that takes requirement increases into account
    resource: "记忆碎片", // Name of prestige currency
    baseResource: "旋律", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    resetsNothing(){
        return true
    },
    tooltip(){
        return "未定义空间"
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    displayRow:1000,
    prestigeButtonText(){
        if(player.x.unlocked)return "未定义空间已开启"
        return "开启未定义空间"
    },
    blockEff(){
        if(!player.x.unlocked)return n(1)
        let a=player.x.block.add(1).logBase(2).add(1).pow(0.0721)
        if(hasMilestone('p',5))a=a.sub(1).mul(1.2).add(1)
        if(hasUpgrade('x',16))a=a.sub(1).mul(upgradeEffect('x',16)).add(1)
        if(hasUpgrade('x',21))a=a.sub(1).mul(upgradeEffect('x',21)).add(1)
        if(hasUpgrade('x',22))a=a.sub(1).mul(upgradeEffect('x',22)).add(1)
        if(hasUpgrade('x',23))a=a.sub(1).mul(upgradeEffect('x',23)).add(1)
        if(hasUpgrade('x',24))a=a.sub(1).mul(upgradeEffect('x',24)).add(1)
        if(hasMilestone('x',3))a=a.sub(1).mul(4/3).add(1)
        return a
    },
    crystalEff(){
        if(!player.x.unlocked)return n(1)
        let a=player.x.crystal.add(1).pow(0.22222)
        if(hasUpgrade('x',11))a=player.x.crystal.add(1).pow(n(1).sub(player.x.crystal.add(2).logBase(2).logBase(2).mul(0.18)).max(0.34))
        if(hasMilestone('x',3))a=a.pow(4/3)
        return a
    },
    blockMult(){
        let a=n(1)
        if(hasUpgrade('x',12))a=a.mul(3)
        if(hasUpgrade('x',13))a=a.mul(upgradeEffect('x',13))
        if(hasUpgrade('x',14))a=a.mul(upgradeEffect('x',14))
        if(hasUpgrade('x',15))a=a.mul(upgradeEffect('x',15))
        a=a.mul(tmp.x.massEff)
        return a
    },
    crystalMult(){
        let a=n(1)
        if(hasUpgrade('x',13))a=a.mul(upgradeEffect('x',13))
        if(hasMilestone('p',5))a=a.mul(4)
        if(hasUpgrade('x',14))a=a.mul(upgradeEffect('x',14))
        if(hasUpgrade('x',15))a=a.mul(upgradeEffect('x',15))
        a=a.mul(tmp.x.massEff)
        return a
    },
    thoughtMult(){
        let a=n(1)
        if(hasMilestone('p',4))a=a.mul(1.5)
        if(hasUpgrade('x',13))a=a.mul(upgradeEffect('x',13))
        if(hasUpgrade('x',14))a=a.mul(upgradeEffect('x',14))
        if(hasUpgrade('x',15))a=a.mul(upgradeEffect('x',15))
        a=a.mul(tmp.x.massEff)
        return a
    },
    massEff(){
        if(!hasMilestone('p',7))return n(1)
        let a=player.x.mass.add(1)
        let ex=n(3)
        if(gba('x',11)>0)ex=ex.add(buyableEffect('x',11))
        if(hasUpgrade('x',35))ex=ex.mul(1.5)
        if(a.gte(10))a=a.div(10).add(1).logBase(2).pow(ex).mul(10)
        return a
    },
    massGain(){
        if(!hasMilestone('p',7))return n(0)
        if(player.points.lt("ee1020"))return n(0)
        let a=player.points.log10().log10().div(1020).sub(1).mul(15)
        a=a.mul(player.x.block.add(2).logBase(2))
        a=a.mul(player.x.crystal.add(2).logBase(2))
        a=a.mul(player.x.thought.add(2).logBase(2))
        a=a.div(1000)
        if(gba('x',12)>0)a=a.mul(buyableEffect('x',12))
        if(hasUpgrade('x',25))a=a.mul(upgradeEffect('x',25))
        if(hasUpgrade('x',26))a=a.mul(upgradeEffect('x',26))
        if(hasUpgrade('x',31))a=a.mul(4e5)
        if(hasUpgrade('x',32))a=a.mul(upgradeEffect('x',32))
        if(hasUpgrade('p',22))a=a.mul(1e100)
        if(hasUpgrade('p',23))a=a.mul("ee3")
        if(hasUpgrade('p',24))a=a.mul("ee4")
        if(hasUpgrade('p',25))a=a.pow(10)
        if(hasUpgrade('p',26))a=a.pow(1.5)
        if(hasMilestone('p',8))a=a.pow(1.1)
        if(hasMilestone('p',9))a=a.pow(1.1)
        return a
    },
    update(diff){
        if(player.x.ecd>0)player.x.ecd-=diff
        if(player.x.ecd<0)player.x.ecd=0
        if(hasUpgrade('x',25)&&player.x.ecd==0)clickClickable('x',11)
        if(hasMilestone('p',7))player.x.mass=player.x.mass.add(tmp.x.massGain.mul(diff))
        if(hasUpgrade('p',26)){
            buyBuyable('x',11);
            buyBuyable('x',12);
        }
    },
    hotkeys: [
    ],
    clickables:{
        11:{
            title:"探索未定义空间",
            display(){return player.x.ecd==0?"当前可探索":"请等待"+player.x.ecd+"秒"},
            canClick(){return player.x.ecd==0},
            onClick(){
                let x=Math.floor(Math.random()*EXPLORE_LENGTH+1)
                if(hasMilestone('x',1)){
                    for(i=1;i<=(hasMilestone('x',4)?8:3);i++)if(x<2||x>4)x=Math.floor(Math.random()*EXPLORE_LENGTH+1)
                    for(i=1;i<=(hasMilestone('x',4)?2:1);i++)if(x==7)x=Math.floor(Math.random()*EXPLORE_LENGTH+1)
                }
                for(i=4;i>=1;i--)player.x.lastExplore[i]=player.x.lastExplore[i-1]
                player.x.lastExplore[0]=x
                player.x.block=player.x.block.add(player.x.block.max(player.x.crystal).max(player.x.thought).sub(player.x.block).mul(0.1).mul(BLOCK_GAIN[x]))
                player.x.crystal=player.x.crystal.add(player.x.block.max(player.x.crystal).max(player.x.thought).sub(player.x.crystal).mul(0.1).mul(CRYSTAL_GAIN[x]))
                player.x.thought=player.x.thought.add(player.x.block.max(player.x.crystal).max(player.x.thought).sub(player.x.thought).mul(0.1).mul(THOUGHT_GAIN[x]))
                player.x.block=player.x.block.add(tmp.x.blockMult.mul(BLOCK_GAIN[x]))
                player.x.crystal=player.x.crystal.add(tmp.x.crystalMult.mul(CRYSTAL_GAIN[x]))
                player.x.thought=player.x.thought.add(tmp.x.thoughtMult.mul(THOUGHT_GAIN[x]))
                player.x.ecd=EXPLORE_INTERVAL[x]
            },
            style(){return{width:"300px"};},
        },
    },
    milestones: {
        0: {
            requirementDescription: "获得10无限残念",
            effectDescription: "解锁残念升级",
            done() { return player.x.thought.gte(10) }
        },
        1: {
            requirementDescription: "1种资源达到1e4",
            effectDescription: "发现资源的概率提升，Stack Overflow的概率降低",
            done() { return player.x.block.gte(1e4)||player.x.crystal.gte(1e4)||player.x.thought.gte(1e4) }
        },
        2: {
            requirementDescription: "1种资源达到1e6",
            effectDescription: "小幅增加较低的资源获取",
            done() { return player.x.block.gte(1e6)||player.x.crystal.gte(1e6)||player.x.thought.gte(1e6) }
        },
        3: {
            requirementDescription: "1种资源达到1e8",
            effectDescription: "增强前2种资源的效果和第3个升级的效果",
            done() { return player.x.block.gte(1e8)||player.x.crystal.gte(1e8)||player.x.thought.gte(1e8) },
        },
        4: {
            requirementDescription: "1种资源达到1e12",
            effectDescription: "发现资源的概率提升，Stack Overflow的概率降低",
            done() { return player.x.block.gte(1e12)||player.x.crystal.gte(1e12)||player.x.thought.gte(1e12) },
        },
    },
    buyables:{
        11:{
            title:"质量增强",
            display(){return"加强质量的效果指数<br>当前：+"+format(this.effect())+"<br>价格："+formatMass(this.cost())+"<br>已购买："+format(gba('x',11))+"/1e8"},
            effect(x){
                let a= n(x).pow(0.5)
                if(a.gte(10))a=a.div(10).pow(0.4).mul(10)
                return a
            },
            cost(x){
                return n(2).pow(x.pow(2).add(x).div(2)).mul(1e4)
            },
            canAfford(){
                return player.x.mass.gte(this.cost())
            },
            buy(){
                if(!this.canAfford())return
                let amt=player.x.mass.div(1e4).logBase(2).mul(8).add(1).pow(0.5).add(1).div(2).floor().min(this.purchaseLimit())
                if(amt.lt(1e8))player.x.mass=player.x.mass.sub(this.cost(amt.sub(1)))
                sba('x',11,amt)
            },
            purchaseLimit(){
                return n(1e8)
            },
            unlocked(){return hasMilestone('p',7)},
        },
        12:{
            title:"质量凝聚",
            display(){return"增加质量获取<br>当前：x"+format(this.effect())+"<br>价格："+formatMass(this.cost())+"<br>已购买："+format(gba('x',12))+"/1e8"},
            effect(x){
                let base=n(2)
                if(hasUpgrade('x',33))base=base.mul(upgradeEffect('x',33))
                let a= base.pow(x)
                return a
            },
            cost(x){
                return n(10).pow(x.pow(2).add(x).div(2)).mul(1e5)
            },
            canAfford(){
                return player.x.mass.gte(this.cost())
            },
            buy(){
                if(!this.canAfford())return
                let amt=player.x.mass.div(1e5).logBase(10).mul(8).add(1).pow(0.5).add(1).div(2).floor().min(this.purchaseLimit())
                if(amt.lt(1e8))player.x.mass=player.x.mass.sub(this.cost(amt.sub(1)))
                sba('x',12,amt)
            },
            purchaseLimit(){
                return n(1e8)
            },
            unlocked(){return hasMilestone('p',7)},
        },
    },
    upgrades: {
        11: {
            title: "念想的彼端",
            description: "加强星体晶石的效果",
            cost: new ExpantaNum(10),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasMilestone('x',0) },
        },
        12: {
            title: "浓缩时空",
            description: "时空方块获取的倍率x3",
            cost: new ExpantaNum(20),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',11) },
        },
        13: {
            title: "存在证明",
            description: "无限残念加成所有3种资源获取",
            effect() {
                let eff = player.x.thought.add(2).logBase(2).pow(1.25)
                if(hasUpgrade('x',16))eff=eff.pow(1.15)
                if(hasUpgrade('x',21))eff=eff.pow(1.1)
                if(hasUpgrade('x',22))eff=eff.pow(1.05)
                if(hasUpgrade('x',23))eff=eff.pow(1.05)
                if(hasUpgrade('x',24))eff=eff.pow(1.05)
                if(hasMilestone('x',3))eff=eff.pow(1.3)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(25),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',12)&&hasMilestone('p',4) },
        },
        14: {
            title: "存在证明 II",
            description: "记忆碎片加成所有3种资源获取",
            effect() {
                let eff = player.p.points.add(2).logBase(2).pow(0.75)
                if(hasUpgrade('x',16))eff=eff.pow(1.15)
                if(hasUpgrade('x',21))eff=eff.pow(1.1)
                if(hasUpgrade('x',22))eff=eff.pow(1.05)
                if(hasUpgrade('x',23))eff=eff.pow(1.05)
                if(hasUpgrade('x',24))eff=eff.pow(1.05)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(300),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',13)&&hasMilestone('p',5) },
        },
        15: {
            title: "存在证明 III",
            description: "旋律加成所有3种资源获取",
            effect() {
                let eff = player.points.max(10).log10().max(10).log10().max(10).log10().pow(1.6)
                if(hasUpgrade('x',16))eff=eff.pow(1.15)
                if(hasUpgrade('x',21))eff=eff.pow(1.1)
                if(hasUpgrade('x',22))eff=eff.pow(1.05)
                if(hasUpgrade('x',23))eff=eff.pow(1.05)
                if(hasUpgrade('x',24))eff=eff.pow(1.05)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(2e4),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',14) },
        },
        16: {
            title: "浓缩星尘",
            description: "无限残念加成时空方块效果，3个“存在证明”升级效果^1.15",
            effect() {
                let eff = player.x.thought.add(10).log10().add(10).log10()
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(1e5),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',15) },
        },
        21: {
            title: "浓缩星尘 II",
            description: "记忆碎片加成时空方块效果，3个“存在证明”升级效果^1.1",
            effect() {
                let eff = player.p.points.add(10).log10().add(10).log10()
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(1e6),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',16) },
        },
        22: {
            title: "浓缩星尘 III",
            description: "旋律加成时空方块效果，3个“存在证明”升级效果^1.05",
            effect() {
                let eff = player.points.add(10).log10().add(10).log10().add(10).log10().add(10).log10().pow(1.35)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(3e6),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',21) },
        },
        23: {
            title: "浓缩星尘 IV",
            description: "源点加成时空方块效果，3个“存在证明”升级效果^1.05",
            effect() {
                let eff = player.q.memories.add(10).log10().add(10).log10().add(10).log10().pow(0.5)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(1e7),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',22) },
        },
        24: {
            title: "浓缩星尘 V",
            description: "星体晶石加成时空方块效果，3个“存在证明”升级效果^1.05",
            effect() {
                let eff = player.x.thought.add(10).log10().add(10).log10().pow(0.45)
                if(hasUpgrade('x',31))eff=eff.pow(14/9)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(3e7),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',23) },
        },
        25: {
            title: "质量压缩",
            description: "记忆碎片加成空间质量获取，自动探索",
            effect() {
                let eff = player.p.points.add(10).log10().pow(0.8)
                if(hasUpgrade('x',26))eff=eff.pow(1.35)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(1e15),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',24)&&hasMilestone('p',7) },
        },
        26: {
            title: "质量压缩 II",
            description: "本层的升级数量加成空间质量获取，前一个升级效果更强",
            effect() {
                let eff = n(2).pow(player.x.upgrades.length/2)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(5e16),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',25) },
        },
        31: {
            title: "质量压缩 III",
            description: "空间质量获取x4e5，“浓缩星尘 V”更强",
            cost: new ExpantaNum(1e18),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',26) },
        },
        32: {
            title: "质量压缩 IV",
            description: "空间质量加成空间质量获取",
            effect() {
                let eff = n(10).pow(player.x.mass.add(1).log10().pow(0.85)).min("ee9")
                if(hasUpgrade('x',34))eff=eff.pow(1.25).min("ee9")
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(2e20),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',31) },
        },
        33: {
            title: "质量压缩 V",
            description: "记忆碎片加成可购买“质量凝聚”的底数",
            effect() {
                let eff = player.p.points.add(10).log10().pow(0.4)
                if(hasUpgrade('x',36))eff=eff.pow(2.5)
                if(hasUpgrade('p',22))eff=eff.pow(1.8)
                if(hasUpgrade('p',23))eff=eff.pow(3)
                if(hasUpgrade('p',24))eff=eff.pow(5)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(3e25),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',32) },
        },
        34: {
            title: "质量压缩 VI",
            description: "“质量压缩 IV”的效果变为1.5次方",
            cost: new ExpantaNum(1e27),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',33) },
        },
        35: {
            title: "存在证明 IV",
            description: "空间质量效果的指数x1.5",
            cost: new ExpantaNum(1e29),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',34) },
        },
        36: {
            title: "质量压缩 VII",
            description: "“质量压缩 V”的效果变为2.5次方",
            cost: new ExpantaNum(3e38),
            currencyDisplayName:"无限残念",
            currencyInternalName:"thought",
            currencyLayer:"x",
            unlocked() { return hasUpgrade('x',35) },
        },
    },
    layerShown() { return hasMilestone('p',3)||player.x.unlocked }
})
