"use strict"

var PORT = process.env.PORT || process.argv[2] || 0
var HOST = process.env.HOST || process.argv[3] || 0
var BASES = (process.env.BASES || process.argv[4] || '').split(',')
var SILENT = process.env.SILENT || process.argv[5] || 'true'

var hapi       = require('@hapi/hapi')
var chairo     = require('chairo')
var vision     = require('@hapi/vision')
var inert      = require('@hapi/inert')
var handlebars = require('handlebars')
var _          = require('lodash')
var moment     = require('moment')
var Seneca     = require('seneca')
var Rif        = require('rif')

var rif = Rif()
var host = rif(HOST) || HOST

const server = hapi.Server({
  port: PORT,
  host: host
})

const init = async () => {


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
          tag: 'mine',
          internal: {logger: require('seneca-demo-logger')},
          debug: {short_logs:true}
        })
          //.use('zipkin-tracer', {sampling:1})
          .use('entity')
          .test()
      }
    },
    {
      plugin: require('wo'),
      options:{
        bases: BASES,
        route: [
            {path: '/mine/{user}'},
        ],
        sneeze: {
          host: host,
          silent: JSON.parse(SILENT),
          swim: {interval: 1111}
        }
      }
    }
  ])

  console.log('plugins(1) setting done')

  server.views({
    engines: { html: handlebars },
    path: __dirname + '/www',
    layout: true
  })

  console.log('views setting done')

  server.route({
    method: 'GET', path: '/mine/{user}',
    handler: function( req, reply )
    {
      let entryListReceived = [];

      server.seneca.act(
        'store:list,kind:entry',
        {user:req.params.user},
        function( err, entrylist ) {
          console.log('entry received')
          console.log(entrylist)
          console.log(err)
          if(err) {
            entrylist = []
          }

          entryListReceived = entrylist;

          // reply.view('mine',{
          //   user: req.params.user,
          //   entrylist: _.map(entrylist,function(entry){
          //     entry.when = moment(entry.when).fromNow()
          //     return entry
          //   })
          // })
        })
      
      return reply.view('mine',{
        user: req.params.user,
        entrylist: _.map(entryListReceived,function(entry){
          entry.when = moment(entry.when).fromNow()
          return entry
        })
      })
    }
  })

  console.log('routes setting done')



  console.log(BASES, host)


  await server.start();

  // console.log(server.registrations.chairo.options.seneca.use)
  server.registrations.chairo.options.seneca.use('mesh',{
    bases:BASES,
    host:host
  }) 

  console.log('mesh setting done')

  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();
