module.exports = {
    "presets": [
        ["@babel/preset-env", {
            "targets": {
                "browsers": [
                    "last 1 versions",
                    "IE >= 11"
                ]
            },
            "useBuiltIns": "entry"
            // "useBuiltIns": "usage"
        }],
        ["@babel/preset-flow"]
    ],
    "ignore": [
        "node_modules"
    ],
    "plugins": [
        "@babel/plugin-transform-flow-strip-types",
        "@babel/plugin-transform-for-of",
        ["@babel/plugin-proposal-decorators", {
            "decoratorsBeforeExport": true,
            "version": "nov-2018"
            // "version": "jan-2019"
        }],
        "@babel/plugin-proposal-class-properties",
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": false,
                "helpers": true,
                "regenerator": true,
                "useESModules": false
                // "useESModules": true
            }
        ]
    ]
};
