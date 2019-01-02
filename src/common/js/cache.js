import storage from 'good-storage'
const SEARCH_KEY = '__search__'

const SEARCH_MAX_LENGTH = 15

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, SEARCH_MAX_LENGTH, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

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

function deleteArray(arr, cb = () => {}) {
    const index = arr.findIndex(cb)
    if (index > -1) {
        arr.splice(index, 1)
    }
}
export function deleteSearchHistoryItem(history) {
    let searches = storage.get(SEARCH_KEY, [])
    deleteArray(searches, (item) => {
        return history === item
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function deleteSearchHistoryAll(history) {
    storage.remove(SEARCH_KEY)
    return []
}