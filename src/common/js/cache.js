import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_HISTORY = '__play_history__'
const PLAY_HISTORY_MAX_LENGTH = 100

const FAVORITE = '__favorite__'
const FAVORITE_MAX_LENGTH = 30

/**
 * @author sswq
 * @param arr {Array} 原始数组
 * @param val {Object} 插入的对象
 * @param maxLen {Number}最大限制的长度
 * @param cb {Function} Array.prototype.findIndex需要一个回调函数作为参数
 * @description 总是插入数组的第一个,同时长度超过最大限制，会删除最后一个
 * */
function insertArray(arr, val, maxLen, cb = () => {}) {
    const index = arr.findIndex(cb)
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}

/**
 * @author sswq
 * @param arr {Array} 原始数组
 * @param cb {Function} Array.prototype.findIndex需要一个回调函数作为参数
 * @description 删除数组的某一个
 * */
function deleteArray(arr, cb = () => {}) {
    const index = arr.findIndex(cb)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

// #region 保存搜索的关键字相关action
/**
 * @author sswq
 * @description 保存搜索的关键字,最多15条
 * */
export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, SEARCH_MAX_LENGTH, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

/**
 * @author sswq
 * @description 从LG里获取搜索的关键字
 * */
export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

/**
 * @author sswq
 * @description 删除搜索历史里的某一项
 * */
export function deleteSearchHistoryItem(history) {
    let searches = storage.get(SEARCH_KEY, [])
    deleteArray(searches, (item) => {
        return history === item
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

/**
 * @author sswq
 * @description 删除全部搜索历史里
 * */
export function deleteSearchHistoryAll() {
    storage.remove(SEARCH_KEY)
    return []
}
// #endregion

// #region 最近播放歌曲相关action
/**
 * @author sswq
 * @description 保存播放的歌曲目录，相当于最近播放的100首歌
 * */
export function savePlay(song) {
    let history = storage.get(PLAY_HISTORY, [])
    insertArray(history, song, PLAY_HISTORY_MAX_LENGTH, (item) => {
        return item.id === song.id
    })
    storage.set(PLAY_HISTORY, history)
    return history
}

/**
 * @author sswq
 * @description 从LG里获取最近播放的歌曲目录
 * */
export function loadPlayHistroy () {
    return storage.get(PLAY_HISTORY, [])
}
// #endregion

// #region 收藏歌曲相关action
/**
 * @author sswq
 * @description 收藏喜欢的歌曲目录
 * */
export function saveFavorite(song) {
    let favorite = storage.get(FAVORITE, [])
    favorite.unshift(song)
    if (favorite.length > FAVORITE_MAX_LENGTH) {
        favorite.pop()
    }
    storage.set(FAVORITE, favorite)
    return favorite
}

/**
 * @author sswq
 * @description 删除喜欢的歌曲目录
 * */
export function deleteFavorite(index) {
    let favorite = storage.get(FAVORITE, [])
    favorite.splice(index, 1)
    storage.set(FAVORITE, favorite)
    return favorite
}

/**
 * @author sswq
 * @description 从LG里获取喜欢的歌曲目录
 * */
export function loadFavorite () {
    return storage.get(FAVORITE, [])
}
// #endregion
