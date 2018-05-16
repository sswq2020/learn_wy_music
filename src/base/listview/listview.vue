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
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom.js'

const ANCHOR_HEIGHT = 18
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
            currentIndex: 0
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
            for (let i = 0; i < listHeight.length; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                console.log(height1, height2)
                if (height2 && height1 < Math.abs(newY) && Math.abs(newY) < height2) {
                    this.currentIndex = i
                    console.log(this.currentIndex)
                    return
                }
            }
        }
    },
    components: {
        Scroll: Scroll
    }
}
</script>

