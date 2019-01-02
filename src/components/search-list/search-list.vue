<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li class="search-item" v-for="item in searches">
        <span class="text" @click="selectItem(item)">{{item}}</span>
        <span class="icon">
          <i class="icon-delete" @click.stop="deleteHistoryOne(item)"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    props: {
        searches: {
            type: Array,
            default: []
        }
    },
    methods: {
        deleteHistoryOne(history) {
            this.$emit('deleteHistoryOne', history)
        },
        selectItem(history) {
            this.$emit('select', history)
        }
    }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable';
  @import '~common/stylus/mixin';
  .search-list
    .search-item
      display flex
      align-items center
      height 40px
      overflow hidden
      .text
        flex 1
        color $color-text-n
      .icon
        position relative
        .icon-delete
          font-size $font-size-small
          color $color-text-m
</style>


