import { mapGetters, mapMutations } from 'vuex'
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
            'mode'
        ]),
        modeIcon() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        }
    },
    methods: {
        ...mapMutations({
            setCurrentIndex: 'SET_CURRENT_INDEX',
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
