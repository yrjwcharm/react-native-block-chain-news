/**
 * User: puti.
 * Time: 2017/12/10 上午9:34.

 */


import {Toast} from "teaset";
export class StringUtils {
    //验证身份证号
    static isIdCard(cardNum, tip){
        let idCardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (!idCardReg.test(cardNum)) {
            Toast.message(tip ? tip : '请检查身份证号码是否正确');
            return false;
        } else {
            return true;
        }
    }

    /**
     * 判断是否是手机号
     * @param mobile
     * @returns {boolean}
     */
    static isMobile(mobile) {
            let isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
            let isMob=/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
            return (isMob.test(mobile)||isPhone.test(mobile));


    }
    static isEmail(email){
        let reg  = /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
        if(reg.test(email)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 表单手机号验证过程
     * @param mobile  手机号
     * @returns {boolean}  为true进行下一步
     */
    static checkMobile(mobile) {
        if (this.isEmpty(mobile)) {
            Toast.info('请输入手机号');
            return false;
        }
        if (!this.isMobile(mobile)) {
            Toast.info('请输入正确的手机号');
            return false;
        }
        return true
    }

    /**
     * 表单手机号验证过程
     * @param mobile  手机号
     * @returns {boolean}  为true进行下一步
     */
    static checkPassword(password) {
        if (this.isEmpty(password)) {
            Toast.fail('请输入密码');
            return false;
        }
        if (password.length < 6) {
            Toast.fail('密码不能少于6位');
            return false;
        }
        return true
    }

    /**
     * 检测字符串是否为空
     * @param s
     * @returns {boolean}
     */
    static isEmpty(s) {
        if (typeof(s) === "undefined") return true;
        if (s === null)return true;
        if (s === '')return true;
        return false;
    }


    /**
     * @param url
     * @param params
     * @returns {*}
     */
    static parseUrl(url, params) {
        if (params) {
            let paramsArray = [];
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + encodeURIComponent(params[key])));
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        return url;
    }

    static parseQuery(url) {
        let obj = {};
        if (url.indexOf('?') === -1)return obj;
        let start = url.indexOf("?") + 1;
        let str = url.substr(start);
        let arr = str.split("&");
        for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split("=");
            obj[arr2[0]] = decodeURIComponent(arr2[1]);
        }
        return obj;
    }


    /**
     * Js 数据容量单位转换(kb,mb,gb,tb)
     * @param bytes
     * @returns {*}
     */
    static bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        let k = 1000, // or 1024
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));

        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }


}

