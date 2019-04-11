

var userUrl = await DatArchive.resolveName(`dat://usertemplate.hashbase.io`);
var usertemplateUrl = `dat://${userUrl}`;





var archive = new DatArchive(usertemplateUrl)

//var evts = archive.watch() // or...
//var evts = archive.watch('foo.txt') // or...
var evts = archive.watch(['**/*.js', '**/*.html'])

evts.addEventListener('invalidated', ({path}) => {
  console.log(path, 'has been invalidated, downloading the update')
  archive.download(path)
})
evts.addEventListener('changed', ({path}) => {
  console.log(path, 'has been updated!')
})

// later:
evts.close()





/*var archive = new DatArchive(datUrl)

var evts = archive.watch(null, ({path}) => {
  console.log(path, 'has been invalidated')
})*/
