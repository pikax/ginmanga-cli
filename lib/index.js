"use strict";
/**
 * Created by pikax on 20/03/2017.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var ProgressBar = require("progress");
var pjson = require('../package.json');
var gin = require("gin-downloader");
var hyperquest = require("hyperquest");
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var program = require("commander");
var supported = Object.keys(gin);
var site = gin.mangahere;
var ensureDirFile = function (path) { return new Promise(function (resolve, reject) {
    fs_extra_1.ensureFile(path, function (err) {
        if (err) {
            return reject(err);
        }
        resolve();
    });
}); };
var downloadAndSave = function (src, path, bar) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ensureDirFile(path)];
            case 1:
                _a.sent();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var stream = fs_extra_1.createWriteStream(path);
                        hyperquest(src)
                            .pipe(stream)
                            .on("finish", function () {
                            bar.tick();
                            resolve(true);
                        })
                            .on("error", reject);
                    })];
        }
    });
}); };
function getSite(sitename) {
    site = gin[sitename];
    return site;
}
program.version(pjson.version)
    .usage("-U mangafox")
    .option("-U, --site [site]", "change current web source default mangahere");
program.command("download <manga> <chap>")
    .alias("d")
    .description("downloads to a specific folder")
    .option("-m, --manga <manga>", "Manga name")
    .option("-c, --chapter <chap>", "chapter")
    .option("-p, --path [path]", "set the path where it downloads", 'download')
    .option("-U, --use [site]", "change current web source default mangahere")
    .action(function (manga, chap, cmd) { return __awaiter(_this, void 0, void 0, function () {
    var path, chaps, ex, n1, n2, i, match, reg, bar, tkImgs, _loop_1, _i, chaps_1, c, chapImgs, imgs, _loop_2, _a, chapImgs_1, c, len, images;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                site = getSite(cmd.site || "mangahere");
                if (!site) {
                    return [2 /*return*/];
                }
                if (!manga) {
                    return [2 /*return*/, console.error("No manga provided")];
                }
                if (!chap) {
                    return [2 /*return*/, console.error("No chapter provider")];
                }
                path = cmd.path;
                chaps = Array();
                ex = /^(\d+)~(\d+)$/.exec(chap);
                if (ex) {
                    n1 = +ex[1];
                    n2 = +ex[2];
                    for (i = n1; i <= n2; ++i)
                        chaps.push("" + i);
                }
                else {
                    match = void 0;
                    reg = /\d+/g;
                    while ((match = reg.exec(chap)) !== null) {
                        chaps.push(match[0]);
                    }
                }
                console.log("resolving chapters");
                bar = new ProgressBar('  downloading :current/:total [:bar]  :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: chaps.length
                });
                tkImgs = Array();
                _loop_1 = function (c) {
                    var folder = path_1.resolve(process.cwd(), path, site.config.name, manga, c);
                    var imgs_1 = site.images(manga, +c)
                        .then(function (x) {
                        bar.tick();
                        return x;
                    })
                        .then(function (x) {
                        return {
                            folder: folder,
                            imgs: x
                        };
                    });
                    tkImgs.push(imgs_1);
                };
                for (_i = 0, chaps_1 = chaps; _i < chaps_1.length; _i++) {
                    c = chaps_1[_i];
                    _loop_1(c);
                }
                return [4 /*yield*/, Promise.all(tkImgs)];
            case 1:
                chapImgs = _b.sent();
                bar.terminate();
                console.log('resolved.');
                imgs = Array();
                _loop_2 = function (c) {
                    var im = c.imgs.map(function (i) { return i.then(function (x) {
                        return { src: x.src, path: path_1.resolve(c.folder, x.name) };
                    }); });
                    imgs = imgs.concat(im);
                };
                for (_a = 0, chapImgs_1 = chapImgs; _a < chapImgs_1.length; _a++) {
                    c = chapImgs_1[_a];
                    _loop_2(c);
                }
                len = imgs.length;
                bar = new ProgressBar('  downloading :current/:total [:bar]  :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: len
                });
                bar.tick(0, {
                    curr: 0
                });
                images = imgs.map(function (p) { return p.then(function (x) { return downloadAndSave(x.src, x.path, bar); }); });
                return [4 /*yield*/, Promise.all(images)];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); })
    .on("--help", function () {
    console.log('  Examples:');
    console.log();
    console.log('    $ gin d Gintama 1');
    console.log('    $ gin d Gintama 1,2,3,4');
    console.log('    $ gin d Gintama 1~4');
    console.log('    $ gin d Gintama 500 -p /media/manga');
    console.log();
});
// TODO add table info, about what is supported
program.option("-S, --supported", "Shows supported websites", function () {
    console.log(supported.join("\n"));
});
program.parse(process.argv);
if (typeof site === 'undefined') {
    console.error("site " + program.site + " not valid!");
    program.outputHelp();
    process.exit(1);
}
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map