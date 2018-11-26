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