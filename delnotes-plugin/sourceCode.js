const c = () => {
  console.log("11111");
  let d = 'ccc'
}

let console = console.log
//@log-ignore
console.log("22222");
function aa () {
  /* @log-ignore */
  let console = '22323'
  console.log('asdasda');
}


