export const singer = state => state.singer

export const disc = state => state.disc

export const toplist = state => state.toplist

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
    return state.playlist[state.currentIndex] || {}
}

export const searchHistroy = state => state.searchHistroy

export const playHistroy = state => state.playHistroy

export const favoriteList = state => state.favoriteList
