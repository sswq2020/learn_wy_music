<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle">
      <div class="filter">

      </div>
    </div>
    <div class="bg-layer"></div>
    <div class="list"></div>
  </div>
</template>

<script  type="text/ecmascript-6">
export default {
    props: {
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        }
    },
    computed: {
        bgStyle() {
            return `background-image:url(${this.bgImage}) `
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.music-list
  position:fixed
  top:0
  left:0
  bottom:0
  right:0
  background:$color-background
  z-index:100
  .back
    position:absolute
    top:0
    left 6px
    z-index:50
    .icon-back
     display:block
     padding:10px
     font-size:$font-size-large-x
     color:$color-theme
  .title
    position:absolute
    top:0
    left:10%
    width:80%
    text-overflow:ellipsis
    overflow:hidden
    white-space:nowrap
    text-align:center
    line-height:40px
    font-size:$font-size-large
    color:$color-text
    z-index:40
  .bg-image
    position:relative
    width:100%
    height:0
    padding-top:70%
    background-size:cover
    -webkit-transform-origin:top
    z-index:1
    .filter
      position:absolute
      top:0
      left:0
      width:100%
      background:rgba(7,17,27,.4)
  .bg-layer
    position:relative
    height:100%
    background:$color-background
  .list
    position:absolute
    top:0
    bottom:0
    width:100%
    background:$color-background
</style>



