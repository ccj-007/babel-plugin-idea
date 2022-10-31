const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');
const autoDocsPlugin = require('./plugin');
const fs = require('fs');
const path = require('path');

const sourceCode = fs.readFileSync(path.join(__dirname, './code.ts'), {
  encoding: 'utf-8'
});

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['typescript']
});

const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [[autoDocsPlugin, {
    outputDir: path.resolve(__dirname, './docs'),
    format: 'markdown'// html / json
  }]]
});

console.log(code);