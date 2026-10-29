module.exports = {
  entry: "./src/main.js",
  output: {
    path: __dirname + "/static",
    filename: "index.js",
    publicPath: "/static",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node-modules/,
        use: ["babel-loader"],
      },
    ],
  },
};
