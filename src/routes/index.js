const express = require('express')
const router = express.Router()
const OauthController = require('../controllers/oauthcontroller')
const OAuthServer = require('express-oauth-server')
const cluster = require('cluster')

router.oauth = new OAuthServer({
    model: OauthController,
})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
    if (cluster.isWorker)
        console.log(`Worker ${cluster.worker.id} received request`)
})

// router.post('/oauth/token', (req, res, next) => {
//     console.log(req)
//     router.oauth.token()
//     // console.log("ddd")
//     return
// })

router.post('/oauth/token', router.oauth.token())

router.post('/oauth/set_client', function (req, res, next) {
    OauthController.setClient(req.body)
        .then((client) => res.json(client))
        .catch((error) => {
            return next(error)
        })
})

router.post('/oauth/signup', function (req, res, next) {
    OauthController.setUser(req.body)
        .then((user) => res.json(user))
        .catch((error) => {
            return next(error)
        })
})

router.get('/secret', router.oauth.authenticate(), function (req, res) {
    res.json('Secret area')
})

module.exports = router
