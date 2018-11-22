import { commonParams } from 'api/config'
import axios from 'axios'
export function getToplists() {
    const url = '/api/getToplists'

    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        uin: 0,
        notice: 0,
        sortId: 5,
        needNewCode: 1,
        categoryId: 10000000,
        format: 'json'
    })
    return axios.get(url, { params: data }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getToplistSongs(id) {
    const url = '/api/getToplistSongs'
    const data = Object.assign({}, commonParams, {
        uin: 0,
        format: 'json',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid: id
    })
    return axios.get(url, { params: data }).then((res) => {
        return Promise.resolve(res.data)
    })
}