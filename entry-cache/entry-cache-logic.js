'use strict'

var _ = require('lodash')

module.exports = function entry_cache (options) {
  var seneca = this

  var cache = {}

  seneca.add('store:save,kind:entry', function(msg, done) {
    delete cache[msg.user]

    /**
     * Before forwarding the message, contents generated by Seneca should be
     * removed(especially msg.transport$.track). If the contents is not
     * removed, processing the message will fail and the receiver will be down.
     * (This behavior seems to be bug)
     */    
    // msg.cache = true

    const forwardMsg = this.util.clean(msg)
    forwardMsg.cache = true

    // this.act(msg, done)
    this.act(forwardMsg, done)
  })


  seneca.add('store:list,kind:entry', function(msg, done) {
    if( cache[msg.user] ) {
      return done( null, cache[msg.user] )
    }

    /**
     * Before forwarding the message, contents generated by Seneca should be
     * removed(especially msg.transport$.track). If the contents is not
     * removed, processing the message will fail and the receiver will be down.
     * (This behavior seems to be bug)
     */    
    // msg.cache = true
    const forwardMsg = this.util.clean(msg)
    forwardMsg.cache = true

    this.act(forwardMsg, function(err,list){
      if(err) return done(err)
      cache[msg.user] = list
      done(null,list)
    })
  })
}
