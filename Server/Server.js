
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080});
const OnlinePlayers = new Array();
wss.on('connection', function connection(ws,req) {
  ws.on('message', function incoming(message) {
      try{
          var json = JSON.parse(message);
          switch(json.ACTION){
              case 'JOIN':
                  console.log(json.NAME,req.connection.remoteAddress + ":" + req.connection.remotePort);
                    var player = new Player(json.NAME,req.connection.remoteAddress + ":" + req.connection.remotePort);
                    wss.clients.forEach(function (client) {
                        client.send('{"ACTION":"JOINED","NAME":"'+json.NAME+'"}');
                    });
                    OnlinePlayers.forEach(function(player){
                       ws.send( '{"ACTION":"ONLINEPLAYER","NAME":"'+player.NAME+'","X":"'+player.x+'","Y":"'+player.y+'"}');
                    });
                    OnlinePlayers.push(player);
                  break;
              case 'MOVE':
                    wss.clients.forEach(function (client) {
                        client.send('{"ACTION":"MOVED","NAME":"'+json.NAME+'","X":"'+json.X+'","Y":"'+json.Y+'"}');
                        OnlinePlayers.forEach(function(player){
                            if(player.NAME == json.NAME){
                                player.x+=parseInt(json.X);
                                player.y +=parseInt(json.Y);
                            }
                        })
                    });
          }
      }catch{
          console.log("Cant Parse Json:"+message);
      }
  });
  ws.on("close",function close(){
      for(var index = 0 ; index < OnlinePlayers.length;index++){
          player = OnlinePlayers[index];
        if(player.Path == req.connection.remoteAddress + ":" + req.connection.remotePort){
            wss.clients.forEach(function (client) {
                client.send('{"ACTION":"EXIT","NAME":"'+player.NAME+'"}');
                console.log(player.NAME+' Quit the Game!');
            });
            OnlinePlayers.splice(index,1);
            console.log('Now Have '+OnlinePlayers.length+" Players!");
        }
    }
    })
  });


function Player(Name,Path){
    this.x= 0;
    this.y= 1;
    this.NAME = Name;
    this.Path = Path;
}