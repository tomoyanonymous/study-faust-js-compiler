const util = require('util')


const res_parser =(res,content,pos)=> {
    return {
        "result":res,
        "content":content,
        "pos":pos
    }
}

const parser = (str)=>{
    return res
}

const success = (parseres,parseinput)=>{
    return [parseres,parseinput]
}
const fail =(parseinput)=>{
    return []
}

//test char=>boolean
const satisfy = (testfunction)=>{
    return (input)=>{
        if(input.length === 0) {
            return fail(input)
        }else if(testfunction(input[0])){
            return success(input[0], input.slice(1))
        }else{
            return fail(input)
        }
    }
}

const parseABCD = satisfy(x => ["a", "b", "c", "d"].includes(x));
const str = ("asdf").split("")
const g_res = parseABCD(str)
console.log(JSON.stringify(g_res))

const p_character = (c) => {
    return satisfy(x => x === c);
}

const p_then = (p_first,p_second)=>{
    return input =>
    flatMap(
      first(input),
      ([r, remainder]) =>
        second(remainder).map(
          ([s, secondRemainder]) => [[r, s], secondRemainder]))

}

const lazyThen = (p_first,p_second)=>{
    return input => then(first(), second())(input);
}

const p_map = (fn,parser)=>{
    return input =>
    parser(input).map(([result, remaining]) => [fn(result), remaining]);
}


const p_OR = (p_left,p_right)=>{
    return input => p_left(input).concat(p_right(input))
}

class ParenPair {
    // contents: ParenPair | One;
    constructor(contents) {
      this.contents = contents;
    }
  }
  
class One {};

const parenOne = parser => {
    p_OR(
    p_map(
        ([openParen, [contents, closeParen]]) => new ParenPair(contents),
        p_then(p_character("("), lazyThen(() => parenOne, () => p_character(")")))),
      p_map(
        _ => new One(),
        p_character("1"))
    )
}

g_input = "((1))".split("")
console.log( p_character("(")(g_input))


console.log(util.inspect(parenOne("((1))".split("")), { depth: null }));

const src = "processprocess = 1+2~3*4;"

// console.log(token("process")(src,0))
// console.log(token("process")(src,1))

let data  = []
