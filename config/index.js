'use strict'
// Template version: 1.2.8
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

const api = {
    _getDiscLists: {
        context: '/api/getDiscLists',
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        // 设置跨域请求的host和referer两种都可以
        // 方法1
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        // 方法2
        // bypass: function(req, res, proxyOptions) {
        //     req.headers.referer = 'https://c.y.qq.com/'
        //     host: 'c.y.qq.com'
        // },
        pathRewrite: { '^/api/getDiscLists': '' },
        changeOrigin: true
    },
    _getLyric: {
        context: '/api/lyric',
        target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        pathRewrite: { '^/api/lyric': '' },
        changeOrigin: true
    },
    _getCdInfo: {
        context: '/api/getCdInfo',
        target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        pathRewrite: { '/api/getCdInfo': '' },
        changeOrigin: true
    },
    _getToplists: {
        context: '/api/getToplists',
        target: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
        headers: {
            referer: 'https://m.y.qq.com',
            host: 'c.y.qq.com'
        },
        pathRewrite: { '/api/getToplists': '' },
        changeOrigin: true
    },
    _getToplistSongs: {
        context: '/api/getToplistSongs',
        target: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        pathRewrite: { '/api/getToplistSongs': '' },
        changeOrigin: true
    },
    _getHotKey: {
        context: '/api/getHotKey',
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
        headers: {
            referer: 'https://y.qq.com',
            host: 'c.y.qq.com'
        },
        pathRewrite: { '/api/getHotKey': '' },
        changeOrigin: true
    },
    _getSearch: {
        context: '/api/getSearch',
        target: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
        headers: {
            referer: 'https://y.qq.com',
            host: 'c.y.qq.com'
        },
        pathRewrite: { '/api/getSearch': '' },
        changeOrigin: true
    }
}

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: [
            api._getDiscLists,
            api._getLyric,
            api._getCdInfo,
            api._getToplists,
            api._getToplistSongs,
            api._getHotKey,
            api._getSearch
        ],
        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8082, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint: true,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: false,

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true,
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',

        /**
         * Source Maps
         */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
}