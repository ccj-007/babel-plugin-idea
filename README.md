# babel-plugin-idea

## 关于babel 

babel常见的用于代码的es6语法的转换、也用于处理ts等其他语法的转义。也可以用来处理编译过程中代码生成的ast树(token组合)。

ast树本质就是代码的`抽象tree`的结构，我们可以通过这个抽象节点的深度遍历然后使用visit函数访问，通过@babel/traverse等包的api的处理，我们可以定制化我们的业务需求，将其封装成plugin或loader，生成你需要的定制化代码，比如你可以实现storybook的文档注释直接解析成一个文档对象，实现自动的数据埋点、根据ast结构优化js的编译优化等。

> babel的执行原理：

![](babel.jpg)

> 分析babel ast节点的工具

[](https://astexplorer.net/#/gist/7267e806bfec60b48b9d39d039f29313/c343ad5a76a8dd78c22d39ce89f4d0733c2b17e4)

> 常见的ast节点
  - 标识符 indentifer
  - 字面量 literal
  - 语句 statement
  - 声明语句 Declaration
  - 表达式 Expression
  - class、 module、file、program、 directive、comment
  
> 常用的操作visitor对象的方法：

  - path.traverse(visitor, state)

  - get(key)  获取某个属性的path

