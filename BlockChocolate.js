


var TitleWalkMax = 3;
var Timer = 0;
var TimerMax = 60;
var FPS = 240;

//引擎
function BlockChocolateEngine(Canvas,width,height){
    this.TitileWidth = width+1;
    this.TitleHeight = height+1;
    this.TitleFormatWidth = Canvas.width/this.TitileWidth;
    this.TitleFormatHeight = Canvas.height/this.TitleHeight;
    var mCanvas =Canvas;
    var ThreadId ;
    var TitleMapManger  = undefined;
    var MainCamera;
    this.EventCallBack ;
    //添加事件回调函数
    this.addEventListener = function(CallBack){
        this.EventCallBack = CallBack;
    }
    //设置主摄像机
    this.setMainCamera = function(Camera){
        MainCamera = Camera;
    }
    //获取主摄像机
    this.GetMainCamera = function(){
        return MainCamera;
    }
    //设置 瓦片地图 管理器
    this.SetTitleMapMange = function(Manger){
        TitleMapManger = Manger;
    }
    //获取 瓦片地图 管理器
    this.GetTitleMapMange = function(){
       return TitleMapManger ;
    }
    //引擎启动！
    this.Start = function(){
        console.log(' BlockChocolateEngine Author: Mead Ver 0.0.1[Dev Ver] ')
        console.log(' [ BlockChocolateEngine  '+new Date().toLocaleString()+']   Start !')
        if(MainCamera==null||MainCamera ==undefined){
            console.log('[BC Engine Ver 1.0 ] Error Message: 引擎至少需要一个Camera  作为 主视角！');
        }else{
            
        ThreadId = setInterval( function(){
            mCanvas.getContext('2d').fillStyle="#FFFFFF";
            mCanvas.getContext('2d').fillRect(0,0,mCanvas.width,mCanvas.height);
            Timer++;
            if(TitleMapManger!=undefined){
                for(var index= 0 ; index <TitleMapManger.getLayers().length;index++){
                    if(TitleMapManger.getLayers()[index].IsMapBG){
                        
                    TitleMapManger.getLayers()[index].SetCanvas(mCanvas);
                    TitleMapManger.getLayers()[index].DrawOnLayer();
                    }
                }
                TitleMapManger.GetCollLayer().SetCanvas(mCanvas);
                TitleMapManger.GetCollLayer().DrawOnLayer();
                TitleMapManger.GetInteractiveLayer().SetCanvas(mCanvas);
                TitleMapManger.GetInteractiveLayer().DrawOnLayer();
                
                for(var index= 0 ; index <TitleMapManger.getLayers().length;index++){
                    if(!TitleMapManger.getLayers()[index].IsMapBG){
                        
                    TitleMapManger.getLayers()[index].SetCanvas(mCanvas);
                    TitleMapManger.getLayers()[index].DrawOnLayer();
                    }
                }
            }
            if(Timer>=TimerMax){
                Timer = 0;
            }
        },1000/FPS);
        }
    };
    this.Stop = function(){
        clearInterval(ThreadId);
    }
}
//图层
function Layer(IsMapBG,bc){
    this.mcanvas;
    var  Bc = bc;
    this.IsMapBG = IsMapBG;
    //设置是否为背景地图图层
    this.getIsMapBG  = function(Flag){
        return IsMapBG;
    }
    //设置绘图Canvas （引擎内部自动设置）
    this.SetCanvas = function(canvas){
        this.mcanvas = canvas;
    }
    //绘制图层 （引擎内部自动调用）
    this.DrawOnLayer = function(){
        if(!this.IsMapBG){
        for(var index = 0; index<this.Sprites.length;index++){
            this.Sprites[index].DrawSelf(this.mcanvas); 
        }
    }else{
            for(var sprite_index  = 0 ; sprite_index<this.Sprites.length;sprite_index++){
                for(var sprite = 0 ; sprite<this.Sprites[sprite_index].length;sprite++){
                    var TITLE = Bc.GetTitleMapMange().GetTitle(this.Sprites[sprite_index][sprite]);
                    if(TITLE!=null){
               DrawMap(Bc,[sprite,sprite_index],this.mcanvas,TITLE.TITLEIMAGE);
                    }
                }
            
            }
    }
        mcanvas = undefined;
    }
    //图层所 包含 的所有精灵 集合
    this.Sprites  = new Array();
    //向 图层 精灵 集合 中 添加新的精灵
    this.addSprite = function(sprite){
        if(this.IsMapBG){
            console.log("[BlockChocolater Ver 1.0] Error:所选图层为背景地图图层 无法添加精灵");
        }else{
            this.Sprites.push(sprite);
        }
    }
    //删除该图层中精灵集合的 指定精灵
    this.DelSprite = function(Sprite){
        for(var index = 0; index <this.Sprites.length;index++){
            if(Sprite.Name==this.Sprites[index].Name){
                this.Sprites.splice(index,1);
            }
        }
    }
    //返回该图层中的精灵集合
    this.getSprites = function(){
        return this.Sprites;
    }
    //为该 图层 精灵集合 设置 数据源  被设置图层可以是 背景图层 或者 精灵图层
    this.SetMapData = function(Data){
        this.Sprites = Data;
    };
}
//精灵
function Sprite(bc,XY,Name,data){
    var IsColl;
    this.Name = Name;
    this.data =data ;
    this.Animes;
    this.Direction = [0,-1];
    this.PIc ;
    var  Bc = bc ;
    this.TitleX =XY[0];
    this.TitleY=XY[1];
    this.AnimeX= 0;
    this.AnimeY = 0; 
    this.Layer ;
    this.Target = undefined;
    //this.RealMove = false;
    this.StopAnime= false;
    this.CurrentAnime = undefined;
    //设置当前 精灵的 当前动画
    this.SetAnime = function(Anime){
        if(this.target==undefined){
        this.CurrentAnime = Anime;
        if(this.CurrentAnime !=Anime&&this.CurrentAnime!=undefined){
            
        this.CurrentAnime.AnimeStep = 0;
        }
        }
        
    }
    //设置 当前精灵所在的图层
    this.setLayer = function(Layer){
        this.Layer = Layer;
    }
    //播放 当前精灵的  当前动画
    this.PlayAnime= function(target){
            
         this.AnimeX= this.CurrentAnime.AnimeStep/(TimerMax*target[0]);
         this.AnimeY= this.CurrentAnime.AnimeStep/(TimerMax*target[1]);
         if(target[0]==0){
             this.AnimeX = 0;
         }
         if(target[1]==0){
             this.AnimeY = 0;
         }
        
         return this.CurrentAnime.AnimeRun();
    }
    //*****重要方法*******
    //*****重要方法*******
    //*****重要方法*******
    //*****重要方法*******
    //*****重要方法*******
    //*****重要方法*******
    //精灵移动判断器  
    //对精灵 主动移动做出判断 并修改其AnimeX 和 AnimeY 在播放完其CurrentAnime 时 
    //会对 精灵的  TitleX TitleY 进行修改  完成一次完整的主动移动！
    //碰撞 检测也在 该方法内
    this.Move2Target = function(Target,Anime){
        //检测 目标坐标是否为空(不为空 说明当前仍在移动 继续执行移动操作会导致不可预测的错误)
        if(this.Target ==undefined){
            // 检测方法 检测 对象的目标坐标是否为障碍物;
          if(Bc.GetTitleMapMange().CollEvnetCheck([this.TitleX+Target[0],this.TitleY+Target[1]])){
              //如果目标坐标不是障碍物 则将坐标设置为该精灵的移动目标坐标
              this.Target = Target;
              //并将该精灵的当前动画设置为 参数动画
              this.SetAnime(Anime);
           }else{
               //检测 引擎是否添加 时间回调函数
            if(Bc.EventCallBack!=null||Bc.EventCallBack!=undefined){
                //如果添加 则调用回调函数 并返回 flag 为 coll 的事件  包含 目标Sprite  以及 触发Sprite
                this.Target = [0,0];
                this.SetAnime(Anime);
                Bc.EventCallBack(Event('Coll',Bc.GetTitleMapMange().GetCollLayer().getSprites()[this.TitleY+Target[1]][this.TitleX+Target[0]],this));
            
            }
           }
        }
    }
    this.Interactive = function(CallBack){
        if(Bc.GetTitleMapMange().GetInteractiveLayer()==null||Bc.GetTitleMapMange().GetInteractiveLayer()==undefined){
            //如果添加 则调用回调函数 并返回 flag 为 coll 的事件  包含 目标Sprite  以及 触发Sprite   if(Bc.GetTitleMapMange().GetInteractiveLayer()==null||Bc.GetTitleMapMange().GetInteractiveLayer()==undefined){
                console.log('[BC Engine Ver 1.0 ] Error Message: 尚未添加交互图层 请使用BlockChocolat.GetTitleMapMange().SetInteractiveLayer(Layer)添加交互图层!');
            }else{
                var result = Bc.GetTitleMapMange().InteractiveEvnetCheck([this.TitleX+this.Direction[0],this.TitleY+this.Direction[1]]);
                if(result[0]){
                    Bc.EventCallBack(Event('Interactive',result[1],this));
                    CallBack('Success',result[1]);
                }else{
                    CallBack('Have None Sprite at Target Postion!')
                }
            }
        }
    
    //停止播放动画(当一直播放动画时  突然停止动画 不应当立即停止 而是添加停止标识  当动画播放完当前次序 播放下次时 停止 这样不会出现 精灵 动画卡在某一帧)
    this.StopAnimePlay = function(){
        this.StopAnime= true;
    }
    this.setDirection = function(Direction){
        this.Direction = Direction;
    }
    //绘制 精灵自己的 PIc 图片才 Canvas 上
    this.DrawSelf = function(canvas){
            if(this.Animes==null||this.Animes==undefined||this.Animes[0].imgs[0]==undefined||this.Animes[0].imgs[0]==null){
            console.log('[BC Engine Ver 1.0 ] Error Message: 绘制精灵静态图片出现问题， 精灵需要至少一组动画！')
            }else{
                if(this.PIc==null||this.PIc==undefined){
                this.PIc = this.Animes[0].imgs[0];
                }
                if(this.CurrentAnime!=undefined){
                    this.PIc = this.CurrentAnime.imgs[parseInt(this.CurrentAnime.AnimeStep/(TimerMax/ this.CurrentAnime.imgs.length))];
                    if(this.Target!=undefined){
                        if(this.PlayAnime(this.Target)){
                            if(this.Target[0]!=0||this.Target[1]!=0){
                                this.Direction = this.Target;
                            }
                            this.PIc =  this.CurrentAnime.imgs[0];
                            this.AnimeX = 0;
                            this.AnimeY = 0;
                            this.TitleX += this.Target[0];
                            this.TitleY += this.Target[1];
                            Bc.GetMainCamera().LeftTitleX+=this.Target[0];
                            Bc.GetMainCamera().TopTitleY+=this.Target[1];
                            if(this.CurrentAnime.IsLoop){
                                if(this.StopAnime){
                            this.CurrentAnime = undefined;
                            this.Target = undefined;
                            this.StopAnime = false;
                                }
                            }else{
                                this.CurrentAnime = undefined;
                                this.Target = undefined;
                            }
                        }
                    }
                }
                if(canvas==undefined||canvas==null){
                    console.log('[BC Engine Ver 1.0 ] Error Message: 绘制精灵静态图片出现问题， Canvas不合法！')
                }else{
                    DrawSprite(Bc,this,canvas,this.PIc);
                }
        } 
        
    }
}
function BCAnime(imgs,IsLoop,Flag){
    this.AnimeStep = 0;
    this.Flag = Flag;
    this.IsLoop = IsLoop;
    this.imgs = imgs;
    this.AnimeRun = function(){
        if(this.AnimeStep<TimerMax){
            this.AnimeStep++;
            return false;
        }else{
            this.AnimeStep = 0;
            
            return true;
        }

    }
}

//视角摄像机
function Camera(bc){
    this.MainSprite;
    this.LeftTitleX=0;
    this.TopTitleY=0;
    var MapLayer;
    var GUILayer;
    var Bc = bc;
    this.setMainSprite = function(Sprite){
            this.MainSprite = Sprite;
    }
    this.getMainSprite = function(){
        return this.MainSprite;
    }
}
//瓦片地图
function TitleMap(){
    var MapLayer = new Array();
    var CollLayer = undefined;
    var InteractiveLayer = undefined;
    var Titles = new Array();
    this.AddNewTITLE = function(TITLE){
        Titles.push(TITLE);
    }
    this.GetTitle = function(LOGO){
        for(var index = 0; index<Titles.length;index++){
            if(Titles[index].LOGO == LOGO){
                return Titles[index];
            }
        }
        return null;
    }
    this.AddNewLayer = function(Layer){
        MapLayer.push(Layer);
    }
    this.getLayers = function(){
        return MapLayer;
    }
    this.CollLayerAdd = function(Layer){
        CollLayer = Layer;
    }
    this.CollEvnetCheck = function(TargetXy){
        console.log("Check:"+TargetXy)
        return CollLayer.getSprites()[TargetXy[1]][TargetXy[0]] =='space';
    }
    this.InteractiveEvnetCheck = function(TargetXy){
        var item = undefined;
        for(var index = 0;  index <InteractiveLayer.getSprites().length;index++){
            if(InteractiveLayer.getSprites()[index].TitleX==TargetXy[0]&&InteractiveLayer.getSprites()[index].TitleY==TargetXy[1]){
                item = InteractiveLayer.getSprites()[index];
            }
        }
        return [item!=undefined,item];
    }
    this.InteractiveLayerAdd = function(Layer){
        InteractiveLayer = Layer;
    }
    this.GetInteractiveLayer = function(){
        return InteractiveLayer;
    }
    this.GetCollLayer  = function(){
        return CollLayer;
    }
}
//瓦片
function TITLE(LOGO,TITLEIMAGE){
    this.LOGO = LOGO;
    this.TITLEIMAGE = TITLEIMAGE;
}
//瓦片虚拟图片
function TITLEIMAGE(image,left,top,width,height){
this.img = image;
this.left= left;
this.top = top;
this.width = width;
this.height = height;
}
//数据工具类
function THE_BEST_TOOL_CLASS(path){
    this.PATH = path;
    this.getImg=function(name){
        var image = new Image();
        image.src = path+'/'+name;
        return image;
    }
    
}

//    -4
//    -3
//    -2
//    -1       
// 0  -4 -0     -5 -1
//     起始     向下移动
/*
公共绘图方法！
*/
function DrawMap(Camera,XY,canvas,img){
    var ratio = Camera.TitleFormatHeight/img.height; 
    canvas.getContext("2d").drawImage(
        img.img,//原图片
        img.left,//原图片截取位置的左上角X坐标
        img.top,//原图片截取位置的左上角Y坐标
        img.width,//原图片截取尺寸的宽
        img.height,//原图片截取尺寸的高
        (XY[0]-Camera.GetMainCamera().getMainSprite().TitleX)*
        Camera.TitleFormatWidth-Camera.GetMainCamera().getMainSprite().AnimeX*Camera.TitleFormatWidth+
        ((Camera.TitileWidth-1)/2)*Camera.TitleFormatWidth,
        //绘制的精灵在整体实际坐标系里的真实位置X（按照Title瓦片计算）减去
         // 摄像机在整体实际坐标系里的真是位置X（按照Title瓦片计算） 取得当前需要绘制的精灵在摄像机里显示的位置（按照Title瓦片计算）
         // 乘上 摄像机 自动适配的瓦片大小 即可算得 绘制的精灵在摄像机里的真实位置（按照PX计算）
        (XY[1]- Camera.GetMainCamera().getMainSprite().TitleY)*
        Camera.TitleFormatHeight - Camera.GetMainCamera().getMainSprite().AnimeY*Camera.TitleFormatHeight+
        ((Camera.TitleHeight-1)/2)*Camera.TitleFormatHeight,
        //绘制的精灵在整体实际坐标系里的真实位置Y（按照Title瓦片计算）减去
          //摄像机在整体实际坐标系里的真是位置Y（按照Title瓦片计算） 取得当前需要绘制的精灵在摄像机里显示的位置（按照Title瓦片计算）
          // 乘上 摄像机 自动适配的瓦片大小 即可算得 绘制的精灵在摄像机里的真实位置（按照PX计算）
        img.width*ratio+(Camera.TitleFormatWidth-img.width*ratio)/2,//将截取尺寸按比例缩小
        img.height*ratio//将截取尺寸按比例缩小
        );
    
    }
function DrawSprite(Camera,Sprite,canvas,img){
    var ratio = Camera.TitleFormatHeight/img.height;
    // if(Sprite.RealMove){
    // canvas.getContext("2d").drawImage(
    //     img.img,//原图片
    //     img.left,//原图片截取位置的左上角X坐标
    //     img.top,//原图片截取位置的左上角Y坐标
    //     img.width,//原图片截取尺寸的宽
    //     img.height,//原图片截取尺寸的高
    //     (Sprite.TitleX-Camera.GetCamera().LeftTitleX)*Camera.TitleFormatWidth+Sprite.AnimeX*Camera.TitleFormatWidth+((Camera.TitileWidth-1)/2)*Camera.TitleFormatWidth,
    //     //绘制的精灵在整体实际坐标系里的真实位置X（按照Title瓦片计算）减去
    //      // 摄像机在整体实际坐标系里的真是位置X（按照Title瓦片计算） 取得当前需要绘制的精灵在摄像机里显示的位置（按照Title瓦片计算）
    //      // 乘上 摄像机 自动适配的瓦片大小 即可算得 绘制的精灵在摄像机里的真实位置（按照PX计算）
    //     (Sprite.TitleY - Camera.GetCamera().TopTitleY)*Camera.TitleFormatHeight + Sprite.AnimeY*Camera.TitleFormatHeight+((Camera.TitleHeight-1)/2)*Camera.TitleFormatHeight,
    //     //绘制的精灵在整体实际坐标系里的真实位置Y（按照Title瓦片计算）减去
    //       //摄像机在整体实际坐标系里的真是位置Y（按照Title瓦片计算） 取得当前需要绘制的精灵在摄像机里显示的位置（按照Title瓦片计算）
    //       // 乘上 摄像机 自动适配的瓦片大小 即可算得 绘制的精灵在摄像机里的真实位置（按照PX计算）
    //     img.width*ratio+(Camera.TitleFormatWidth-img.width*ratio)/2,//将截取尺寸按比例缩小
    //     img.height*ratio//将截取尺寸按比例缩小
    //     );
    // }else{
      
        canvas.getContext("2d").drawImage(
        img.img,//原图片
        img.left,//原图片截取位置的左上角X坐标
        img.top,//原图片截取位置的左上角Y坐标
        img.width,//原图片截取尺寸的宽
        img.height,//原图片截取尺寸的高
        (((Camera.TitileWidth-1)/2)+(Sprite.TitleX-Camera.GetMainCamera().getMainSprite().TitleX))*Camera.TitleFormatWidth-(
        Camera.GetMainCamera().getMainSprite().AnimeX-Sprite.AnimeX)*Camera.TitleFormatWidth,
        //绘制的精灵在整体实际坐标系里的真实位置X（按照Title瓦片计算）减去
         // 摄像机在整体实际坐标系里的真是位置X（按照Title瓦片计算） 取得当前需要绘制的精灵在摄像机里显示的位置（按照Title瓦片计算）
         // 乘上 摄像机 自动适配的瓦片大小 即可算得 绘制的精灵在摄像机里的真实位置（按照PX计算）
         (((Camera.TitleHeight-1)/2)+(Sprite.TitleY-Camera.GetMainCamera().getMainSprite().TitleY))*Camera.TitleFormatHeight-
         (Camera.GetMainCamera().getMainSprite().AnimeY-Sprite.AnimeY)*Camera.TitleFormatHeight
         ,
        //绘制的精灵在整体实际坐标系里的真实位置Y（按照Title瓦片计算）减去
          //摄像机在整体实际坐标系里的真是位置Y（按照Title瓦片计算） 取得当前需要绘制的精灵在摄像机里显示的位置（按照Title瓦片计算）
          // 乘上 摄像机 自动适配的瓦片大小 即可算得 绘制的精灵在摄像机里的真实位置（按照PX计算）
        img.width*ratio+(Camera.TitleFormatWidth-img.width*ratio)/2,//将截取尺寸按比例缩小
        img.height*ratio//将截取尺寸按比例缩小
        );
        
        var width = canvas.getContext('2d').measureText(Sprite.Name);
      //  mCanvas.getContext('2d').fillStyle="#FF0000";
      //  mCanvas.getContext('2d').fillRect(20,10,width.width,50);
      canvas.getContext('2d').font = 'normal bold  15px Arial '
      canvas.getContext('2d').fillStyle = "#000000";
      canvas.getContext('2d').textBaseline = 'top'
      canvas.getContext('2d').fillText(Sprite.Name, (((Camera.TitileWidth-1)/2)+(Sprite.TitleX-Camera.GetMainCamera().getMainSprite().TitleX))*Camera.TitleFormatWidth-(
            Camera.GetMainCamera().getMainSprite().AnimeX-Sprite.AnimeX)*Camera.TitleFormatWidth +(Camera.TitleFormatWidth/2-width.width/2), (((Camera.TitleHeight-1)/2)+(Sprite.TitleY-Camera.GetMainCamera().getMainSprite().TitleY))*Camera.TitleFormatHeight-
            (Camera.GetMainCamera().getMainSprite().AnimeY-Sprite.AnimeY)*Camera.TitleFormatHeight-15);
        
  //  }
}
function Event(flag,target,origin){
return{flag:flag,target:target,origin:origin,behave:origin.CurrentAnime}
}
