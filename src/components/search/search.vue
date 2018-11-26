<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <scroll class="shortcut">
        <div class="hot-key">
          <h1 class="title"></h1>
          <ul>
            <li @click="addQuery(item.k)"  class="item" v-for="item in hotkey">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </scroll>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box.vue'
  import Scroll from 'base/scroll/scroll.vue'
  import {getHotKey} from 'api/search.js'

  export default {
      data() {
          return {
              hotkey: []
          }
      },
      components: {
          SearchBox,
          Scroll
      },
      created() {
          this._getHotKey()
      },
      methods: {
          async _getHotKey() {
              const res = await getHotKey()
              this.hotkey = res.data.hotkey.slice(0, 10)
          },
          addQuery(query) { // 直接调用子组件search-box提供的方法
              this.$refs.searchBox.setQuery(query)
          }
      }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable';
  @import '~common/stylus/mixin';
  .search
    .search-box-wrapper
      margin 20px
    .shortcut-wrapper
      position fixed
      top 178px
      bottom 0
      width 100%
      .shortcut
        height 100%
        overflow hidden
        .hot-key
          margin 0 20px 20px
          .title
            margin-bottom 20px
            font-size $font-size-medium
            color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d


</style>
