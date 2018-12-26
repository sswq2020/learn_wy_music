<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" v-model="query" :placeholder="placeholder" class="box">
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { _debounce } from 'common/js/util.js'
export default {
    props: {
        placeholder: {
            type: String,
            default: '搜索歌手歌曲'
        }
    },
    data() {
        return {
            query: ''
        }
    },
    methods: {
        clear() {
            this.query = ''
        },
        setQuery(query) {
            this.query = query
        }
    },
    created() {
    // 为什么不在watch属性里编写而且created钩子函数里用$watch,两者功能几乎一样
        this.$watch(
            'query',
            _debounce(newQuery => {
                this.$emit('query', newQuery)
            }, 400)
        )
    }

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;

  .icon-search {
    font-size: $font-size-large-y;
    color: $color-background;
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
  }

  .icon-dismiss {
    font-size: $font-size-medium-x;
    color: $color-background;
  }
}
</style>


