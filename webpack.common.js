const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const TypedocWebpackPlugin = require("typedoc-webpack-plugin")
const TSLintPlugin = require("tslint-webpack-plugin")

const extractSass = new ExtractTextPlugin({
	filename: "[name].css",
	disable: process.env.NODE_ENV === "development",
})

module.exports = {
	entry: { compoz: "./src/compoz.ts", test: "./src/compoz.test.ts" },
	plugins: [
		new CleanWebpackPlugin(["dist"]),
		new TSLintPlugin({
			files: ["./src/*.ts", "./src/**/*.ts"],
		}),
		new HtmlWebpackPlugin({
			title: "Compoz Test",
			template: "src/test.tmpl",
		}),
		extractSass,
		new TypedocWebpackPlugin({}, ["./src"]),
	],
	module: {
		rules: [
			{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [{ loader: "css-loader" }, { loader: "sass-loader" }],

					// use style-loader in development
					fallback: "style-loader",
				}),
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "assets/compoz/",
						},
					},
				],
			},
		],
	},
	resolve: { extensions: [".ts", ".js"] },
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		library: "compoz",
	},
}
