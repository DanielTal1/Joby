const path= require('path');
const CopyPlugin=require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin}= require('clean-webpack-plugin');

module.exports={
    entry:{
        popup:path.resolve('src/popup/popup.tsx'),
        options:path.resolve('src/options/options.tsx'),
        background: path.resolve('src/background/background.tsx'),
        contentScript_linkedin: path.resolve('src/contentScript/contentScript_linkedin.tsx'),
        contentScript_indeed: path.resolve('src/contentScript/contentScript_indeed.tsx'),
        logged_in:path.resolve('src/popup/logged_in.tsx')
    },
    module:{
        rules:[
            {
                use: 'ts-loader',
                test: /\.tsx?$/,
                exclude: /node_modules/,
            },
            {
                use:['style-loader','css-loader'],
                test: /\.css$/i,
            },
            {
                type:'asset/resource',
                test:/\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets:false,
        }),
        new CopyPlugin({
            patterns:[
                {
                    from:path.resolve('src/static'),
                    to:path.resolve('dist')
                }
            ]
        }),
        ...getHtmlPlugins([
            'popup','options','logged_in'
        ])
    ],
    resolve:{
        extensions:['.tsx','.ts','.js']
    },
    output:{
        filename:'[name].js',
        path: path.resolve('dist')
    },
    optimization:{
        splitChunks:{
            chunks:'all'
        }
    }
}
 
//choose which html chunk in chosen
function getHtmlPlugins(chunks){
    return chunks.map(chunk=>new HtmlPlugin({
        title:'Jobsy',
        filename: `${chunk}.html`,
        chunks:[chunk]
    }))
}