const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')
const noDebuggerPlugin = require('./plugin')
const parser = require('@babel/parser');

const code = fs.readFileSync(path.resolve(__dirname, './code.js'), 'utf-8')

const options = {
  debugger: true,
  alert: true,
  console: true,
  comments: true, //是否删除注释
  debuggerFnName: 'startDebugger'
}

const copyOptions = Object.assign({}, options)

//parser解析模板成ast
const ast = parser.parse(code, {
  sourceType: 'module',
});

const result = babel.transformFromAstSync(ast, code, {
  plugins: [
    [
      noDebuggerPlugin,
      {
        debugger: true,
        alert: true,
        console: true,
        comments: true, //是否删除注释
        debuggerFnName: 'startDebugger'
      }
    ]
  ]
})

console.log(result.code)

module.exports = copyOptions

