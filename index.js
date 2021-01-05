import axios from 'axios';
import CryptoJS from 'crypto-js';

export function creatNetTool(UAID, apiSecret, baseUrl, tipsFunction, errorPath = ['data', 'error'], msgPath = ['data', 'msg']) {
    let rtContent = {UAID, apiSecret, baseUrl, tipsFunction, carryBody: {}};

    function setToken(token) {
        token && (rtContent['token'] = token);
    }

    function setCarryBody(carryBody) {
        if (carryBody && typeof carryBody === 'object') {
            rtContent['carryBody'] = carryBody
        }
    }

    function net(url, method, data = {}, sBack = callbackFn, eBack = callbackFn) {
        try {
            return new Promise((resolve, reject) => {
                method = method.toUpperCase();
                const pat = formatData(data);
                const TIME_STAMP = Math.round(Date.now() / 1000).toString();
                const POST_DATA = JSON.stringify(pat);
                const X_STR = ((method === 'GET' || method === 'DELETE') ? buildStr(pat) : POST_DATA) + '.' + TIME_STAMP;
                const X_SIGN = CryptoJS.HmacSHA256(X_STR, rtContent['apiSecret']).toString();
                const headers = {
                    "X-UAID": UAID,
                    "X-Timestamp": TIME_STAMP,
                    "X-Signature": X_SIGN
                };
                if (rtContent['token']) {
                    Object.assign(headers, {
                        authorization: (rtContent['token'])
                    })
                }
                const fetchObj = {url: `${baseUrl}${url}`, method, headers: headers};
                if ((method === 'GET') || (method === 'DELETE')) {
                    fetchObj.params = pat;
                } else {
                    fetchObj.data = pat;
                }
                axios(fetchObj).then((res) => {
                    if (getPath(errorPath, res) && tipsFunction && typeof tipsFunction === 'function') {
                        tipsFunction(getPath(msgPath, res));
                    }
                    resolve(res['data']);
                    sBack && sBack(res);
                }).catch((err) => {
                    resolve(err);
                    eBack && eBack(err)
                })
            })
        } catch (e) {
            console.log(e);
        }
    }

    function getPath(path, obj, defaultValue) {
        try {
            let ret = obj;
            path.forEach((keyName) => {
                ret = ret[keyName];
            });
            return ret || defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    function callbackFn() {
        return null;
    }

    function formatData(data) {
        try {
            let retData = {...rtContent['carryBody']};
            for (let key in data) {
                if (data[key] || data[key] === 0) {
                    retData[key] = data[key]
                }
            }
            return retData;
        } catch (e) {
            console.log(e);
            return data;
        }
    }

    const buildStr = data => {
        let signString = '';
        for (const item in data) {
            // eslint-disable-next-line no-prototype-builtins
            if (data.hasOwnProperty(item)) {
                signString += item + '=' + data[item] + '&';
            }
        }
        return signString.slice(0, -1);
    };

    return {
        net: net,
        setToken: setToken,
        setCarryBody: setCarryBody
    }
}
