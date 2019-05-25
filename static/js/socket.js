var ws = {
  socketobj: null,
  onMsg(cb) {
    this.socketobj.onmessage = function (data) {
      var res = JSON.parse(data.data);
      console.log('_____________', res)
      cb && typeof cb === 'function' && cb(res)
    }
  },
  onSend(msg) {
    let _t = this
    console.log(this.socketobj.send(JSON.stringify(msg)))
  },
  socketClose: function () {
    this.socketobj = null
  },

  async doReCon() {
    this.socketobj && await new Promise((resolve) => {
      this.socketobj = null
      resolve(true)
    })
    await this.consoket();
  },
  consoket() {
    return new Promise((resolve, reject) => {
      if (!this.socketobj) {

        this.socketobj = new WebSocket("wss://test.qingxiet.com:19100");

      }
      this.socketobj.onerror = e => {
        console.log("error: " + e);
        reject(e)
        this.doReCon()
      }

      try {
        this.socketobj.onopen = function () {
          console.log("websocket open")
          resolve(true)
        }
      } catch (e) {
        console.log(e)
      }
      this.socketobj.onclose = this.socketclose
    })
  },

  async reCon() {
    !this.socketobj && await this.doReCon()
  }
}



var ws2 = {
  socketobj: null,
  socketNum: 0,
  //@params
  //cb: socket连接后的回调,  msgcb: 接收消息后的回调
  consoket({
    cb,
    msgcb
  }) {
    return new Promise((resolve, reject) => {
      if (!this.socketobj) {
        this.socketobj = new WebSocket("wss://test.qingxiet.com:19100")

        this.socketobj.onerror = () => {
          reject(false)
          console.log('onError,重连中...')
          setTimeout(() => {
            this.reConnect({
              cb,
              msgcb
            })
          }, 2000)
        }
        this.socketobj.onclose = (e) => {
          console.log('socket close', e);
          if (this.socketNum && this.socketobj) {
            console.log('onClose,重连中...')
            setTimeout(() => {
              this.reConnect({
                cb,
                msgcb
              })
            }, 2000)
          }
        }
        this.socketobj.onopen = () => {
          this.socketNum++;
          console.log("websocket open success")
          if (cb && typeof cb === 'function') {
            cb()
          }
          resolve(true)
        }
        this.socketobj.onmessage = data => {
          this.socketMessage(data, msgcb) //接收消息的回调
        }
      }

    })
  },
  reConnect({
    cb,
    msgcb
  }) {
    this.socketobj = null
    this.consoket({
      cb,
      msgcb
    }).then(res => {
      console.log('重连成功')
    }).catch(err => {
      console.log('重连失败')
    })
  },
  send(msg) {
    console.log(this.socketobj.send(JSON.stringify(msg)))
  },
  //接收消息的回调
  socketMessage(data, msgcb) {
    var res = JSON.parse(data.data);
    console.log('_____________', res)
    msgcb && typeof msgcb === 'function' && msgcb(res)
  },
  //主动关闭socket
  socketClose() {
    this.socketNum = 0
    this.socketobj = null
  },
}