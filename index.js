const interpreter = require('./interpreter')
const finterpreter = new interpreter();
const parser= require('./parser')

const fParser = parser.FaustParser.MainParser



let text = `\
nice(a,v)=12+a+v;

process=3,4<: 1,2 :nice(2,4);
`;
// console.log(a)
let ast = fParser.tryParse(text)
parser.prettyPrint(ast);  
console.log(finterpreter)
let res = finterpreter.compile(ast)
console.log(finterpreter)

console.log(res)