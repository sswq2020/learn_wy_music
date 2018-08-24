import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import 'common/stylus/index.styl'

fastclick.attach(document.body)
Vue.config.productionTip = false

// or with options
Vue.use(VueLazyload, {
    preLoad: 1.3,
    loading: 'https://y.gtimg.cn/mediastyle/yqq/img/logo@2x.png?nowebp=1',
    attempt: 1
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})