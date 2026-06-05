class Deltas {
    port
    selfThrowCallbacks = [   ]
    selfCatchCallbacks = [   ]
    pathSet = new Set()
    s
    constructor(){
        this.s = { listen: (port) => this.listen(port, this) }
    }
    
    throw(path, func){
        if(!this.pathSet.has(path)){
            this.pathSet.add(path)
            this.selfThrowCallbacks.push(['throw', path, func])
        } else {
            throw new Error('overlap in path')
        }
    }
    
    catch(path, func){
        if(!this.pathSet.has(path)) {
            this.pathSet.add(path)
            this.selfCatchCallbacks.push(['catch',path, func])
        } else {
            throw new Error('overlap in path')
        }
    }
        
    listen(port,self){
        const http = require('node:http');
        queueMicrotask(() => {
            // Create an HTTP server
            const server = http.createServer((req, res) => {
            
            const { method, url } = req;
            const parsedUrl = new URL(url, `http://${req.headers.host}`);
            const pathname = parsedUrl.pathname;
            
                if(method=='POST'){
                    const el = self.selfCatchCallbacks.find(el => {
                        return el[1] == pathname && el[0] == 'catch'
                    })

                    let body = '';
                    req.on('data', chunk => {
                      body += chunk.toString();
                    });

                    req.on('end', () => {
                      try {
                        el[2](JSON.parse(body), (val) => {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({msg: JSON.parse(body), val: val}));
                        })
                      } catch (error) {
console.log(error)
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid JSON' }));
                      }
                    });
                } else {
                    const el = self.selfThrowCallbacks.find(el => {
                    return el[1] == pathname && el[0] == 'throw'})
                    el[2]((val) => {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(JSON.stringify({res: val}));
                    })
                }
 
            });

            server.listen(port, 'localhost', () => {
              console.log(`Server running at http://localhost:${port}/`);
            });
        })
        
    }
}

module.exports = Deltas
