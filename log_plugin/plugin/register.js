/**
 * 通过日志来调试、通过babel来自动在log等api中插入文件名、行列号，方便定位
 */

const { transformFileSync } = require('@babel/core');
const insertParametersPlugin = require('./plugin/parameters-insert-plugin');
const path = require('path');

const { code } = transformFileSync(path.join(__dirname, './sourceCode.js'), {
  plugins: [insertParametersPlugin],
  parserOpts: {
    sourceType: 'unambiguous',
    plugins: ['jsx']
  }
});

console.log(code);