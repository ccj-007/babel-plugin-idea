const b = "ccc"

debugger

const startDebugger = (v) => {
  console.log("v===", v);
  return v * v
}
const a = () => {
  const startDebugger = (v) => {
    console.log("v===", v);
    return v * v
  }
  startDebugger(2)
}
// function startDebugger(v) {
//   console.log("v===", v);
//   return v * v
// }


/** @debugger-use */
console.log("cur value", b);

startDebugger(2)

alert('111')
