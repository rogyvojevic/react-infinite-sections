var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: path.join(__dirname, "example/index.html"),
	filename: "index.html",
	inject: "body"
});

module.exports = {
	devtool: "source-maps",
	entry: [
		path.join(__dirname, "example/main.js")
	],
	output: {
		path: path.join(__dirname, "dist"),
		filename: "bundle.js",
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		historyApiFallback: true,
		host: "localhost",
		port: 3000,
		open: true
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ["babel-loader"],
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({ fallbackLoader: "style-loader", loader: "css-loader!sass-loader"}),
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		HtmlWebpackPluginConfig,
		new ExtractTextPlugin("style.css"),
		new webpack.HotModuleReplacementPlugin()
	]
};