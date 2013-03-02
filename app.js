/*******************************************************************************
*                             _           _        _                           *
*                            | |         | |      (_)                          *
*              _ __   ___  __| | ___  ___| |_ _ __ _  __ _ _ __                *
*             | '_ \ / _ \/ _` |/ _ \/ __| __| '__| |/ _` | '_ \               *
*             | |_) |  __/ (_| |  __/\__ \ |_| |  | | (_| | | | |              *
*             | .__/ \___|\__,_|\___||___/\__|_|  |_|\__,_|_| |_|              *
*             | |0.0.1                                  it'll do™              *
**************|_|**************************************************************/


/*
 * dependencies
*******************************************************************************/

/* the infos */
var infos = require('./package.json')

  /* server */
  , express = require('express')
  , app     = express()

  /* express/connect middleware */
  , partials = require('express-partials')
  , assets   = require('connect-assets')

/*
 * configuration
*******************************************************************************/

app
  .set('port', process.env.PORT || 3000)
  .set('views', __dirname + '/views')
  .set('view engine', 'ejs')

  .use(express.favicon())
  .use(express.bodyParser())
  .use(express.methodOverride())

  .use(express.static(__dirname + '/public'))
  .use(partials())
  .use(assets())

  .configure('development', function(){
    app
      .use(express.logger('dev'))
      .use(express.errorHandler({ dumpExceptions: true, showStack: true }))
  })
  .configure('production', function(){
    app
      .use(express.logger())
      .use(express.errorHandler())
  })
  .use(app.router)

/*
 * routes
*******************************************************************************/

app.get('/', function(req, res){
  res.render('index', {
    name: infos.name,
    version: infos.version
  })
})

app.post('*', function(req, res){
  res.render('index', {
    messages: ['No way dude.', 'I don\'t think so.', 'Not this time.'],
    name: infos.name,
    version: infos.version
  })
})

/*
 * server
*******************************************************************************/

app.listen(app.get('port'), function(){
  [
    '\nA.I.M.S. : Advanced Internet Mega Server',
    'Codename : Question Hound',
    'App      : ' + infos.name,
    'Version  : ' + infos.version,
    'Port     : ' + app.get('port'),
    'Env      : ' + app.settings.env,
    'Watching, listening, silently judging...\n'
  ]
    .forEach(function(msg){ console.log(msg) })
})
