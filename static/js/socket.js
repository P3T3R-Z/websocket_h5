function Ws() {
  this.instance = null;
  this.socketobj = null;
  this.consocket = () => {
    if (!this.socketobj) {
      return new Promise((resolve) => {
        this.socketobj = new WebSocket("wss://test.qingxiet.com:19100")

        this.socketobj.onopen = () => {
          console.log("websocket open success")
          resolve(true)
        }

      })
    } else {
      console.log('你已连接socket')
    }

  }
  this.sendmsg = data =>{
    this.socketobj.send(JSON.stringify(data))
  }

  this.socketOnMsg = (cb) => {
    this.socketobj.onmessage = data => {
      var res = JSON.parse(data.data);
      cb(res)
    }
  }
  this.socketOnErr = (cb) => {
    this.socketobj.onerror = (errMsg) => {
      console.log('socket error:', errMsg)
      cb && typeof cb === 'function' && cb()
    }
  }
  this.socketOnClose = (cb) => {
    this.socketobj.onclose = data => {
      console.log('socket close:', data)
      cb && typeof cb === 'function' && cb()
    }
  }

  //主动关闭socket
  this.socketClose = () => {
    this.socketobj = null
  }
}
Ws.getinstance = function () {
  if (!this.instance) {
    this.instance = new Ws()
  }
  return this.instance
}