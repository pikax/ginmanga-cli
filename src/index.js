/**
 * Created by pikax on 20/03/2017.
 */


import manga from 'gin-downloader';


let list = {};

for(let key in manga)
	list[manga[key].NAME] = manga[key];


console.log(list);










