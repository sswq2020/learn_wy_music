import originJSONP from 'jsonp'
/**
 * @param {String} url 请求地址
 * @param {Object} data 请求参数对象 data = {'key':value1, 'key2':value2}
 * @param {Object} option jsonp对象 options = {param: 'jsonpCallback'}
 */
export default function jsonp(url, data, option) {
    url += (url.indexOf('?' < 0) ? '?' : '&') + param(data)

    return new Promise((resolve, reject) => {
        originJSONP(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

function param(data) {
    let url = ''
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : ''
        url = url + `&${k}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : ''
}