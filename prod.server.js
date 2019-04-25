let express = require('express')
let config = require('./config/index')
let axios = require('axios')
let bodyParser = require('body-parser')
let app = express()
// 这个中间件专门解析post请求的body
app.use(bodyParser.json());

/**这个express服务器的主要作用代理QQ的接口,
 * 利用axios来做代理，
 * 真的神器前端后端通用
 * 这种思路简单明了
 * 以后可以借助express和axios在本地搭建简单代理服务
 * **/
app.get('/api/getDiscLists', (req, res) => {
    let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params:req.query
    }).then((response)=>{
      res.json(response.data)
    }).catch((e)=>{
      console.log(e)
    })
})

app.get('/api/lyric', (req, res) => {
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e)
  })
})

app.get('/api/getCdInfo', (req, res) => {
  let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e)
  })
})

app.get('/api/getToplists', (req, res) => {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://m.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e)
  })
})

app.get('/api/getToplistSongs', (req, res) => {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e)
  })
})

app.get('/api/getHotKey', (req, res) => {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e)
  })
})

app.get('/api/getSearch', (req, res) => {
  let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e)
  })
})

app.post('/api/postPurlUrlByustbhuangyi', (req, res) => {
  let url = 'http://ustbhuangyi.com/music/api/getPurlUrl'
  axios({
    method: 'post',
    url: url,
    data: req.body, //获取post请求的参数就是req.body,这个注意就行了
    headers: {
      referer: 'http://ustbhuangyi.com/music/',
      host: 'ustbhuangyi.com'
  },
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e)
  })
})


app.use(express.static('./dist')) //入口，毕竟前端放置的index.html,需要访问，就需要一个入口

var port = process.env.PORT || config.build.port
module.exports = app.listen(port,function(err){
  if(err){
    console.log(err)
    return
  }
  console.log(`Listening at http://localhost:${port}\n`)
})
