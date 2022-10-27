/**
 * 删除console的注释
 */
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
let handleFilePath = path.resolve('./sourceCode.js')
const sourceCode = fs.readFileSync(handleFilePath, {
  encoding: 'utf-8'
})

const ast = parser.parse(sourceCode)

traverse(ast, {
  CallExpression (path) {
    let calleeName = generate(path.node.callee).code
    if (calleeName.includes('console')) {
      path.remove(path.node)
    }
  },
})

const res = generate(ast).code
// console.log(res);