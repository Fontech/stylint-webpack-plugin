# stylint-webpack-plugin
*Webpack loader plugin for [stylint](https://github.com/SimenB/stylint) (linter of stylus files)*

## Install

Install the stylint

`npm i stylint -D`

Install stylint-webpack-plugin package

`npm i stylint-webpack-plugin -D`

If you want to use a custom reporter for a stylint, you also need to install it. For example:

`npm i stylint-stylish -D`

This webpack plugin for stylint, which supports specifying a directory or several directories of your project with a 
stylus files. Those files will pass through the linter stylint. By default, lint will use the .stylintrc file in the 
project root if present. But you can configure it in the options. This plugin supports .styl and .vue files.

## Usage

In `webpack` config:

```
const StylintWebpackPlugin = require('stylint-webpack-plugin');

plugins: [
    new StylintWebpackPlugin({
        files: './app/blocks',
        reporter: 'stylint-stylish',
        reporterOptions: {verbose: true}
    })
]
```

## Options

|Name                 |Type            |Default        |Description                                                    |
|:-------------------:|:--------------:|:--------------:|:-------------------------------------------------------------- |
|**`files`**          |`[String,Array]`|`./`            |Stylus files directory or several directories, who need to check|
|**`config`**         |`[String]`      |undefined       |Pass in path to custom rules configuration file as a string. If no configuration is passed in, it will use the .stylintrc file in the project root if present. If that file is not present, it will use default stylint rules.|
|**`rules`**          |`[Object]`      |undefined       |Pass in an object with rules for stylint to lint by. This will override all default rules|
|**`exclude`**        |`[RegExp]`      |`/node_modules/`|Regex for ignores files or sub-directories matching pattern|
|**`reporter`**       |`[String]`      |undefined       |If you want to use a custom reporter, you can pass in either a string with it's name|
|**`reporterOptions`**|`[Object]`      |undefined       |Options for your custom reporter|
