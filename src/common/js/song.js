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
        //        url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
        url: `http://dl.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?guid=5487314232&vkey=D76B6ACBB47AEBBC3313BDECE89E7A022E00EC9579338AAB607DC22E4E526683461023648C48722110AD7F4E0B82055CF4261228F2667AF7&uin=0&fromtag=38`
    })
}

function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach(s => {
        ret.push(s.name)
    })
    return ret.join('/')
}