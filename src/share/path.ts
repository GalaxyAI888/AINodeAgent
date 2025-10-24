class Path {
  static join(...args: string[]) {
    // 过滤掉空字符串和undefined
    const validArgs = args.filter(arg => arg && arg.trim() !== '');

    if (validArgs.length === 0) {
      return '';
    }

    // 处理第一个参数
    let result = validArgs[0].replace(/\/+$/, '');

    // 处理剩余的参数
    for (let i = 1; i < validArgs.length; i++) {
      const arg = validArgs[i];
      // 移除开头和结尾的斜杠
      const cleanArg = arg.replace(/^\/+|\/+$/g, '');
      if (cleanArg) {
        result = `${result}/${cleanArg}`;
      }
    }

    return result;
  }
}

export default Path;
export { Path };




// 添加测试代码
// console.log(Path.join('https://www.baidu.com', 'test'));
// console.log(Path.join('https://www.baidu.com', 'test', 'test2'));
// console.log(Path.join('https://www.baidu.com', 'test', 'test2', 'test3'));
// console.log(Path.join('https://www.baidu.com', 'test', 'test2', 'test3', 'test4'));
// console.log(Path.join('https://www.baidu.com', 'test', 'test2', 'test3', 'test4', 'test5'));
// console.log(Path.join('https://www.baidu.com', 'test', 'test2', 'test3', 'test4', 'test5', 'test6'));
// console.log(Path.join('https://www.baidu.com', 'test', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7'));
// console.log(Path.join('https://www.baidu.com', 'test', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8'));
// console.log(Path.join('https://www.baidu.com', 'test', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'));
// console.log(Path.join('https://www.baidu.com', 'test', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10'));