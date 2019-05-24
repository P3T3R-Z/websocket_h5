var ws = {
    socketobj: null,
    onMsg(cb) {
        this.socketobj.onmessage=function (data) {
            var res = JSON.parse(data.data);
            console.log('_____________', res)
            cb && typeof cb === 'function' && cb(res)
        }
    },
    onSend(msg){
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
