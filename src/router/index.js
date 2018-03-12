import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'

Vue.use(Router)
const routes = [{
    path: '/recommend',
    component: Recommend
}, {
    path: '/singer',
    component: Singer
}, {
    path: '/search',
    component: Search
}, {
    path: '/rank',
    component: Rank
}]
export default new Router({
    routes
})