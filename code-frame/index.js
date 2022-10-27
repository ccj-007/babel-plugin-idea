/**
 * =====高亮原理=====
 * 
 * 通过词法分析获取token，然后正则匹配不同token的类型，返回不同颜色
 * 
 * 在控制台打印的是ASCII码，根据此返回不同颜色
 * 
 * chalk就是控制了ASCII显示的颜色字符
 */
const { codeFrameColumns } = require('@babel/code-frame')
const fs = require('fs')
const path = require('path')


let handleFilePath = path.resolve('./sourceCode.js')

const sourceCode = fs.readFileSync(handleFilePath, {
  encoding: 'utf-8'
})

const res = codeFrameColumns(sourceCode, {
  start: { line: 2, column: 1 },
  end: { line: 3, column: 5 }
}, {
  highlightCode: true,
  message: 'error'
})
console.log(res);

