/**
 * 1. 先考虑是否已引入importDeclaration
 */
const { declare } = require('@babel/helper-plugin-utils');

const autoI18nPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    pre (file) {
    },
    visitor: {
      Program: {
        enter (path, state) {
          let imported
          path.traverse({
            ImportDeclaration (p) {
              const source = p.node.source.value
              if (source === 'intl') {
                imported = true
              }
            },
            'StringLiteral|TemplateLiteral' (path) {
              if (path.node.leadingComments) {
                path.node.leadingComments = path.node.leadingComments.filter((comment, index) => {
                  if (comment.value.includes('i18n-disable')) {
                    path.node.skipTransform = true;
                    return false;
                  }
                  return true;
                })
              }
              if (path.findParent(p => p.isImportDeclaration())) {
                path.node.skipTransform = true;
              }
            }
          })

          if (!imported) {
            const uid = path.scope.generateUid('intl');
            const importAst = api.template.ast(`import ${uid} from 'intl'`);
            path.node.body.unshift(importAst);  //将模块写入代码
            state.intlUid = uid;  //模块挂载到state全局
          }
        }
      }
    },
    post (file) {
    }
  }
});
module.exports = autoI18nPlugin;