
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
              case 'MOVE'://14
                console.log("Player Move!");
                OnlinePlayers.forEach(function (Player){
                    if(Player.NAME == json.NAME){
                        Player.x += parseInt(json.X);
                        Player.y +=parseInt( json.Y);
                        wss.clients.forEach(function (client) {
                            client.send('{"ACTION":"MOVED","NAME":"'+Player.NAME+'","X":"'+Player.x+'","Y":"'+Player.y+'"}');
                           
                        });
                    }
                    console.log(Player.NAME+":",Player.x,Player.y);
                })
                    break;
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
  })


function Player(Name,Path){
    this.x = 6;
    this.y= 0;
    this.NAME = Name;
    this.Path = Path;
}