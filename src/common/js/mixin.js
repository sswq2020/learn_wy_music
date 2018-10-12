import { mapGetters } from 'vuex'

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