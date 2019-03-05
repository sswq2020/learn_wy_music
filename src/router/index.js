import Vue from 'vue'
import Router from 'vue-router'
const Recommend = () => import('components/recommend/recommend')
const Singer = () => import('components/singer/singer')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const SingerDetail = () => import('components/singer-detail/singer-detail.vue')
const Disc = () => import('components/disc/disc.vue')
const toplist = () => import('components/top-list/top-list.vue')

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
