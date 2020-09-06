"use strict"
var HOST = process.env.HOST || process.argv[2] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[3] || '').split(',')
var SILENT = process.env.SILENT || process.argv[4] || 'true'

var handlebars = require('handlebars')
var hapi = require('@hapi/hapi')
var Rif = require('rif')
var rif = Rif()


var host = rif(HOST) || HOST


/**
 * asdlfkjasldjflksafasd
 */


const init = async () => {
  const server = hapi.Server({
    port: 8000, // test with http://localhost:8000/api/ping
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
      plugin: require('wo'),
      options: {
        bases: BASES,
          sneeze: {
            host: host,
            silent: JSON.parse(SILENT),
            swim: {interval: 1111}
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
    method: 'GET', path: '/api/ping', 
    handler: {
      wo: { passThrough: true }
    }
  })
  
  server.route({
    method: 'POST', path: '/api/post/{user}', 
    handler: {
      wo: {
        passThrough: true
      }
    }
  })
  
  server.route({
    method: 'POST', path: '/api/follow/{user}', 
    handler: {
      wo: {
        passThrough: true
      }
    }
  })
    
  server.route({ 
    method: 'GET', path: '/mine/{user}', 
    handler: {
      wo: { passThrough: true }
    }
  })
  
  
  server.route({ 
    method: ['GET','POST'], path: '/search/{user}', 
    handler: {
      wo: { passThrough: true }
    }
  })
  
  
  server.route({ 
    method: 'GET', path: '/{user}', 
    handler: {
      wo: { passThrough: true }
    }
  })
  
  server.route({
    path: '/favicon.ico',
    method: 'get',
    config: {
      cache: {
        expiresIn: 1000*60*60*24*21
      }
    },
    handler: function(request, reply) {
      return reply().code(200).type('image/x-icon')
    }
  })
  
  server.route({
    method: 'GET',
    path: '/res/{path*}',
    handler: {
      directory: {
        path: __dirname + '/www/res',
      }
    }
  })

  // https://itnext.io/getting-started-with-hapi-js-e841724da924
  try {
    await server.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  };
  
  console.log('front',server.info.uri)
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();