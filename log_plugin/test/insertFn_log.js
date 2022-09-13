/**
 * @description 插入函数调用参数（实现console.log等api的插入文件名和行列号的参数，方便定位到代码）
 * 
 * 通过visit函数遍历到的ast节点，然后通过callExpression对象的callee，arguments来改造
 * 也就是arguments中插入对应的行列号 stringLiteral(字符串字面量)
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types')

const sourceCode = `
 console.log(1);

 function func() {
     console.info(2);
 }

 export default class Clazz {
     say() {
         console.debug(3);
     }
     render() {
         return <div>{console.error(4)}</div>
     }
 }
`;

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx']
});

traverse(ast, {
  CallExpression (path, state) {
    if (types.isMemberExpression(path.node.callee)
      && path.node.callee.object.name === 'console'
      && ['log', 'info', 'error', 'debug'].includes(path.node.callee.property.name)
    ) {
      const { line, column } = path.node.loc.start;
      path.node.arguments.unshift(types.stringLiteral(`filename: (${line}, ${column})`))
    }
  }
});

const { code, map } = generate(ast);
console.log(code);


