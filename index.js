const http = require('http');
const createHandler = require('github-webhook-handler');
const shell = require('shelljs');

const { MY_SECRET } = process.env;

const REPO_NAME = "REPONAME";
const BRANCH = 'refs/heads/BRANCH';

const PORT = process.env.PORT || 8080;
var handler = createHandler({ path: '/git/deploy', secret: MY_SECRET });

http.createServer(function (req, res) {
    handler(req, res, function (err) {
        res.statusCode = 404
        res.end('no such location')
    })
}).listen(PORT);

handler.on('error', function (err) {
    console.log('Error:', err.messsage);
});

handler.on('push', function (event) {
    const repository = event.payload.repository.name;
    const action = event.payload.action;
    const ref = event.payload.ref;
    console.log('ref: ' + ref);
    console.log('Received a Push Request for %s ', repository);
    if (repository === REPO_NAME && ref === BRANCH) {
        // we should deploy now
        shell.cd('..');
        shell.exec('~/scripts/deploy_dev');
    }
});