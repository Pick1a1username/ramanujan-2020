"use strict"

var PORT = process.env.PORT || process.argv[2] || 0
var HOST = process.env.HOST || process.argv[3] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[4] || '').split(',')
var SILENT = process.env.SILENT || process.argv[5] || 'true'

var Hapi   = require('@hapi/hapi')
var Chairo = require('chairo')
var Seneca = require('seneca')
var Rif    = require('rif')

var tag = 'api'
var rif = Rif()

var host = rif(HOST) || HOST


const init = async () => {
  const server = Hapi.Server({
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
    {
      plugin:require('chairo'),
      options:{
        seneca: Seneca({
          tag: tag,
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
            {path: '/api/ping'},
            {path: '/api/post/{user}', method: 'post'},
            {path: '/api/follow/{user}', method: 'post'},
        ],
        sneeze: {
          host: host,
          silent: JSON.parse(SILENT),
          swim: {interval: 1111}
        }
      }
    }
  ])

  server.route({
    method: 'GET', path: '/api/ping',
    handler: async function( req, reply ){
      let result = '';

      try {
        result = await server.seneca.actAsync('role:api,cmd:ping')
      } catch (err) {
        return err;
      }

      return result;
    }
  })
  
  server.route({
    method: 'POST', path: '/api/post/{user}',
    handler: async function( req, reply ){
  
      console.log('/api/post A', req.params, req.payload)
      
      try {
        await server.seneca.actAsync(
          'post:entry',
          {user:req.params.user, text:req.payload.text}
        )
      } catch (err) {
        console.log('/api/post B Fail', err);
        return reply.redirect('/error');
      }

      return reply.redirect(req.payload.from)

      }
  })
  
  server.route({
    method: 'POST', path: '/api/follow/{user}',
    handler: async function( req, reply ){
      try {
        await server.seneca.actAsync(
          'follow:user',
          {user:req.params.user, target:req.payload.user});
      } catch (err) {
        console.log('Something went wrong!');
        return reply.redirect('/error');
      }

      return reply.redirect(req.payload.from);
    }
  })

  server.registrations.chairo.options.seneca
    .add('role:api,cmd:ping', function(msg,done){
      done( null, {pong:true,api:true,time:Date.now()})
    })
    .use('mesh',{
      host: host,
      bases: BASES,
      sneeze: {
              silent: JSON.parse(SILENT),
              swim: {interval: 1111}
            }
        })

  await server.start();

  console.log(tag,server.info.host,server.info.port)
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();