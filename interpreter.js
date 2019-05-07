const generator = require("./generator")

class Environment{
    constructor(parent){
        this.parent = parent
    }

    register(name,value){
        return this[name]=value;
    }
    lookup(name){
       if(this[name]){
            return this[name]
        }else if (this.parent!==null){
           return  this.parent.lookup(name)
        }else {
            return null
        }
    }
    extend(){
        const childenv = new Environment(this)
        return childenv
    }
}

module.exports=  class Interpreter{
constructor(){
    const fdeftable = new generator(null)
    this.ftable = fdeftable.gettable()
    this.env= new Environment(null)
    this.currentenv = this.env
}



assign(ast1,ast2){
    var label = ast1
    var args = this.interpret_ast(ast2)
    this.env[label] = args
}

ccall(op,ast1,ast2){
    switch (op) {
        case ",":
            return this.c_par(ast1,ast2)
            break;
        case ":":
            return this.c_seq(ast1,ast2)
            break;
        case "<:":
            return this.c_split(ast1,ast2)
            break;
        case ":>":
            return this.c_merge(ast1,ast2)    
            break;
        case "~":
            return this.c_req(ast1,ast2)
        break
        default:
            break;
    }
}
fun_par(args,_fn1,_fn2,ins1,ins2){
    const fn1=_fn1.apply(null,args.slice(0,ins1))
    const fn2=_fn2.apply(null,args.slice(ins1,ins1+ins2))
    return [fn1,fn2]
}
c_par(a1,a2){
    const ast1 = this.interpret_ast(a1)
    const ast2 = this.interpret_ast(a2)
    const ins = ast1['inputs']+ast2['inputs']
    const outs= ast1['outputs']+ast2['outputs']
        return{
        'inputs':ins,
        'outputs':outs,
        'fn':(args)=>this.fun_par(args,ast1['fn'],ast2['fn'],ins,outs)
        }
}
c_seq(a1,a2){
    const ast1 = this.interpret_ast(a1)
    const ast2 = this.interpret_ast(a2)
    try {
        if(ast1['outputs']!==ast2['inputs']){
            throw new Error(`Sequencial Composition Error inputs:${ast2['inputs']}, outputs: ${ast2['inputs']}`)
        }
        return{
            'inputs':ast1['inputs'],
            'outputs':ast2['outputs'],
            'fn':compose(ast1['fn'],ast2['fn'])
            }
    } catch (e) {
        console.error(e)
    }
}
split_fn(fn1,fn2){
    return fn2.fn.apply(null,Array.from({length: fn2.inputs}, (v, k) => fn1.fn[k%fn1.outputs]))
}
c_split(a1,a2){
    const ast1 = this.interpret_ast(a1)
    const ast2 = this.interpret_ast(a2)
    try {
        if(ast2['inputs']%ast1['outputs']!==0 && ast2['inputs']>=ast1['outputs']){
            throw new Error(`Split Composition Error inputs:${ast2['inputs']}, outputs: ${ast2['inputs']}`)
        }
        return{
            'inputs':ast1['inputs'],
            'outputs':ast2['outputs'],
            'fn': this.split_fn(ast1,ast2)
            }
    } catch (e) {
        console.error(e)
    }
}

merge_fn(fn1,fn2){
    function getinputs(k) {
        return fn1.fn.reduce((accum,v,index)=>{
            if(index%k){accum+v}
        })};
    return fn2.fn.apply(Array.from({lenth:fn2.fn.outputs}, (v,k)=>{ 
            getinputs(k)
        }))
}

c_merge(a1,a2){
    const ast1 = this.interpret_ast(a1)
    const ast2 = this.interpret_ast(a2)
    try {
        if(ast1['inputs']%ast2['outputs']!==0 && ast2['inputs']<=ast1['outputs']){
            throw new Error(`Merge Composition Error inputs:${ast2['inputs']}, outputs: ${ast2['inputs']}`)
        }
        var res_function = ast1['fn'].reduce((acc,crt)=> null)//todo  
        return {
            'inputs':ast1['inputs'],
            'outputs':ast2['outputs'],
            'fn':this.merge_fn(ast1,ast2)
            }
    } catch (e) {
        console.error(e)
    }
}



c_req(a1,a2){
    const ast1 = this.interpret_ast(a1)
    const ast2 = this.interpret_ast(a2)
    try {
        if(ast1['inputs']>=ast2['outputs'] && ast2['inputs']>=ast1['outputs']){
            throw new Error(`Recursive Composition Error inputs:${ast2['inputs']}, outputs: ${ast2['inputs']}`)
        }
        var res_function = ast1['fn'].reduce((acc,crt)=> null)//todo  
        return {
            'inputs':ast1['inputs'],
            'outputs':ast2['outputs'],
            'fn':null//todo
            }
    } catch (e) {
        console.error(e)
    }
}
c_constant(ast){
    if(typeof(ast) !== 'number'){
        console.error(`irregular arguments for constants ${ast}`)
    }
    return {
        'inputs':0,
        'outputs':1,
        'fn':()=>ast
    }
}
search_var(ast1){
    var label = ast1
    var varfromtable = this.currentenv.lookup(label)
    if(varfromtable){
        return this.interpret_ast(varfromtable)
    }else if(this.ftable[label]){
        return this.ftable[label]
    }else{
        console.error("undefined symbol.")
    }
}

Thunk (value) {
    this.get = value;
  }
lazygetinput(fun_ast){
    return  fun_ast;
}
fdef(name,args,body){
    // newenv = new Environment(this.env)
    if(this.currentenv.lookup(name)){
        console.error(`duplicate symbol ${name}`)
    }
    this.currentenv.register(name,
        { 'args':args ,'body':body})
    
}
fcall(name,args){
    try {
    var func = this.currentenv.lookup(name)
    this.currentenv = this.currentenv.extend() //side effect!!!
    func.args.forEach((arg,i)=>this.currentenv.register(arg,args[i]))
    
    const func_interpreted = this.interpret_ast(func.body)
    if(!func){
        throw new Error(`function ${fname} is not defined`)
    }else{
        return {
            'inputs': func_interpreted.inputs-args.length,
            'outputs': func_interpreted.outputs,
            'fn': func_interpreted.fn.bind(args)
        }
    }
    } catch (error) {
        console.error(error)
    }
}
// first layer of ast is array, under that is list(s-expression)
interpret_ast(ast,env=this.currentenv){
    if(typeof(ast)=='number' || typeof(ast)=='string'){
        op=ast
    }else{
        var op = ast[0]
    }
    switch (op) {
        case "fdef":
            return this.fdef(ast[1],ast[2],ast[3])
            break;
        case "assign":
            return this.assign(ast[1],ast[2])
            break;
        case ',':
        case ':':
        case '<:':
        case ':>':
        case '~':
            return this.ccall(ast[0],ast[1],ast[2])
            break;
        case "fcall":
            return this.fcall(ast[1],ast[2])
            break;
        case "constant":
            return this.c_constant(ast[1])
            break;
        default:
            return this.search_var(ast)
            break;
    }


    }
compile(ast_array){
    for(var ast of ast_array){
        this.interpret_ast(ast);
    }
    console.log(this.env)
    if(this.env["process"]){
    return this.env["process"]
    }else{
        console.error("process is not defined")
    }

}



    
}
