import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    mounted() {
        this.hanlePlaylist(this.playlist)
    },
    activated() {
        this.hanlePlaylist(this.playlist)
    },
    watch: {
        playlist(newVal) {
            this.hanlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('componment must implement hanlePlaylist method')
        }
    }
}

export const playerMixin = {
    computed: {
        ...mapGetters([
            'playlist',
            'sequenceList',
            'currentSong',
            'mode',
            'playing'
        ]),
        modeIcon() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        }
    },
    methods: {
        ...mapMutations({
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayingState: 'SET_PLAYING_STATE',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST'
        }),
        changeMode() {
            const mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
        },
        resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        }
    }
}

export const searchMixin = {
    data() {
        return {
            query: ''
        }
    },
    computed: {
        ...mapGetters([
            'searchHistroy'
        ])
    },
    methods: {
        addQuery(query) { // 直接调用子组件search-box提供的方法
            this.$refs.searchBox.setQuery(query)
        },
        saveSearch() { // 保存的是搜索字,不是下拉展示的某一项
            this.saveSearchHistory(this.query)
        },
        blurInput() {
            this.$refs.searchBox.blur()
        },
        onQueryChange(query) {
            this.query = query
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory'
        ])
    }
}
