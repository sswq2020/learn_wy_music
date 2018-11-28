import { commonParams } from 'api/config'
import axios from 'axios'

export function getHotKey() {
    const url = '/api/getHotKey'
    const data = Object.assign({}, commonParams, {
        uin: 0,
        platform: 'h5',
        notice: 0,
        needNewCode: 1,
        format: 'json'
    })
    return axios.get(url, { params: data }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function search(query, page, zhida) {
    const url = '/api/getSearch'
    const data = Object.assign({}, commonParams, {
        w: query,
        p: page,
        catZhida: zhida ? 1 : 0,
        zhidaqu: 1,
        t: 0,
        ie: 'utf-8',
        flag: 1,
        sem: 1,
        aggr: 0,
        perpage: 20,
        n: 20,
        remoteplace: 'txt.mqq.all',
        uid: 0,
        platform: 'h5',
        needNewCode: 1,
        format: 'json'
    })
    return axios.get(url, { params: data }).then((res) => {
        return Promise.resolve(res.data)
    })
}