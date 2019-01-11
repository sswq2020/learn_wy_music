import { commonParams } from 'api/config'
import axios from 'axios'

export function getLyric(mid) {
    const url = '/api/lyric'
    const data = Object.assign({}, commonParams, {
        songmid: mid,
        pcachetime: +new Date(),
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        format: 'json'
    })
    return new Promise((resolve, reject) => {
        axios.get(url, { params: data }).then((res) => {
            var ret = res.data // 这个接口原来是jsonp格式,返回的是jsonp得格式;返回值是res => MusicJsonCallback({retcode: 0, code: 0, subcode: 0,…});要对其进行正则表达式切割
            if (typeof ret === 'string') {
                var reg = /^\w+\(({[^()]+})\)$/
                var matches = ret.match(reg)
                if (matches) {
                    ret = JSON.parse(matches[1])
                }
            }
            resolve(ret)
        }).catch((err) => {
            reject(err)
        })
    })
}

/**
 * @author sswq
 * @description 抓取QQ歌曲url的接口,因为经常变化,不能写死
 * @param ids {String} songmid的以逗号分隔 songmid1,songmid2,songmid3
 */
export function getPurlUrl(ids) {
    const url = '/api/getPurlUrl' + '/' + ids
    return axios.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}
