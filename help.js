function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return m.toStringWithDecimalPlaces(precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}

function format(decimal, precision = 2, small) {
    small = false
    decimal = new Decimal(decimal)
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (decimal.gte("eeee1000")) {
        var slog = decimal.slog()
        if (slog.gte(1e6)) return "F" + format(slog.floor())
        else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    }
    else if (decimal.gte("1e10000000")) return exponentialFormat(decimal, 0, false)
    else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
    else if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    decimal = invertOOM(decimal)
    let val = ""
    if (decimal.lt("1e1000")){
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else   
        return format(decimal, precision) + "⁻¹"

}

function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}

function update() {
    var tmp = parseInt(JSON.parse(atob(localStorage.c2nv4in9eusojg59bmo)).m.points)
    var tmp2 = parseInt(JSON.parse(atob(localStorage.c2nv4in9eusojg59bmo)).pm.points)
    var tmp3 = parseInt(JSON.parse(atob(localStorage.c2nv4in9eusojg59bmo)).cm.points)
    var tmp4 = parseInt(JSON.parse(atob(localStorage.c2nv4in9eusojg59bmo)).sp.sparkMilestones)
    var tmp5 = parseInt(JSON.parse(atob(localStorage.c2nv4in9eusojg59bmo)).m.pseudoBuys.length)
    var player1 = 186
    var player2 = 16
    var player3 = 5
    var player4 = 4
    var player5 = 19
    var playerTotal = player1+player2+player3+player4+player5
    var total=tmp+tmp2+tmp3+tmp4+tmp5
	$("#milestone1").html(`Current milestones: ${total} / ${playerTotal} (Currently: `+(tmp==player1?`<span style='color:gold;'>[${tmp} / ${player1} Normal]</span>, `:`[${tmp} / ${player1} Normal], `)+(tmp5==player5?`<span style='color:gold;'>[${tmp5} / ${player5} Malware]</span>, `:`[${tmp5} / ${player5} Malware], `)+(tmp2==player2?`<span style='color:gold'>[${tmp2} / ${player2} Prestige]</span>, `:`[${tmp2} / ${player2} Prestige], `)+(tmp3==player3?`<span style='color:gold'>[${tmp3} / ${player3} Corrupted]</span>, `:`[${tmp3} / ${player3} Corrupted], `)+(tmp4==player4?`<span style='color:gold'>[${tmp4} / ${player4} Spark]</span>)`:`[${tmp4} / ${player4} Spark])`));
    $("#milestone_progressbar").html(`<div style="border:1px solid white; width:500px; color: white; font-size:22px; height:25px; background:linear-gradient(to right,#AB00A4 ${(Math.max(0,(total/playerTotal)*500))}px,rgb(30, 30, 30) 0px);">${format((total/playerTotal)*100,2)}%</div>`)
}
setInterval(update,1000)