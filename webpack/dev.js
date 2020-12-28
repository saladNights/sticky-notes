const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./common');

module.exports = merge(common, {
	mode: 'development',
	target: 'web',
	devtool: 'eval-source-map',
	devServer: {
		contentBase: path.resolve(__dirname, '../dist'),
		hot: true,
		historyApiFallback: true,
	}
});
