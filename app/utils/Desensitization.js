//全局公用的对数据脱敏处理方法  参数可以是单个也可以是多个，但是格式必须是字符串
export default function publicDesensitization() {
    //先将内置的 arguments 转换为真正的数组
    let dataArr = Array.prototype.slice.apply(arguments);
    for (let i = 0; i < dataArr.length; i++) {
        let data = dataArr[i];
        // 正则判断返回相应数据
        if (data) {
            if (/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(data) || /^(13[0-9]|16[0-9]|19[0-9]|147|15[0-9]|17[6-8]|18[0-9])\d{8}|17[0-9]\d{8}$/.test(data) || /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/.test(data)) {
                //身份证号 || 手机号  ||  营业执照    前三后四
                data = data.substr(0, 3) + "****" + data.substr(-4);
            } else if (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(data)) {
                //邮箱号码  前二 后以 @ 分割
                data = data.substr(0, 2) + "****" + data.substr(data.indexOf('@'));
            } else if (/^\d{16}|\d{19}$/.test(data)) {
                //银行卡号  后四位
                data = "****" + data.substr(-4);
            } else if (data.indexOf('公司') > -1) {
                //企业名称  前二后四
                data = data.substr(0, 2) + "****" + data.substr(-4);
            } else {
                return;
            }
        }
        dataArr[i] = data;
    }

    return dataArr;
}
