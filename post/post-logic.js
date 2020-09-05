module.exports = function post (options) {
  var seneca = this

  seneca.add('post:entry', function(msg, done) {
    var entry = this.util.clean(msg)
    delete entry.post

    console.log('Trying to save an entry...')
    console.log(entry)
    entry.when = Date.now()

    this.act('store:save,kind:entry', entry, function(err,entry) {
	done(err)

      if( !err ) {
        this.act('info:entry',entry.data$())
      }
    })
  })
}
