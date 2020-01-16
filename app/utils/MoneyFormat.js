export  default  function unitConvert(num) {
    let moneyUnits = ["元", "万元", "亿元", "万亿"]
    let dividend = 10000
    let curentNum = parseFloat(num) //转换数字
    let curentUnit = moneyUnits[0] //转换单位
    for (let i = 0; i < 4; i++) {
        curentUnit = moneyUnits[i]
        if (strNumSize(curentNum) < 5) {
            break;
        }
        curentNum = curentNum / dividend
    }
    let m = {num: 0, unit: ""}
    m.num = curentNum.toFixed(2)
    m.unit = curentUnit
    return m
}

function strNumSize(tempNum) {
    let stringNum = tempNum.toString()
    let index = stringNum.indexOf(".")
    let newNum = stringNum
    if (index !== -1) {
        newNum = stringNum.substring(0, index)
    }
    return newNum.length
}
