# ginmanga-cli
Node cli manga downloader.


``` bash
npm install -g ginmanga-cli 
```


### Supported websites
- [x] MangaFox [*mangafox*]
- [x] MangaPanda [*mangapanda*]
- [x] MangaHere [*mangahere*]
- [x] KissManga [*kissmanga*]


**Usage**

*source*
changing source (default: mangahere)
```bash
ginmanga -U mangafox
```


*download*
```bash
Usage: download|d [options] <manga> <chap>                            
                                                                      
downloads to a specific folder                                        
                                                                      
Options:                                                              
                                                                      
  -h, --help            output usage information                      
  -m, --manga <manga>   Manga name                                    
  -c, --chapter <chap>  chapter                                       
  -p, --path [path]     set the path where it folder                  
  -U, --use [site]      change current web source default mangahere   
  -a, --absolute-path   absolute path                                 
                                                                      
Examples:                                                             
                                                                      
  $ ginmanga d Gintama 1                                                   
  $ ginmanga d Gintama 1,2,3,4                                             
  $ ginmanga d Gintama 1~4    
  $ ginmanga d Gintama 500 -p /media/manga
```




