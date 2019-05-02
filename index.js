const util = require('util')
const P = require('parsimmon')
const Pmath = require('./math.js')

function token(parser) {
    return parser.skip(P.optWhitespace);
  }
  
function word(str) {
    return P.string(str).thru(token);
}

let     FaustTable = [
  { type: Pmath.PREFIX, ops: Pmath.operators({ Negate: "-" }) },
  { type: Pmath.POSTFIX, ops: Pmath.operators({ Delay: "'" }) },
  { type: Pmath.BINARY_RIGHT, ops: Pmath.operators({ Exponentiate: "^" }) },
  { type: Pmath.BINARY_LEFT, ops: Pmath.operators({ Multiply: "*", Divide: "/" }) },
  { type: Pmath.BINARY_LEFT, ops: Pmath.operators({ Add: "+", Subtract: "-" }) },
  { type: Pmath.BINARY_LEFT, ops: Pmath.operators({ Recursive: "~"}) },
  { type: Pmath.BINARY_LEFT, ops: Pmath.operators({ Parallel: "," }) },
  { type: Pmath.BINARY_LEFT, ops: Pmath.operators({ Sequencial: ":" }) },
  { type: Pmath.BINARY_LEFT, ops: Pmath.operators({ Split: "<:" ,Merge:":>"}) }
]
const FaustParser = P.createLanguage({
    Comma:()=>word(","),
    Value: (r)=> {
      return P.alt(
        r.Number,
        r.Symbol
      );
    },       
    Number: ()=> 
      P.regexp(/-?(0|[1-9][0-9]*)([.][0-9]+)?/)
      .map(Number).
      desc("number"),
    Symbol: ()=> 
     P.regexp(/[a-z]+/),
    Identifier:(r)=>
    r.Symbol,
    Parallel: (r)=>
    Pmath.BINARY_LEFT(word(","),r.Recursive).desc("Parallel"),

    Sequencial: (r)=>
    Pmath.BINARY_LEFT(word(":"),r.Parallel).desc("Sequencial"),

    Splitmerge: (r)=> 
    Pmath.BINARY_LEFT(P.alt(r.Split,r.Merge),r.Sequencial),

    Split: (r)=>
            word("<:").desc("Split"),  
    Merge: (r)=>
            word(":>").desc("Merge"),  

    Recursive: (r)=>
      Pmath.BINARY_LEFT(word("~"),r.Basic).desc("Recursive"),

    tableParser : (r)=>{

      console.log(FaustTable);
      FaustTable.reduce(
      (acc, level) => level.type(level.ops, acc),r.Composition)},
    BlockDiagram:(r)=>
      r.Splitmerge
      .trim(P.optWhitespace)
      .desc("composition"),
    Basic:(r)=>
      word("(").then(r.BlockDiagram).skip(word(")")).or(r.Expression),
    Expression:(r)=>
    r.OneDelay.trim(P.optWhitespace).desc("expression"),
    OneDelay:(r)=>
    Pmath.POSTFIX(word("'"),r.FixedDelay).desc("One-Delay"),
    FixedDelay:(r)=>
    Pmath.BINARY_LEFT(word("@"),r.Multiples).desc("Delay"),
    Multiples:(r)=>
    Pmath.BINARY_LEFT(P.alt(P.oneOf("*/%&^"),word("<<"),word(">>")),r.Multiples2).desc("Multiples"),
    Multiples2:(r)=>
    Pmath.BINARY_LEFT(P.oneOf("+-|"),r.Comparison).desc("Multiples2"),
    Comparison:(r)=>
    Pmath.BINARY_LEFT(
      P.alt(
      word("<="),
      word(">="),
      word("=="),
      word("!="),
      word("<"),
      word(">"),

    ),r.Value).desc("Multiples2"),
    Definition:(r)=>
       P.seq(word("process="),r.BlockDiagram.skip(word(";"))).or(
        P.seq(r.Identifier,word("(").then(r.Identifier.sepBy(word(",")).skip(word(")"))),word("="),r.BlockDiagram).skip(word(";"))
       )

    });

function prettyPrint(x) {
  let opts = { depth: null, colors: "auto" };
  let s = util.inspect(x, opts);
  console.log(s);
}
let data  = []
let text = `\
func(a,v)=12~(3<:4+4,hoge);
`;
let text2 = `\
process=12~3<:4+4,hoge;
`;
  let ast = FaustParser.Definition.tryParse(text);
  prettyPrint(ast);  
 ast = FaustParser.Definition.tryParse(text2);
  prettyPrint(ast);  