const path = require('path');
const livereload = require('livereload');
const lrserver = livereload.createServer({ port: 35729, delay: 1000 });
lrserver.debug('Livereload: browser reloaded');
lrserver.watch(path.join(__dirname,"build"));