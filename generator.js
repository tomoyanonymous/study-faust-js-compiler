
function def_in_out(mainobj,ident,_in_num,_out_num){
    mainobj.ident.in_num = _in_num;
    mainobj.ident.out_num = _out_num;
}

module.exports = class FunctionDefTable{


    genfIOtable(t,ins,outs){
        return t.map( (symbol)=>{
            return {"symbol" :symbol,
                'inputs':ins,
                'outputs':outs,
                'fn':null}
            }
            )

    }
    add(){
        return ([arg1,arg2])=>(arg1+arg2)
    }
    subtract(){
        return ([arg1,arg2])=>(arg1-arg2)
    }
    multiply(){
        return ([arg1,arg2])=>(arg1*arg2)
    }
    divide(){
        return ([arg1,arg2])=>(arg1/arg2)
    }
    mod(){
        return ([arg1,arg2])=>(arg1%arg2)
    }
    bitand(){
        return ([arg1,arg2])=>(arg1&&arg2)
    }
    bitor(){
        return ([arg1,arg2])=>(arg1||arg2)
    }
    bitxor(){
        return ([arg1,arg2])=>(arg1^arg2)
    }
    greater(){
        return ([arg1,arg2])=>(Number(arg1>arg2))
    }
    ge(){
        return ([arg1,arg2])=>(Number(arg1>=arg2))
    }
    smaller(){
        return (arg1,arg2)=>(Number(arg1<arg2))
    }
    se(){
        return ([arg1,arg2])=>(Number(arg1<=arg2))
    }
    eq(){
        return ([arg1,arg2])=>(Number(arg1==arg2))
    }
    ne(){
        return ([arg1,arg2])=>(Number(arg1!=arg2))
    }
    bitshiftr(){
        return ([arg1,arg2])=>(arg1>>arg2)
    }
    bitshiftl(){
        return ([arg1,arg2])=>(arg1<<arg2)
    }
    pass(){
        return (arg)=> arg
    }
    cut(){
        return arg=>null
    }
    mem(){
        return (arg)=> arg //todo
    }
    constructor(value){
        var ftable2to1 = ["<<",">>","=>","=<","==","!="].concat(("+-*/%&^|<>").split(""))
        var ftable1to1=["_","!","'","mem"]
        var deff
        var fns = [this.bitshiftl(),this.bitshiftr(),this.ge(),this.se(),this.eq(),this.ne(),this.add(),this.subtract(),this.multiply(),this.divide(),this.mod(),this.bitand(),this.bitxor(),this.bitor(),this.greater(),this.smaller(),this.pass(),this.cut(),this.mem(),this.mem()]
        var fIOmap = this.genfIOtable(ftable2to1,2,1)
              .concat(this.genfIOtable(ftable1to1,1,1))
        const fntablearr = fIOmap.map((elem,i)=>{elem["fn"] = fns[i];return elem})
        this.fntable={}
        for(var el of fntablearr){ //stupid translation from array to obj
            this.fntable[el.symbol] = {
                "inputs":el.inputs,
                "outputs":el.outputs,
                "fn":el.fn
            }
        }
    }
      gettable(){
          return this.fntable
      }
}

// class FunctionsTable{
//     constructor(value){

//     }
// }
// class FaustInterpreter{
//     constructor(ast){
//         this.point=0;
//         this.ast=ast;
//         this.idents={};
//     }
//     move(val){
//         this.point+=val
//     }
//     next(){
//         this.move(1)
//     }
//     printcurrent(){
//         console.log(this.ast[this.point])
//     }
//     eval(){
//         let obj = this.ast[this.point]
//         for(let key in obj){
//             this.evalline(key,obj)
//         }
//         this.next()
//     }
//     evalline(key,obj){
//         switch(key){
//             case (key==="Definition"):
//                 let id = obj["Definition"]["Identifier"]
//                 let id = (id.fcall)?id.fcall:id
//                 if(!this.idents[id]){
//                     this.idents[id]
//                 }else{
//                     console.error("Multiple Definition $id")
//                 }
//     }
// }
// }




