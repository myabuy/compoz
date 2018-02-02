const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist",
	},
});

// vim: set ts=4 sw=4 noexpandtab:
