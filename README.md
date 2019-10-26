# BlockChocolate
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
  
  var Player = new Sprite(BC,[0,1]);             //BC =>BlockChocolate 引擎主题类,[0,1] =>初始精灵在 坐标系里的 瓦片坐标
工具类：
THE_BEST_TOOL_CLASS:                               //工具类 目前只添加了读取图片方法；
            var Tool = new THE_BEST_TOOL_CLASS('.'); //创建以"./"为父目录的读取工具类
       方法:
        getImg(path)                              //从父级目录读取图片;   path=>String;     
            Tool.getImg('Demo.png');                 //从父目录中读取'Demo.png'作为Image返回;     
