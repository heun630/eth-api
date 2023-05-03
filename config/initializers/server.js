const http = require('http');
const express = require('express');
const path = require('path');
const fsRotator = require('file-stream-rotator');
const process = require('process');
const pm2Master = require('pm2-master');
const nconf = require('nconf');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const domain = require('express-domain-middleware');
const morgan = require('morgan');

const gval = nconf.get('gval');
const gfunc = nconf.get('gfunc');
const reswp = nconf.get('reswp');
const notFoundErrorHandler = require(nconf.get('path_middleware') + '/errorHandler');
const logger = nconf.get('logger');
const syscode = nconf.get('syscode');

const start = function (cb) {
    const app = express();

    configureProcessEvents();
    configureServerSettings();
    configureMiddleware(app);
    configureRoutes(app);
    configureErrorHandlers(app);

    createAndListenServer(app, cb);
};

function configureProcessEvents() {
    process.on('message', function (msg) {
        if (msg === 'shutdown') {
            logger.console('process on message: %s', msg);
        }
        logger.console('process on message: %s', msg);
    });

    process.on('uncaughtException', function (err) {
        throw err;
    });

    process.on('unhandledRejection', function (reason, promise) {
        throw reason;
    });
}

function configureServerSettings() {
    http.globalAgent.maxSockets = nconf.get('httpOptions').httpAgentNum;
}

function configureMiddleware(app) {
    configureMorgan(app);
    app.use(bodyParser.urlencoded({limit: nconf.get('httpOptions').packetLimit, extended: true}));
    app.use(bodyParser.json({type: '*/*', limit: nconf.get('httpOptions').packetLimit}));
    app.use(methodOverride());
    app.use(domain);
    configureCORS(app);
}

function configureMorgan(app) {
    const accessLogStream = fsRotator.getStream({
        date_format: gval.DATE_FORMAT.date,
        filename: path.join(nconf.get('logPath'), 'access-%DATE%.log'),
        frequency: 'daily',
        verbose: false,
    });

    morgan.token('date', function (req, res) {
        return gfunc.getLocalCurDateTimeMil();
    });

    const morgan_tokens = ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

    if (nconf.get('NODE_ENV') === 'development') {
        app.use(morgan(morgan_tokens, {}));
    }

    app.use(morgan(morgan_tokens, {stream: accessLogStream}));
}

function configureCORS(app) {
    app.all('/*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Method', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');

        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });
}

function configureRoutes(app) {
    logger.info('[SERVER] Initializing routes');
    require(nconf.get('path_app') + '/routes/index')(app);
}

function configureErrorHandlers(app) {
    app.use(notFoundErrorHandler.notFound);

    app.use(function (err, req, res, next) {
        if (typeof req.body !== 'undefined') {
            logger.printErrorWithCode(syscode.RET_SYSTEM_CRITICAL, 'err body: ' + JSON.stringify(req.body, null, 4) + '\n' + err.message.trim() + '\n' + err.stack);
        } else {
            logger.printErrorWithCode(syscode.RET_SYSTEM_CRITICAL, err.stack);
        }

        reswp.send(res, syscode.RET_SYSTEM_CRITICAL, err.message.trim());
    });
}

function createAndListenServer(app, cb) {
    http.createServer(app).listen(nconf.get('httpOptions').port, function () {
        const master = pm2Master.isMaster() ? 'master' : 'slave';
        logger.info('[SERVER:' + master + '] Listening on port ' + nconf.get('httpOptions').port);

        if (cb) {
            return cb(null, '==> Server Execution Complete!!!');
        }
    });
}
