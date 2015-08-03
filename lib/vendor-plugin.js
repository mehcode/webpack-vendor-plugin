// var _ = require("lodash")
// var path = require("path")
var fs = require("fs")

function containsFile(dir, filename) {
  try {
    var a = fs.realpathSync(dir)
    var b = fs.realpathSync(filename)
  } catch(e) {
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
        } else if (!containsFile(options.dir, module.userRequest)) {
          // If this file is not within the source directory ..
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

      console.log("vendorModules: %d", vendorModules.length)
      console.log("chunks: %d", chunks.length)

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


  //   compilation.plugin(["optimize-chunks", "optimize-extracted-chunks"], function(chunks) {
  //     if (vendorChunk == null) {
  //       vendorChunk = this.addChunk("vendor")
  //       vendorChunk.initial = vendorChunk.entry = true
  //     }
  //
  //     var modules = []
  //
  //     chunks.forEach(function(chunk) {
  //       if (chunk.name !== vendorChunk.name) {
  //         chunk.modules.forEach(function(module) {
  //           var request = module.request || ""
  //           var reqParts = request.split("!")
  //           var filename = reqParts[reqParts.length - 1]
  //           if (!containsFile(filename)) {
  //             modules.push(module)
  //             chunk.removeModule(module)
  //             module.removeChunk(chunk)
  //           }
  //         })
  //       }
  //     })
  //
  //     modules.forEach(function(module) {
  //       console.log("handle: module =>", module.request)
  //
  //       vendorChunk.addModule(module)
  //       module.addChunk(vendorChunk)
  //     })
  //   })
  // })
}
