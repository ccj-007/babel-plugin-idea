const copyOptions = require('./index')

//set default options
function getDefaultOpts (state) {
  if (state && state.opts) {
    state.opts = Object.assign({}, copyOptions, state.opts)
  }
}

function checkOptsVal (state, k) {
  return state && state.opts && state.opts[k]
}

const visitor = {
  //arrow fn name
  VariableDeclarator (path, state) {
    if (checkOptsVal(state, 'debuggerFnName') && path.node.id.name === state.opts.debuggerFnName) {
      path.remove()
      return
    }
    //delete comments
    if (path.node && path.node.trailingComments && path.node.trailingComments.CommentBlock) {
      console.log("1111111");
    }
  },
  DebuggerStatement (path, state) {
    getDefaultOpts()
    if (state.opts.debugger) {
      path.remove()
    }
  },
  // have return value 
  ExpressionStatement (path, state) {
    getDefaultOpts()
    const expression = path.node.expression
    //remove alert
    if (expression.type === 'CallExpression' && expression.callee.name === 'alert' && checkOptsVal(state, 'alert')) {
      path.remove()
      return
    }
    //remove console
    if (expression.type === 'CallExpression' && (expression.callee.object?.name === 'console') && checkOptsVal(state, 'console')) {
      path.remove()
      return
    }

    //remove debugger fn cb
    if (checkOptsVal(state, 'debuggerFnName') && expression.callee.name === state.opts.debuggerFnName) {
      path.remove()
    }
  },
  // normal fn
  FunctionDeclaration (path, state) {
    if (checkOptsVal(state, 'debuggerFnName') && path.node.id.name === state.opts.debuggerFnName) {
      path.remove()
    }
  },

}

module.exports = () => {
  {
    return {
      visitor
    }
  }
}