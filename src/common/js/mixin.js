import { mapGetters } from 'vuex'
import { playMode } from 'common/js/config'

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
    }
}
