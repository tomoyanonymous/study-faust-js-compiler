const interpreter = require('./interpreter')
const finterpreter = new interpreter();
const parser= require('./parser')

const fParser = parser.FaustParser.MainParser



let text = `\
nice(hoge,fuga)=(hoge,fuga<:+,*):+;

process=nice(3,6),(3*6);
`;
// console.log(a)
let ast = fParser.tryParse(text)
parser.prettyPrint(ast);  
console.log(finterpreter)
let res = finterpreter.compile(ast)
console.log(res.fn([1,2,3,4]).flat())
