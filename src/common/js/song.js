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
        url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=8773122160&vkey=7955711D9BA170201E81B77C1E3D5D9FE9957195E0027C4E3D1A3F243EBFFD6F264CB3F0B79D6E71072CF68FD9E677E2464F8BFC24A019EB&uin=0&fromtag=38`
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