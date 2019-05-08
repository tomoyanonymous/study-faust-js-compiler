const interpreter = require('./interpreter')
const finterpreter = new interpreter();
const parser= require('./parser')

const fParser = parser.FaustParser.MainParser



// let text = `\
// nice(hoge,fuga)=(hoge,fuga<:+,*):+;

// process=nice(3,6),(3*6);
// `;
let text = `\
nice(hoge,fuga)=(hoge,fuga<:+,*):+;

process= 7:(+ ~ ((_,nice(2,4)):%));
`;
// console.log(a)
let ast = fParser.tryParse(text)
parser.prettyPrint(ast);  
console.log(finterpreter)
let res = finterpreter.compile(ast)
let input = [Array.from({length:100},(x)=>0)]
console.log(finterpreter.compute(input).flat())