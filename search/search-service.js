"use strict"

var PORT = process.env.PORT || process.argv[2] || 0
var HOST = process.env.HOST || process.argv[3] || 0
var BASES = (process.env.BASES || process.argv[4] || '').split(',')
var SILENT = process.env.SILENT || process.argv[5] || 'true'


var hapi       = require('@hapi/hapi')
var handlebars = require('handlebars')
var _          = require('lodash')
var moment     = require('moment')
var Seneca     = require('seneca')
var Rif        = require('rif')


var rif = Rif()
var host = rif(HOST) || HOST


const init = async () => {
  const server = hapi.Server({
    port: PORT,
    host: host
  })
  
  /**
   * It seems that if multiple plugins are registered by multiple
   * server.register(), the script is finished before registering plugins.
   * 
   * Registering multiple plugins as below seems to be a walk-around.
   * 
   * References:
   * 
   * * https://github.com/outmoded/discuss/issues/669
   * 
   */
  await server.register([
    require('@hapi/vision'),
    require('@hapi/inert'),
    {
      plugin:require('chairo'),
      options:{
        seneca: Seneca({
          tag: 'search',
          internal: {logger: require('seneca-demo-logger')},
          debug: {short_logs:true}
        })
        //.use('zipkin-tracer', {sampling:1})
      }
    },
    {
      plugin: require('wo'),
      options:{
        bases: BASES,
        route: [
            {method: ['GET','POST'], path: '/search/{user}'},
        ],
        sneeze: {
          host: host,
          silent: JSON.parse(SILENT)
        }
      }
    }
  ])

  server.views({
    engines: { html: handlebars },
    path: __dirname + '/www',
    layout: true
  })
 
  server.route({
    method: ['GET','POST'],
    path: '/search/{user}',
    handler: async function( req, reply )
    {
      var query
        = (req.query ? (null == req.query.query ? '' : ' '+req.query.query) : '')
        + (req.payload ? (null == req.payload.query ? '' : ' '+req.payload.query) : '')

      query = query.replace(/^ +/,'')
      query = query.replace(/ +$/,'')

      let following = [];
      let entrylist = [];

      try {
        following = await server.seneca.actAsync(
          'follow:list,kind:following',
          {user:req.params.user});
        entrylist = await server.seneca.actAsync(
          'search:query',
          {query: query });
      } catch (err) {
        console.log('Something went wrong!');
        console.log(err);
      }

      return reply.view('search',{
        query: encodeURIComponent(query),
        user: req.params.user,
        entrylist: _.map(entrylist,function(entry){
          entry.when = moment(entry.when).fromNow()
          entry.can_follow =
            req.params.user != entry.user &&
            !_.includes(following,entry.user)
          return entry
        })
      });
    }
  })


  server.registrations.chairo.options.seneca.use('mesh',{
    bases:BASES,
    host:host,
    sneeze:{
      silent: JSON.parse(SILENT),
      swim: {interval: 1111}
    }
  }) 

  // https://itnext.io/getting-started-with-hapi-js-e841724da924
  try {
    await server.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  };
  

  console.log('search',server.info.uri)
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();