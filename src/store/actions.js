import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearchHistoryItem, deleteSearchHistoryAll } from 'common/js/cache'

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = function({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomlist = shuffle(list)
        commit(types.SET_PLAYLIST, randomlist)
        index = findIndex(randomlist, list[index])
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({ commit, state }, { list }) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomlist = shuffle(list)
    commit(types.SET_PLAYLIST, randomlist)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({ commit, state }, song) {
    let playlist = state.playlist.slice() // slice不会改变原数组,相当于生成数组的副本
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 记录当前歌曲
    let currentsong = playlist[currentIndex]
    // 查找当前播放列表中是否有待插入的歌曲并返回其索引
    let fpIndex = findIndex(playlist, song)
    // 因为是插入歌曲,所以索引加一
    currentIndex++
    // 插入这首歌到当前索引位置
    playlist.splice(currentIndex, 0, song)
    // 如果已经包含了这首歌
    if (fpIndex > -1) {
        // 如果当前插入的序号大于列表中的序号,即在后面
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1)
            currentIndex--
        } else {
            playlist.splice(fpIndex + 1, 1)
        }
    }

    // 顺序列表将当前播放歌曲的索引加一
    let currentSIndex = findIndex(sequenceList, currentsong) + 1
    // 查找所需的歌曲在顺序列表的索引
    let fsIndex = findIndex(sequenceList, song)
    // 将所需的歌曲插入顺序列表的索引
    sequenceList.splice(currentSIndex, 0, song)

    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}
//  个人觉得其实也可以在suggest.vue使用mapMutation,
//   主要原因提交一个mutation可以不需要action
//   当然saveSearch的逻辑也要转移过去
//   使用action就是比较利于复用
export const saveSearchHistory = function({ commit, state }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({ commit, state }, history) {
    commit(types.SET_SEARCH_HISTORY, deleteSearchHistoryItem(history))
}

export const clearSearchHistory = function({ commit }) {
    commit(types.SET_SEARCH_HISTORY, deleteSearchHistoryAll())
}