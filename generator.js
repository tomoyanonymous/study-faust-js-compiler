const parser = require('./parser')
const FaustParser = parser.FaustParser.MainParser

function def_in_out(mainobj,ident,_in_num,_out_num){
    mainobj.ident.in_num = _in_num;
    mainobj.ident.out_num = _out_num;
}

class FunctionDefTable{
    genfIOtable(table,ins,outs){
        return table.map((symbol)=>{return {'ident':symbol,'inputs':ins,'outputs':outs}})
     }
    constructor(value){
        this.ftable2to1 = ["<<",">>","=>","=<","==","!="].concat(("+-*/%&^|<>").split(""))
        this.ftable1to1=["_","!","'","mem"]

        this.fIOmap = this.genfIOtable(this.ftable2to1,2,1)
              .concat(this.genfIOtable(this.ftable1to1,1,1))
      }

}

class FunctionsTable{
    constructor(value){

    }
}
class FaustInterpreter{
    constructor(ast){
        this.point=0;
        this.ast=ast;
        this.idents={};
    }
    move(val){
        this.point+=val
    }
    next(){
        this.move(1)
    }
    printcurrent(){
        console.log(this.ast[this.point])
    }
    eval(){
        let obj = this.ast[this.point]
        for(let key in obj){
            this.evalline(key,obj)
        }
        this.next()
    }
    evalline(key,obj){
        switch(key){
            case (key==="Definition"):
                let id = obj["Definition"]["Identifier"]
                let id = (id.fcall)?id.fcall:id
                if(!this.idents[id]){
                    this.idents[id]
                }else{
                    console.error("Multiple Definition $id")
                }
    }
}
}

let text = `\
nice(a,v)=12~(3<:4+4,a,v);
process=12~3<:4+4,nice(2,4);
`;
var a = new FunctionDefTable(null);
let ast = FaustParser.tryParse(text)
parser.prettyPrint(ast);  

var INTP = new FaustInterpreter(ast);
INTP.printcurrent("Identifier")
INTP.eval("Identifier")

