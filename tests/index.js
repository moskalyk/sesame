class TricRunner {

    tests = []    
    totalScs = 0    
    totalErr = 0
    bundledTests = {}
    
    assert(title) {
        this.tests.push(title)
        return (first, second) => {
            if(first == second) {
                console.log('✓ ' + title)
                this.totalScs++ 
            } else {
                console.log('X ' + title)
                this.totalErr++            
            }
        }
    }
    
    assertEval(title) {
        this.tests.push(title)
        return async (first, second) => {
            const res = JSON.stringify(await eval(`var ${first}=${this.bundledTests[first]};(${first}())`))
            let adj = JSON.parse(res)
            console.log(adj)
            // if(JSON.stringify(adj.res).endsWith('\nundefined')) { // TODO: brrp
            //     adj.res = (adj.res.replace('\nundefined', ''))
            //     adj.res = parseInt(adj.res)
            // }
            if(JSON.stringify(adj) == JSON.stringify(second)) {
                console.log('✓ ' + title)
                ++this.totalScs 
            } else {
                console.log('X ' + title)
                this.totalErr++            
            }
        }
    }
    
    assertEvalArgs(title) {
        this.tests.push(title)
        return async (first, second, args) => {
            if(eval('(' + first + `(${args}))`) == second) {
                console.log('✓ ' + title)
                this.totalScs++ 
            } else {
                console.log('X ' + title)
                this.totalErr++            
            }
        }
    }
    

    bundler(bundleID, toBundle) {
        this.log('\n** ' + bundleID)
        toBundle.map((test) => {
            const vari = eval(test).name.toString()
            this.bundledTests[vari] = test
        })
    }   
     
    i(title){
        return {
            assert: this.assert(title)
        }
    }

    ive(title) {
        return{
            assertEval: this.assertEval(title)
        }
    }
    
    ill(title) {
        return{
            assertEvalArgs: this.assertEvalArgs(title)
        }
    }
    
    log(log){
        console.log(log)
    }
    
    // TODO: with eval
    // async complete(){
    //     this.log('\n'+(this.totalScs) + ' / ' + parseInt(this.totalScs + this.totalErr) + ' ✓')
    // }
}

const fs = require('fs')

const TCLParser = (tcl) => {
    const re = /[^"(.*)"{\}]+(?=})/g
    const getFunction = /\'(.*?)\'/
    const TCLBundlerParser = (tcl) => {
        return /"(.*?)"/.exec(tcl)
    }
    return {
        bundler: TCLBundlerParser(tcl)[1], // TODO: create bundle depth
        function: getFunction.exec((tcl.match(re)[0]).split('=')[1].trim('\n'))[1],
        input: JSON.parse(tcl.match(re)[1].trim('\n')),
        output: JSON.parse(tcl.match(re)[2].trim('\n'))
    }
}

const TCLBundlerParser = (tcl) => {
    return /"(.*?)"/.exec(tcl)
}

module.exports = {
    TCLParser,
    TricRunner
}
