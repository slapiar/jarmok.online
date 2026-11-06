const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const files = new Map([
 ['/', ['index.html', 'text/html; charset=utf-8']],
 ['/index.html', ['index.html', 'text/html; charset=utf-8']],
 ['/style.css', ['style.css', 'text/css; charset=utf-8']],
 ['/guider.js', ['guider.js', 'text/javascript; charset=utf-8']],
]);
const server = http.createServer((req, res) => {
 const file = files.get(new URL(req.url, 'http://localhost').pathname);
 if (!file || !['GET','HEAD'].includes(req.method)) { res.writeHead(404); res.end('Not found'); return; }
 fs.readFile(path.join(__dirname,file[0]),(error,data)=>{
  if(error){res.writeHead(500);res.end('Unable to read file');return;}
  res.writeHead(200,{'Content-Type':file[1],'Cache-Control':'no-store'});
  res.end(req.method === 'HEAD' ? undefined : data);
 });
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.listen(4173,'127.0.0.1',()=>console.log('JARMOK guider: http://127.0.0.1:4173'));
