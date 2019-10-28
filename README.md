# BlockChocolate 作者:Mead
随笔写的 绘图引擎         写了点事件处理 可以用作游戏引擎 针对性蛮强的 耦合过高  适合做类似于口袋妖怪这种风格的游戏 我一开始也是以复刻口袋妖怪为目的写的这个引擎   名字也是根据特点起的 BlockChocolate ：方格巧克力；


引擎类：
BlockChocolateEngine                               //BlockChocolate 方块巧克力 引擎本体
 
    var BC = new BlockChocolateEngine(document.getElementsByTagName('canvas')[0],20,10); 
    //传入作为展示窗口的Canvas（Width，Height自定），20 为 绘制的瓦片一行个数(Width) 10 为 绘制瓦片的行数(Height);
    方法：
     addEventListener(callback(event));         //添加引擎事件监听器通过此方法可以监听引擎中的事件;     callback(event) =>function(event)
         BC.addEventListener(function(event){
          console.log(event);
        });
     SetTitleMapMange(TitleMap)                //添加引擎瓦片图层管理器;       TitleMap=>TitleMap 瓦片地图管理类
         BC.SetTitleMapMange(TitleMap);
     setMainCamera(MainCamera);                // 为引擎设置主摄像机 及 主视角摄像机 可更改;  MainCamera => Camera;
         BC.setMainCamera(MainCamera);
    Start()                                     //不多说，开造！
         BC.start();
Camera                                             //摄像机类 Canvas 数据展示的主要工具类 

    var Camera = new Camera(BC);                          //BC =>BlockChocolate 引擎主体类
    方法：
    setMainSprite(Player);                     //为摄像机添加主精灵； 摄像机会随着主精灵移动; Player=>Sprite
      Camer.setMainSprite(Player);

Layer                                           //图层类 数据体现的基础类

     var Layer = new Layer(true,BC);  
           //true => boolean 布尔值，设置该图层是否为背景地图图层（不同图层渲染顺序和渲染方法不一样）, BC =>BlockChocolater 引擎主题类 
        方法：
             addSprite();                        //像图层添加 需要渲染的精灵 警告：必须是非背景地图的图层才可以使用该方法 。
                    Layer.addSprite(Sprite);                //Sprite => 精灵类
             setMapData();                      
                    //直接设置图层需要渲染的数据 参数为数组 此方法为 背景地图图层设置背景地图数据的主要方法 设置背景地图数据时 数组必须是二维数组 背景地图中无需渲染的 空位 使用 'space'标识符 占位    
                     Layer.setMapData(Data);          //Data =>精灵数组 或者二位 String地图数据数组 地图数据中无需渲染的空位使用'space'占位;                                
Sprite                                            //精灵类 数据表现的复合类
  
     var Player = new Sprite(BC,[0,1],Name);             //BC =>BlockChocolate 引擎主题类,[0,1] =>初始精灵在 坐标系里的 瓦片坐标 ,Name 精灵头顶的文字
    属性：
                Animes                                          //动画集合 设置 警告：一个Sprit 必须至少需要一组动画！
    方法：
              Move2Taget([x,y],BcAnime)       
                  // 播放动画BcAnime 并移动至 x，y （建议每次一格移动！） 也可以将xy设置为零 进行原地播放BcAnime动画  
                      Player.Move2Target([0,1],RunAnime);

              StopAnimePlay();                    //如果 精灵当前播放的动画IsLoop 属性为 True  动画将自动循环播放 直至调用该方法。
                       Player.StopAnimePlay();

       Interactive(Callback(flag,result));      //与该精灵目前方向的下一格 交互图层上的精灵进行交互  并触发回调
          Player.Interactive(function(flag,reslut){           //回调函数 包含两个参数 flag 触发信息 以及  被触发的 精灵 reslut;
             if(flag=='Success'){               //如果触发信息时 ‘Success’ 即 当前目标位置（精灵面朝方向的下一格）在交互图层上有可交互的精灵
                 console.dir(reslut);           // 打印 被 触发的精灵 reslut              reslut 为 目标位置的精灵
             }else{
                 console.log(flag);
             }
         })
        
TitleMap                                            //瓦片地图 管理类   数据处理的复合类
   
          var TitleMap = new TitleMap();
    方法: 
        AddNewTITLE(Title);                         //添加瓦片;
             TitleMap.AddNewTITLE(TITLE)            // TITLE => TITLE; //TITLE为瓦片类；
        InteractiveLayerAdd(Layer);           //添加交互图层; (事件发生时会被 BlockChocolate 的 事件监听器 获取到；可在回调函数进行额外操作)
             TitleMap.InteractiveLayerAdd(Layer);   //Layer => Layer    //Layer 为 图层类;
        CollLayerAdd(Layer)                   //添加碰撞图层类; (事件发生时会被 BlockChocolate 的 事件监听器 获取到；可在回调函数进行额外操作)
             TitleMap.CollLayerAdd(Layer);          //Layer => Layer    //Layer 为 图层类;

TITLEIMAGE                                           //基础瓦片图片类 作为瓦片类的数据补充
   
   var TITLEIMG = new TITLEIMAGE(DemoPng,73,106,4,"Anime")          
       //DemoPng 通过工具类获得 图片数据;
       //73,106为单独一帧在原图片的上宽高 4 为 一共几列  一列为一组动画


工具类：
THE_BEST_TOOL_CLASS:                               //工具类 目前只添加了读取图片方法；

            var Tool = new THE_BEST_TOOL_CLASS('.'); //创建以"./"为父目录的读取工具类
    方法:
        getImg(path)                              //从父级目录读取图片;   path=>String;     
            Tool.getImg('Demo.png');                 //从父目录中读取'Demo.png'作为Image返回;     
        ReadXMLGetLayers(PATH,TITILEMAP)          //从指定路径的tmx文件读取信息并格式化为图层对象存入TITLEMAP图层管理器中 默认最后一个图层（TITLEMAPEDITER中最上层图层为碰撞图层）;