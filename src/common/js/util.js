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