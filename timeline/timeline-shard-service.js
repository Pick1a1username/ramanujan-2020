var HOST = process.env.HOST || process.argv[2] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[3] || '').split(',')
var SILENT = process.env.SILENT || process.argv[5] || 'true'


var _ = require('lodash')
const clean = require('seneca').util.clean;

function resolve_shard(user) {
  return user.charCodeAt(0) % 2
}

require('seneca')({
  tag: 'timeline-shard',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
    //.use('zipkin-tracer', {sampling:1})

  .add('timeline:list',function(msg,done){
    var shard = resolve_shard(msg.user)

    /**
     * Before forwarding the message, contents generated by Seneca should be
     * removed(especially msg.transport$.track). If the contents is not
     * removed, processing the message will fail and the receiver will be down.
     * (This behavior seems to be bug)
     */   
    const forwardMsg = clean(msg)
    this.act({shard:shard},forwardMsg,done)
  })

  .add('timeline:insert',function(msg,done){
    var seneca = this
    done()

    var shards = [[],[]]

    _.each(msg.users,function(user){
      shards[resolve_shard(user)].push(user)
    })

    _.each(shards,function(users,shard){
      if( 0 < users.length ) {
        /**
         * Before forwarding the message, contents generated by Seneca should be
         * removed(especially msg.transport$.track). If the contents is not
         * removed, processing the message will fail and the receiver will be down.
         * (This behavior seems to be bug)
         */   
        const forwardMsg = clean(msg)
        seneca.act({
          shard: shard,
          users: users,
        }, forwardMsg)
      }
    })
  })

  .use('mesh',{
    pin: 'timeline:*',
      bases: BASES,
      host: HOST,
      sneeze:{
        silent: JSON.parse(SILENT),
        swim: {interval: 1111}
      }
  })

  .ready(function(){
    console.log(this.id)
  })
