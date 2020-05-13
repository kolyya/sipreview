const path = require('path');

module.exports = env => {
    return {
        entry: './src/app.ts',
        devtool: env.production ? 'hidden-source-map' : 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: 'app.js',
            path: path.resolve(__dirname, 'dist'),
        },
    };
};
