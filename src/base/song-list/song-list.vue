<template>
  <div class="song-list">
    <ul>
      <li class="item" @click="selectItem(song,index)" v-for="(song,index) in songs">
        <div class="rankIcon" v-show="rank">
          <span :class="getIconClass(index)">{{getIconText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script  type="text/ecmascript-6">
export default {
    props: {
        songs: {
            type: Array,
            default: () => []
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getDesc(song) {
            return `${song.singer}·${song.album}`
        },
        selectItem(item, index) {
            this.$emit('select', item, index)
        },
        getIconClass(index) {
            if (index < 3) {
                return `icon icon${index}`
            } else {
                return 'icon'
            }
        },
        getIconText(index) {
            if (index < 3) {
                return ''
            } else {
                return `${index + 1}`
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"
 @import "~common/stylus/mixin"

 .song-list
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    .rankIcon
      flex 0 0 25px
      width 25px
      margin-right 30px
      text-align center
      .icon
        display inline-block
        width 25px
        height 24px
        background-size 25px 24px
        &.icon0
           bg-image('first')
        &.icon1
           bg-image('second')
        &.icon2
           bg-image('third')
    .content
      flex 1
      line-height 20px
      overflow hidden
      .name
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
        color $color-text
      .desc
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
        color $color-text-d
        margin-top 4px
</style>



