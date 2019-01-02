import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }

    async _getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }
        const res = await getLyric(this.mid)
        if (res.retcode === ERR_OK) {
            this.lyric = Base64.decode(res.lyric)
            return Promise.resolve(this.lyric)
        } else {
            return Promise.reject(new Error('no lyric'))
        }
    }
}
/**
 * url接口需要常常修改
 */
export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=5321669442&vkey=2910540038A2186E02A706427EC2A78A3AE4F0D7663F9A7AA17EC09388D73A4D6B21C4E461234305A99E434F8B6AF6A6806AFD32D764DE67&uin=0&fromtag=38`
    })
}

export function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach(s => {
        ret.push(s.name)
    })
    return ret.join('/')
}