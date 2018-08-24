<template>
    <transition name="slide">
       <div class="singer-detail"></div>
    </transition>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: 'singer-detail',
    data() {
        return {

        }
    },
    created() {
        console.log(this.singer)
    },
    computed: {
        ...mapGetters([
            'singer'
        ])
    }

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .singer-detail
    position:fixed
    z-index:100
    top:0
    left:0
    right:0
    bottom:0
    background:$color-background
  .slide-enter-active,.slide-leave-active
    transition:all 0.3s
  .slide-enter, .slide-leave-to
    transform:translate3d(100%,0,0)
</style>

