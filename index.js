const interpreter = require('./interpreter')
const finterpreter = new interpreter();
const parser= require('./parser')

const fParser = parser.FaustParser.MainParser



let text = `\
nice(a,v)=a,v<:2,4;

process=nice(2,4);
`;
// console.log(a)
let ast = fParser.tryParse(text)
parser.prettyPrint(ast);  
console.log(finterpreter)
let res = finterpreter.compile(ast)
console.log(finterpreter)

console.log(res)