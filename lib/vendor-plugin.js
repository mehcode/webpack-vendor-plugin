// var _ = require("lodash")
// var path = require("path")
var fs = require("fs")

function containsFile(dir, filename) {

  if (!filename)
    return false

  // remove require options
  filename = filename.split('?')[0]
  // take filename only (not loader chains)
  filename = filename.split('!')
  filename = filename[filename.length-1]

  var a = fs.realpathSync(dir)

  try {
    var b = fs.realpathSync(filename)
  } catch(e){
    console.warn('File does not exist', filename)
    return false
  }

  return b.indexOf(a) === 0
}

module.exports = Vendor
function Vendor(options) {
  this.options = options
}

Vendor.prototype.apply = function(compiler) {
  // Build the configuration object
  var options = this.options

  // var chunkNames = this.chunkNames;
  // var filenameTemplate = this.filenameTemplate;
  // var minChunks = this.minChunks;
  // var selectedChunks = this.selectedChunks;
  // var async = this.async;
  // var minSize = this.minSize;
  var vendorModules = null

  compiler.plugin("this-compilation", function(compilation) {
    compilation.plugin("optimize-modules", function(modules) {
      if (vendorModules != null) return

      vendorModules = []
      modules.forEach(function(module) {
        if (module.userRequest == null) {
          // Undefined request name means a generated module normally
          vendorModules.push(module)
        } else if (containsFile(options.dir, module.userRequest)) {
          // If this file is within the source directory ..
          vendorModules.push(module)
        }
      })
    })

    compilation.plugin("optimize-chunks", function() {
      var vendorChunk = this.addChunk("vendor")
      vendorChunk.initial = vendorChunk.entry = true

      var chunks = []

      vendorModules.forEach(function(module) {
        if (module.chunks.indexOf(vendorChunk) >= 0) {
          // If this module is already in the vendor chunk .. skip
          return
        }

        module.chunks.forEach(function(chunk) {
          var idx = chunks.indexOf(chunk)
          if (idx < 0) chunks.push(chunk)

          module.removeChunk(chunk)
          chunk.removeModule(module)
        })

        module.addChunk(vendorChunk)
        vendorChunk.addModule(module)
      })

      chunks.forEach(function(chunk) {
        if (chunk.name !== "vendor") {
          chunk.addParent(vendorChunk)
          chunk.parents = [vendorChunk]
          chunk.entry = false
          vendorChunk.initial = vendorChunk.entry = true
          vendorChunk.chunks.push(chunk)
        }
      })
    })
  })
}
