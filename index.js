const Deltas = require('./src/deltas/index')
const Toss = require('./lib/toss')

const PORT = process.argv[2] || 3000
const dbPath = process.argv[3] || '/data'

const dlt = new Deltas()
const tss = new Toss(dbPath)

dlt.catch('/r/site', async (req, res) => {
    const obj = {}
    obj['min'] = req.case
    await tss.apnd(obj)
    res(JSON.parse(await tss.look('min')))
})

dlt.s.listen(PORT, () => {
    console.log('booting now on ' + PORT)
})

