<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
    .listview
      position:relative
      width:100%
      height:100%
      overflow:hidden
      background:$color-background
      ul
       .list-group
         padding-bottom:30px
         .list-group-title
           height:30px
           line-height:30px
           padding-left:20px
           font-size:12px
           color:$color-text-l
           background:$color-highlight-background
         .list-group-item
           display:flex
           align-items:center
           padding:20px 0 0 30px
           .avatar
             width:50px
             height:50px
             border-radius:50%
           .name
             margin-left:20px;
             color: $color-text-l
             font-size:$font-size-medium
      .list-shortcut
        position:absolute
        z-index:30
        right:0
        top:50%
        transform:translateY(-50%)
        width:20px
        padding:20px 0
        border-radius:10px
        text-align:center
        background:$color-background-d
        font-family:Helvetica
        .item
          padding:3px
          line-height:1
          color:$color-text-l
          font-size:$font-size-small
          &.current
            color:$color-theme
      .list-fixed
        position:absolute
        top:0
        left:0
        width:100%
        .fixed-title
          height:30px
          line-height:30px
          padding-left:20px
          font-size:12px
          color:$color-text-l
          background:$color-highlight-background
</style>


<template>
  <scroll class="listview" 
          :data="data" 
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll">
      <ul>
          <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
              <h2 class="list-group-title">{{group.title}}</h2>
              <ul>
                  <li v-for="(item,index_2) in group.items" :key="index_2" class="list-group-item">
                      <img class="avatar" v-lazy="item.avatar"/>
                      <span class="name">{{item.name}}</span>
                  </li>
              </ul>
          </li>
      </ul>
      <!--touchstart和touchmove是移动端的事件-->
      <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" >
          <ul>
              <li v-for="(item,index) in shortcutList" 
                  :data-index="index" 
                  :key="index"
                  :class="{'current':currentIndex==index}"
                  class="item">
                  {{item}}
              </li>
          </ul>
      </div>
      <div class="list-fixed" v-show="fixedTitle" ref="fixed">
          <h1 class="fixed-title">{{fixedTitle}}</h1>
      </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom.js'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
    created() {
        this.touch = {} // 在vue里,都会被添加getter,setter.这里不需要观测
        this.listenScroll = true
        this.probeType = 3
        this.listHeight = []
    },
    data() {
        return {
            scrollY: -1,
            currentIndex: 0,
            diff: -1
        }
    },
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    computed: {
        shortcutList() {
            return this.data.map((group) => {
                return group.title.substr(0, 1)
            })
        },
        fixedTitle() {
            if (this.scrollY > 0) {
                return ''
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
    },
    methods: {
        // 1.这里主要的意思是通过事前在li里添加data-index,触摸滑动时在通过e.target,获取data-index,这和jq常用的技巧一致
        // 2.通过e.touches[0].pageY得到滚动的距离差,再除以每一项的高度
        onShortcutTouchStart(e) {
            let anchorIndex = getData(e.target, 'index')
            let firstTouch = e.touches[0]
            this.touch.y1 = firstTouch.pageY
            this.touch.anchorIndex = anchorIndex
            this._scollTo(anchorIndex)
        },
        onShortcutTouchMove(e) {
            let firstTouch = e.touches[0]
            this.touch.y2 = firstTouch.pageY
            let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
            let anchorIndex = parseInt(this.touch.anchorIndex) + delta
            this._scollTo(anchorIndex)
        },
        scroll(pos) {
            this.scrollY = pos.y
        },
        _scollTo(index) {
            if (!index && index !== 0) return
            if (index < 0) {
                index = 0
            } else if (index > this.listHeight.length - 2) {
                index = this.listHeight.length - 2
            }
            // this.scrollY = -(this.listHeight[index])
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 300)
        },
        _calculateHeight() {
            let childrenList = this.$refs.listGroup
            let height = 0
            this.listHeight.push(height)
            for (let i = 0; i < childrenList.length; i++) {
                height = height + childrenList[i].clientHeight
                this.listHeight.push(height)
            }
            console.log(this.listHeight)
        }

    },
    watch: {
        data() {
            setTimeout(() => {
                this._calculateHeight()
            }, 20)
        },
        scrollY(newY, oldY) {
            const listHeight = this.listHeight
            //  我这个方案还是有些弊端的,如果热门没有10个歌手,只有1个歌手,下拉过多,造成currentIndex为2,之后用官方方案
            // for (let i = 0; i < listHeight.length; i++) {
            //     let height1 = listHeight[i]
            //     let height2 = listHeight[i + 1]
            //     console.log(height1, height2)
            //     if (height2 && height1 < Math.abs(newY) && Math.abs(newY) < height2) {
            //         this.currentIndex = i
            //         return
            //     }
            // }
            // this.currentIndex = 0

            // 当滚动到顶部,newY>0
            if (newY > 0) {
                this.currentIndex = 0
                return
            }
            // 在中间部分滚动
            for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (height1 <= Math.abs(newY) && Math.abs(newY) < height2) {
                    this.currentIndex = i
                    this.diff = height2 + newY
                    return
                }
            }
            // 当滚动到底部, 且-newY大于最后一个元素的上限
            this.currentIndex = this.listHeight - 2
        },
        diff(newVal) {
            let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
            if (this.fixedTop === fixedTop) {
                return
            }
            this.fixedTop = fixedTop
            this.$refs.fixed.style.transform = `translate3d(0px, ${fixedTop}px, 0px)`
        }
    },
    components: {
        Scroll: Scroll
    }
}
</script>

