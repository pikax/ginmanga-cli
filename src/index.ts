/**
 * Created by pikax on 20/03/2017.
 */


import ProgressBar = require("progress");
const pjson = require('../package.json');
import * as gin from 'gin-downloader';
var hyperquest = require("hyperquest");

import {createWriteStream,ensureFile} from 'fs-extra';

import {resolve} from 'path';

import * as program from "commander";
import {ImageSource} from "gin-downloader/lib/declarations";

let supported = Object.keys(gin);
let site = gin.mangahere;


const ensureDirFile = (path: string)=> new Promise((resolve, reject: any)=>{
  ensureFile(path,(err)=>{
    if(err){
      return reject(err);
    }
    resolve();
  })
});


const downloadAndSave = async (src: string, path: string, bar: ProgressBar)=>{
  await ensureDirFile(path);

  return new Promise((resolve,reject)=>{
    let stream = createWriteStream(path);
    hyperquest(src)
      .pipe(stream)
      .on("finish",()=> {
        bar.tick();
        resolve(true)
      })
      .on("error", reject);
  })
};

function getSite(sitename:string) {
  site = (<any>gin)[sitename];
  return site;
}



program.version(pjson.version)
  .usage("-U mangafox")
  .option("-U, --site [site]", "change current web source default mangahere")

;


program.command("download <manga> <chap>")
  .alias("d")
  .description("downloads to a specific folder")
  .option("-m, --manga <manga>", "Manga name")
  .option("-c, --chapter <chap>", "chapter")
  // .option("-n, --no-download", "presents path on console")
  .option("-p, --path [path]", "set the path where it downloads", 'download')
  .option("-U, --use [site]", "change current web source default mangahere")


  .action(async (manga, chap, cmd)=>{
    site = getSite(cmd.site || "mangahere");
    if(!site) {
      return;
    }
    if(!manga) {
      return console.error("No manga provided");
    }
    if(!chap) {
      return console.error("No chapter provider");
    }

    let path = cmd.path;
    let chaps = Array<string>();

    let ex = /^(\d+)~(\d+)$/.exec(chap);
    if(ex){
      let n1 = +ex[1];
      let n2 = +ex[2];

      for (let i = n1; i<=n2; ++i)
        chaps.push(`${i}`);
    }
    else
    {
      let match;

      let reg = /\d+/g;
      while ((match = reg.exec(chap)) !== null) {
        chaps.push(match[0]);
      }
    }

    console.log("resolving chapters");
    let bar = new ProgressBar('  downloading :current/:total [:bar]  :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: chaps.length
    });


    let tkImgs = Array<Promise<{folder:string, imgs: Promise<ImageSource>[]}>>();


    for (let c of chaps) {
      let folder =resolve(process.cwd(), path, site.config.name, manga,c);

      let imgs = site.images(manga, +c)
        .then(x=>{
          bar.tick();
          return x;
        })
        .then(x=>{
          return {
            folder,
            imgs : x
          };
        });

      tkImgs.push(imgs);
    }

    let chapImgs = await Promise.all(tkImgs);
    bar.terminate();
    console.log('resolved.');


    let imgs = Array<Promise<{src: string, path: string}>>();

    for (let c of chapImgs) {

      let im = c.imgs.map(i=>i.then(x=>{
        return {src:x.src, path:resolve(c.folder,x.name)}
      }));

      imgs = imgs.concat(im);
    }

    let len = imgs.length;
    bar = new ProgressBar('  downloading :current/:total [:bar]  :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: len
    });


    bar.tick(0, {
      curr: 0
    });
    let images = imgs.map(p=>p.then(x=>downloadAndSave(x.src, x.path, bar)));
    await Promise.all(images);

  })
  .on("--help", ()=>{
    console.log('  Examples:');
    console.log();
    console.log('    $ gin d Gintama 1');
    console.log('    $ gin d Gintama 1,2,3,4');
    console.log('    $ gin d Gintama 1~4');
    console.log('    $ gin d Gintama 500 -p /media/manga');
    console.log();
  })







// TODO add table info, about what is supported
program.option("-S, --supported", "Shows supported websites", ()=>{
  console.log(supported.join("\n"));
});

program.parse(process.argv);


if (typeof site === 'undefined') {
  console.error(`site ${program.site} not valid!`);
  program.outputHelp();

  process.exit(1);
}


if (!process.argv.slice(2).length) {
  program.outputHelp();
}