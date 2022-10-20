/**
 * 函数埋点
 * @description 在任一文件导入tracker函数，并在函数ast内部调用tracker
 */

const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');
const autoTrackPlugin = require('./auto-tracker-plugin');
const fs = require('fs');
const path = require('path');

//读取文件
const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.js'), {
  encoding: 'utf-8'
});

//parser解析模板成ast
const ast = parser.parse(sourceCode, {
  sourceType: 'module'
});

//将ast通过transform修改ast， 生成code
const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [[autoTrackPlugin, {
    trackerPath: 'tracker'
  }]]
});

console.log(code);