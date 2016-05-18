# webpack-vendor-plugin
Vendor plugin (separate out vendor files into a separate chunk) for webpack.

# Usage

    var VendorPlugin = require('webpack-vendor-plugin')

    new VendorPlugin({dir: 'node_modules'})


# ChangeLog

    0.4.0   Reversed logic (specify directory to make vendor out of)
    0.3.2   Added documentation + tweaked containsFile() check
    0.3.1
