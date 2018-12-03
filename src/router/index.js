import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail.vue'
import Disc from 'components/disc/disc.vue'
import toplist from 'components/top-list/top-list.vue'

Vue.use(Router)
const routes = [{
    path: '/recommend',
    component: Recommend,
    children: [{
        path: ':id',
        component: Disc
    }]
}, {
    path: '/singer',
    component: Singer,
    children: [{
        path: ':id',
        component: SingerDetail
    }]
}, {
    path: '/search',
    component: Search,
    children: [{
        path: ':id',
        component: SingerDetail
    }]
}, {
    path: '/rank',
    component: Rank,
    children: [{
        path: ':id',
        component: toplist
    }]
}]
export default new Router({
    routes
})