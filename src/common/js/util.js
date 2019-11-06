import _ from 'lodash'
import {getPurlUrl, postPurlUrl} from 'api/song'

export function shuffle(arr) {
    let _arr = arr.slice() // 小技巧相当于原数组的拷贝,原数组不变
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0, i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
    }
    return _arr
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function _debounce(func, delay) {
    let timer
    return function(...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

function getSongMid(list, needArray = false) {
    let ret = []
    if (!_.isArray(list)) {
        list = [list]
    }
    /* 对应三种不同的数据结构 */
    list.forEach(item => {
        let {songmid, musicData} = item
        if (songmid) {
            ret.push(songmid)
        } else if (musicData && musicData.songmid) {
            ret.push(musicData.songmid)
        }
    })
    if (needArray) {
        return ret
    } else {
        return ret.join()
    }
}

function inSertUrl(origin = [], target = [], props) {
    for (let i = 0; i < origin.length; i++) {
        let {musicData} = origin[i]
        if (!musicData) {
            origin[i][props] = target[i]
        } else {
            musicData[props] = target[i]
        }
    }
    return origin
}

export async function getUrlSongList (songlist) {
    let songUrlList
    let res = await getPurlUrl(getSongMid(songlist))
    if (res.errno === 0) {
        songUrlList = res.data
    }
    songlist = inSertUrl(songlist, songUrlList, 'url')
    return songlist
}

export async function getIncludeUrlSongList(songlist) {
    let songUrlList = []
    let flag = false
    while (!flag) {
        let res = await postPurlUrl(getSongMid(songlist, true))
        if (res.code === 0 && res.req_0 && res.req_0.data && res.req_0.data.servercheck) {
            const list = res.req_0.data.midurlinfo
            list && list.length && list.forEach((item) => {
                songUrlList.push(item.purl || '')
            })
            flag = true
        }
    }
    songlist = inSertUrl(songlist, songUrlList, 'url')
    return songlist
}

/**
 * @author sswq
 * @param list {Array} 歌曲数组
 * @param song {Object} 查找的song对象
 * @returns {Number} 所在歌曲位置
 * @description 总是插入数组的第一个,同时长度超过最大限制，会删除最后一个
 * */
export function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}
