var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	devtool: "source-map",
	entry: [		
		path.join(__dirname, 'src/main.js')
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.min.js'
	},
	module: {
		loaders: [
		{
			test: /\.jsx?$/,
			loaders: ['babel'],
			exclude: /node_modules/
		},
		{
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!sass-loader'}),
			exclude: /node_modules/        
		}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false
			},
			compress: {
				warnings: false,
				screw_ie8: true
			}
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new ExtractTextPlugin({filename: "style.min.css", allChunks: false})
	]
};