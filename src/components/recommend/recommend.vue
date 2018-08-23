<template>
  <div class="recommend">
    <!-- 这里的ref是调用子组件的方法 -->
    <scroll ref="scroll" class="recommend-content" :data="discList">
        <!--BScroll只作用于第一个子元素DOM -->
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
            <slider>
                <div v-for="(item,index) in recommends" :key="index">
                <a :href="item.linkUrl">
                    <img class="needsclick"   @load="loadImage" :src="item.picUrl"/>
                </a>
                </div>
            </slider>  
        </div>
        <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
                <li v-for="(item,index) in discList" class="item" :key="index">
                    <div class="icon"><img width="60" height="60" v-lazy="item.imgurl" ></div>
                    <div class="text">
                        <h2 class="name" v-html="item.creator.name"></h2>
                        <p class="desc" v-html="item.dissname"></p>
                    </div>
                </li>
            </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
          <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {getRecommend, getDiscList} from 'api/recommend'
import { ERR_OK } from 'api/config'
export default {
    data() {
        return {
            recommends: [],
            discList: []
        }
    },
    created () {
        setTimeout(() => {
            this._getRecommend()
        }, 100)
        this._getDiscList()
    },
    methods: {
        _getRecommend() {
            let _this = this
            getRecommend().then((res) => {
                if (res.code === ERR_OK) {
                    _this.recommends = res.data.slider
                }
            })
        },
        _getDiscList() {
            let _this = this
            getDiscList().then((res) => {
                if (res.code === ERR_OK) {
                    _this.discList = res.data.list
                }
            })
        },
        loadImage() {
            if (!this.checkLoaded) { // 实际上只执行一次,原因是轮播图高度是一样的，只执行一次refresh即可
                this.$refs.scroll.refresh()
                this.checkLoaded = true
            }
        }
    },
    components: {
        slider: Slider,
        scroll: Scroll,
        loading: loading
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing:border-box
          align-items:center
          padding: 0 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            flex: 1
            display: flex
            flex-direction: column
            justify-content: center
            line-height: 20px
            overflow: hidden
            font-size: 14px
            .name
              margin-bottom: 10px
              color: #fff
            .desc
              color: $color-text-d 
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>