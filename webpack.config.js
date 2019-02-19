const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractLess = new ExtractTextPlugin({
    filename: "./css/style.bundle.css"
});

const config = {
    entry: ["./src/js/index.js", "./src/less/style.less", "./src/index.pug"],
    output: {
        filename: "./js/bundle.js"
    },
    devtool: "source-map",
    mode: "production",
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                extractComments: true
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: extractLess.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.pug$/,
                use: [
                    {loader: 'file-loader', options: {name: '[name].html'}},
                    'extract-loader',
                    'html-loader',
                    'pug-html-loader'
                ]
            }
        ]
    },
    plugins: [
        extractLess,
        new CopyWebpackPlugin([
            {
                from: "./src/fonts",
                to: "./fonts"
            },
            {
                from: "./src/img",
                to: "./img"
            },
            {
                from: "./src/uploads",
                to: "./uploads"
            }

        ])
    ]
};

module.exports = (env, argv) => {
    if (argv.mode === "production") {
        config.plugins.push(new CleanWebpackPlugin("dist"));
    }
    return config;
};
