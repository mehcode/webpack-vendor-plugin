# webpack-vendor-plugin
Vendor plugin (separate out vendor files into a separate chunk) for webpack.

# Usage

    var VendorPlugin = require('webpack-vendor-plugin')

    new VendorPlugin({dir: './my_source_dir'})


# ChangeLog

    0.3.2   Added documentation + tweaked containsFile() check
    0.3.1