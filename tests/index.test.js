const { TricRunner, TCLParser } = require('./index');
const fs = require('fs');

const rhythmRunner = async () => {
    
    const min = String(new Date(Date.now()).toISOString().slice(0, 16).split(":")[1])
    const kappa = '^-  @' + '  ' + `.^(@  %gx  /~zod/%assembly/${min}/r/site/%spec)`
    const regex = /\S{2}\((?<type>\S)\s{2}%(?<care>\S{2})\s{2}\/(?<ship>~\S{3})\/(?<desk>%.+)+?\/(?<case>\d+)(?<path>\/\S+)+(?=\/%)\/(?<noun>.+)\)/;
    const scry = kappa.match(regex)
    
    const res = await fetch('http://localhost:3000'+scry.groups.path, {
        method: 'POST',
        body: JSON.stringify({
            case: scry.groups.case
        })
    })
    
    return await res.json()
}

(async () => {
    const runner = new TricRunner()
    
    const data = await fs.readFileSync(__dirname + '/tcl/low.tcl')
    const tcl       = data.toString()
    
    await runner.bundler('in the depfs of code', [
        rhythmRunner
    ])

    // connect
    const min = String(new Date(Date.now()).toISOString().slice(0, 16).split(":")[1])

    const { assertEval: assert } = await runner.ive("should return '123' as msg")
    assert(
        TCLParser(tcl).function,
        { msg: { case: min }, val: { status: true, v: min } }
     )
})()
