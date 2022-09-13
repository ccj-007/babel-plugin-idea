/**
 * @description 插入函数调用参数（实现console.log等api的插入文件名和行列号的参数，方便定位到代码）
 * 
 * 将行列打印和console.log分两行打印
 * 难点： 如果在jsx中写法执行两条语句，需要通过数组包裹，意味着要替换原有节点
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;

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

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

traverse(ast, {
  CallExpression (path, state) {
    if (path.node.isNew) {
      return;
    }
    const calleeName = generate(path.node.callee).code;

    if (targetCalleeName.includes(calleeName)) {
      const { line, column } = path.node.loc.start;

      const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)();
      newNode.isNew = true;

      if (path.findParent(path => path.isJSXElement())) {
        path.replaceWith(types.arrayExpression([newNode, path.node]))
        path.skip();  //跳过新节点的遍历
      } else {
        path.insertBefore(newNode);
      }
    }
  }
});

const { code, map } = generate(ast);
console.log(code);
