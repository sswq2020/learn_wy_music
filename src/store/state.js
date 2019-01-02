import { playMode } from 'common/js/config'
import { loadSearch } from 'common/js/cache'
const state = {
    singer: {}, // 歌手
    playing: false, // 播放和暂停
    fullScreen: false, // 播放器全屏和缩放
    playlist: [], // 播放列表
    sequenceList: [], // 播放顺序列表
    mode: playMode.sequence, // 播放模式
    currentIndex: -1, // 当前播放哪首歌,
    disc: {}, // 歌单
    toplist: {}, // 排行耪
    searchHistroy: loadSearch() // 搜素过的历史,从本地localStorage读取
}

export default state