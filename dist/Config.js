"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var os = require("os");
var fs = require("fs-extra");
var cuid = require("scuid");
var findUp = require("find-up");
var graphql_config_1 = require("graphql-config");
var lodash_1 = require("lodash");
var util_1 = require("./util");
var isDevConsole = (process.env.CONSOLE_ENDPOINT || '').toLowerCase() === 'dev';
var Config = /** @class */ (function () {
    function Config(options) {
        this.debug = Boolean(process.env.DEBUG && process.env.DEBUG.includes('*'));
        this.windows = false;
        this.bin = 'prisma';
        this.mock = true;
        this.argv = process.argv.slice(1);
        this.commandsDir = path.join(__dirname, '../dist/commands');
        this.defaultCommand = 'help';
        this.userPlugins = false;
        this.version = '1.1';
        this.name = 'prisma';
        this.pjson = {
            name: 'cli-engine',
            version: '0.0.0',
            dependencies: {},
            'cli-engine': {
                defaultCommand: 'help',
            },
        };
        this.root = path.join(__dirname, '..');
        this.warnings = [];
        /**
         * Urls
         */
        this.cloudApiEndpoint = process.env.CLOUD_API_ENDPOINT || 'https://api2.cloud.prisma.sh';
        this.consoleEndpoint = isDevConsole
            ? 'http://localhost:3000'
            : 'https://app.prisma.io';
        /* tslint:disable-next-line */
        this.__cache = {};
        this.cwd = (options && options.cwd) || this.getCwd();
        this.home = (options && options.home) || this.getHome();
        this.setDefinitionPaths();
        this.setPaths();
        this.readPackageJson(options);
        if (options && options.mockInquirer) {
            this.mockInquirer = options.mockInquirer;
        }
    }
    Config.prototype.setOutput = function (out) {
        this.out = out;
        this.warnings.forEach(function (warning) { return out.warn(warning); });
        this.warnings = [];
    };
    Object.defineProperty(Config.prototype, "arch", {
        get: function () {
            return os.arch() === 'ia32' ? 'x86' : os.arch();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "platform", {
        get: function () {
            return os.platform() === 'win32' ? 'windows' : os.platform();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "userAgent", {
        get: function () {
            return this.name + "/" + this.version + " (" + this.platform + "-" + this.arch + ") node-" + process.version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "dirname", {
        get: function () {
            return this.pjson['cli-engine'].dirname || this.bin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "cacheDir", {
        get: function () {
            var x = dir(this, 'cache', this.platform === 'darwin'
                ? path.join(this.home, 'Library', 'Caches')
                : null);
            return x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "requireCachePath", {
        get: function () {
            return path.join(this.cacheDir, '/.require-cache.json');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "requestsCachePath", {
        get: function () {
            return path.join(this.cacheDir, '/.requests.json');
        },
        enumerable: true,
        configurable: true
    });
    Config.prototype.findConfigDir = function () {
        var configPath = findUp.sync(['.graphqlconfig', '.graphqlconfig.yml', '.graphqlconfig.yaml'], {
            cwd: this.cwd,
        });
        if (configPath) {
            return path.dirname(configPath);
        }
        return null;
    };
    Config.prototype.readPackageJson = function (options) {
        if (options) {
            this.mock = options.mock;
            this.argv = options.argv || this.argv;
            if (options.root) {
                this.root = options.root;
                var pjsonPath = path.join(options.root, 'package.json');
                var pjson = fs.readJSONSync(pjsonPath);
                if (pjson && pjson['cli-engine']) {
                    this.pjson = pjson;
                    this.version = pjson.version;
                }
            }
        }
        else {
            var root = util_1.getRoot();
            this.root = root;
            var pjsonPath = path.join(root, 'package.json');
            var pjson = fs.readJSONSync(pjsonPath);
            if (pjson && pjson['cli-engine']) {
                this.pjson = pjson;
                this.version = pjson.version;
            }
        }
    };
    Config.prototype.setPaths = function () {
        this.globalPrismaPath = path.join(this.home, '.prisma/');
        this.globalConfigPath = path.join(this.home, '.prisma/config.yml');
        this.globalClusterCachePath = path.join(this.home, '.prisma/cache.yml');
    };
    Config.prototype.warn = function (msg) {
        this.warnings.push(msg);
    };
    Config.prototype.setDefinitionPaths = function () {
        var definitionPath = path.join(this.cwd, 'prisma.yml');
        var definitionPathWithPrisma = path.join(this.cwd, 'prisma', 'prisma.yml');
        if (fs.pathExistsSync(definitionPath)) {
            this.definitionDir = this.cwd;
            this.definitionPath = definitionPath;
        }
        else if (fs.pathExistsSync(definitionPathWithPrisma)) {
            this.definitionDir = path.join(this.cwd, 'prisma');
            this.definitionPath = definitionPathWithPrisma;
        }
        else {
            this.definitionPath = this.getDefinitionPathByGraphQLConfig();
            if (this.definitionPath) {
                this.definitionDir = path.dirname(this.definitionPath);
            }
            else {
                var found = findUp.sync('prisma.yml', { cwd: this.cwd });
                this.definitionDir = found ? path.dirname(found) : this.cwd;
                this.definitionPath = found || null;
            }
        }
    };
    Config.prototype.getDefinitionPathByGraphQLConfig = function () {
        // try to lookup with graphql config
        var definitionPath;
        try {
            var configDir = this.findConfigDir();
            var config = graphql_config_1.getGraphQLConfig(configDir).config;
            var allExtensions = [
                config.extensions
            ].concat(lodash_1.values(config.projects).map(function (p) { return p.extensions; }));
            var prismaExtension = allExtensions.find(function (e) { return Boolean(e && e.prisma); });
            if (prismaExtension) {
                var prisma = prismaExtension.prisma;
                if (!fs.pathExistsSync(prisma)) {
                    prisma = path.join(configDir, prisma);
                }
                definitionPath = path.resolve(prisma);
            }
            this.definitionDir = configDir;
        }
        catch (e) {
            //
        }
        return definitionPath;
    };
    Config.prototype.getCwd = function () {
        // get cwd
        var cwd = process.cwd();
        if (process.env.NODE_ENV === 'test' && process.env.TEST_PRISMA_CLI) {
            cwd = path.join(os.tmpdir(), cuid() + "/");
            fs.mkdirpSync(cwd);
        }
        return cwd;
    };
    Config.prototype.getHome = function () {
        // get home
        var home = os.homedir() || os.tmpdir();
        if (process.env.NODE_ENV === 'test') {
            home = path.join(os.tmpdir(), cuid() + "/");
            fs.mkdirpSync(home);
        }
        return home;
    };
    return Config;
}());
exports.Config = Config;
function dir(config, category, d) {
    var cacheKey = "dir:" + category;
    var cache = config.__cache[cacheKey];
    if (cache) {
        return cache;
    }
    d =
        d ||
            path.join(config.home, category === 'data' ? '.local/share' : '.' + category);
    if (config.windows) {
        d = process.env.LOCALAPPDATA || d;
    }
    d = process.env.XDG_DATA_HOME || d;
    d = path.join(d, config.dirname);
    fs.mkdirpSync(d);
    config.__cache[cacheKey] = d;
    return d;
}
//# sourceMappingURL=Config.js.map