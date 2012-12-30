/*******************************************************************************
*                                                                              *
*                                 )   (                      )                 *
*           (  (      (    (   ( /(   )\      (  (        ( /(  (              *
*       (   )\))(    ))\  ))\  )\()) ((_) (   )\))(  (    )\()) )(    (        *
*       )\ ((_)()\  /((_)/((_)(_))/   _   )\ ((_))\  )\  ((_)\ (()\   )\       *
*      ((_)_(()((_)(_)) (_))  | |_   | | ((_) (()(_)((_) | |(_) ((_) ((_)      *
*      (_-<\ V  V // -_)/ -_) |  _|  | |/ _ \/ _` |/ _ \ | '_ \| '_|/ _ \      *
*      /__/ \_/\_/ \___|\___|  \__|  |_|\___/\__, |\___/ |_.__/|_|  \___/      *
*                                            |___/                             *
*                                                                              *
*******************************************************************************/


/*
 * dependencies
*******************************************************************************/

/* the infos */
var infos = require('./package.json')

  /* server */
  , express = require('express')
  , app     = express()

  /* authentication */
  // , crypto        = require('crypto')
  // , passport      = require('passport')
  // , LocalStrategy = require('passport-local').Strategy

  /* express/connect middleware */
  , partials = require('express-partials')
  , assets   = require('connect-assets')
  // , flash    = require('connect-flash')

  /* database connections */
  // , cradle  = require('cradle')
  // , conn    = new cradle.Connection(process.env.COUCH_DB || '127.0.0.1:5984')
  // , authDb  = conn.database('auth')
  ;

/*
 * server configuration
*******************************************************************************/

app
  .set('port', process.env.PORT || 3000)
  .set('views', __dirname + '/views')
  .set('view engine', 'ejs')

  .use(express.favicon())
  .use(express.bodyParser())
  .use(express.methodOverride())

  // .use(express.cookieParser('roar'))
  // session is leaky, use redis, mongo or memcached
  // see http://stackoverflow.com/questions/8749907/what-is-a-good-session-store-for-a-single-host-node-js-production-app
  // .use(express.session({secret : 'secrets'}))


  .use(express.static(__dirname + '/public'))
  .use(partials())
  .use(assets())
  // .use(flash())

  // .use(passport.initialize())
  // .use(passport.session())

  .configure('development', function(){
    app.use(express.logger('dev'))
      .use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  })
  .configure('production', function(){
    app.use(express.logger())
      .use(express.errorHandler());
  })
  .use(app.router);

/*
 * auth configuration
*******************************************************************************/

// // Looks for user in the DB
// function findByUsername(username, fn){
//   // Look in the 'byUsername' view for the given username
//   authDb.view('user/byUsername', {key: username}, function(err, res) {
//     if(err || !res.length) return fn(null, null);
//     fn(null, res[0].value);
//   });
// }

// function checkUser(user, cb){
//   authDb.view('user/byUsername', {key: user}, function(err, result) {
//     if(result.length > 0){ cb(false); } else { cb(true); };
//   });
// }

// // Password hash
// function getHash(password, cb){
//   crypto.pbkdf2(password, 'deSalt', 2048, 40, cb);
// }

// passport.serializeUser(function(user, done) {
//   done(null, user.username);
// });

// passport.deserializeUser(function(username, done) {
//   findByUsername(username, function (err, user) {
//     done(err, user);
//   });
// });

// // Passport config
// passport.use(new LocalStrategy(
//   function(username, password, done){
//     findByUsername(username, function(err, user){
//       if(err){ return done(err); };
//       // If the given username wasn't found notify user username doesn't exist
//       if(!user){
//         return done(null, false, {
//           message: 'Username "' + username + '" doesn\'t exist'
//         });
//       };

//       // If the give password doesn't match the username notify user their
//       // password was incorrect
//       getHash(password, function(err, key){
//         if(err || key !== user.password) {
//           return done(null, false, {
//             message: 'Password didn\'t match'
//           });
//         }
//         return done(null, user);
//       });
//     });
//   }
// ));

/*
 * pre-verb actions
*******************************************************************************/

// // loads some useful local variables
// function loadAuthentication(req, res, next) {
//   res.locals({
//     currentPath: req.url,
//     currentUser: req.user ? req.user.username : null,
//     authenticated: req.isAuthenticated()
//   })
//   next();
// }

// // Simple check to see if user is loggedin, if not point them to /login
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) return next();

//   req.flash('error','You must be logged in to see that page');
//   res.redirect('/');
// }

/*
 * global logic
*******************************************************************************/

// app.all('*', loadAuthentication);

/*
 * basic routes
*******************************************************************************/

app.get('/', function(req, res){
  res.render('index', {
    name: infos.name,
    version: infos.version
  });
});

/*
 * auth routes
*******************************************************************************/

// app.post('/login',
//   passport.authenticate('local', {
//     failureRedirect: '/',
//     failureFlash: true
//   }),
//   function(req, res) {
//     res.redirect('/');
//   }
// );

// app.post('/register', function(req, res){
//   var user   = req.body.username
//     , email  = req.body.email
//     , pass   = req.body.password
//     , errors = 0;

//   if(!user){
//     req.flash('error', 'Please enter a username');
//     errors ++;
//   }

//   if(!email){
//     req.flash('error', 'Please enter an email address');
//     errors++;
//   }

//   if(!pass){
//     req.flash('error', 'Please enter a password');
//     errors++;
//   }

//   if(!!user && !!email && !!pass) {
//     checkUser(user, function(auth){
//       if (auth === false) {
//         req.flash('error', 'Username "'+ user +'" already taken.\n');
//         errors++;
//       } else if (auth === true && !errors) {
//         getHash(pass, function(err, hash){
//           authDb.save({
//             username: user,
//             password: hash,
//             email: email,
//             highscore : null
//           },
//           function(err, result) {
//             if(err) throw err;
//             req.flash('error', 'Registration successful! You still gotta login though :P');
//             res.redirect('/');
//           });
//         });
//       }

//       if (errors > 0) {
//         res.redirect('/');
//       }
//     });
//   } else {
//     res.redirect('/');
//   }
// });

// app.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });

/*
 * http server
*******************************************************************************/

/* listen up son */
var server = app.listen(app.get('port'), function(){
  var hello = [
    '\nA.I.M.S. : Advanced Internet Mega Server',
    'Codename : Question Hound',
    'App      : ' + infos.name,
    'Version  : ' + infos.version,
    'Port     : ' + app.get('port'),
    'Env      : ' + app.settings.env,
    '\nWatching, listening, silently judging...\n'
  ];
  hello.forEach(function(msg){ console.log(msg) });
});
