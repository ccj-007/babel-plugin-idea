const { declare } = require('@babel/helper-plugin-utils'); //更好的错误提示
const importModule = require('@babel/helper-module-imports'); // 用于import导入

const autoTrackPlugin = declare((api, options, dirname) => {
  api.assertVersion(7); //兼容版本

  return {
    visitor: {
      Program: {
        //path通过visitor的访问者模式，记录遍历路径的api，记录了父子节点的引用，还有其他增删改查的api   state不同节点传递数据的方式， 全局状态
        enter (path, state) {
          path.traverse({
            //esm 模块的ast节点 curPath
            ImportDeclaration (curPath) {
              //path的get获取source节点，value
              const requirePath = curPath.get('source').node.value;
              // 导入的模块名称 requirePath, 合理通过配置项来检查是否已经导入过，不重复导入
              if (requirePath === options.trackerPath) {
                const specifierPath = curPath.get('specifiers.0');
                if (specifierPath.isImportSpecifier()) {
                  // state跟其他节点的沟通方式
                  state.trackerImportId = specifierPath.toString();
                  // console.log('specifierPath1', state.trackerImportId)
                } else if (specifierPath.isImportNamespaceSpecifier()) {
                  state.trackerImportId = specifierPath.get('local').toString();
                  // console.log('specifierPath2', state.trackerImportId)
                }
                path.stop();  //你已经导入的，没有必须继续遍历
              }
            }
          });
          if (!state.trackerImportId) {
            //需要抽离到helper来减少代码体量, trackerImportId记录ast
            state.trackerImportId = importModule.addDefault(path, 'tracker', {
              nameHint: path.scope.generateUid('tracker')
            }).name;

            //挂载上
            state.trackerAST = api.template.statement(`${state.trackerImportId}()`)();
          }
        }
      },

      //在这些ast节点上挂载
      'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration' (path, state) {
        const bodyPath = path.get('body');  //代码体块
        if (bodyPath.isBlockStatement()) {
          bodyPath.node.body.unshift(state.trackerAST); //增加函数体
        } else {
          //没有函数体，则需要包裹 （箭头函数）
          const ast = api.template.statement(`{${state.trackerImportId}();return PREV_BODY;}`)({ PREV_BODY: bodyPath.node });
          //PREV_BODY 做替换

          // console.log("ast", ast)
          bodyPath.replaceWith(ast);
        }
      }
    }
  }
});
module.exports = autoTrackPlugin;