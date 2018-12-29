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

function insertArray(arr, val, maxLen, compare) {
    const index = arr.findIndex(compare)
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