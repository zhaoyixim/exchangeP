import {createStore } from'vuex';
import state from './chat/state'
import mutations from './chat/mutations'
import actions from './chat/actions'
import { io } from 'socket.io-client';
interface stateInt {
    data: Object
    webSocket: WebSocket
    socket:any
}
const state: stateInt = {data: {},webSocket: null,socket:null}
export default createStore({
    state,
    mutations:{
       //websocket初始化
        initWebsocket(state) {
             state.socket = io("http://127.0.0.1:9892").connect();
             // 建立连接的事件
             state.socket.on('connect', () => console.log('connect: websocket 连接成功！'))
           
             state.socket.on('disconnect', () => console.log('disconnect: websocket 连接关闭！'))
             state.socket.on('message', msg => console.log(msg))

             //new WebSocket(
            //     // 此处填写你要连接的ws地址
            // 'ws://127.0.0.1:9892/socket/' + Math.random()
            // );//建立连接
            // state.webSocket.onopen = function () {/* 连接成功 */
            //     console.log('通讯开始');// 发送心跳防止ws协议自动断联
            //     setInterval(() => {
            //         state.webSocket.send('Hello, websocket!')
            //     }, 1000 * 60)
            // }
            // //接收服务端消息
            // state.webSocket.onmessage = function (e) {/* 收到消息时回调函数 */
            //     console.log('收到的数据：', e.data);              
            //     let data = JSON.parse(e.data);// 如果数据对象为字符串，可转换为对象格式
            //     state.data = e.data;
            //     console.log(data);
            // }
            // state.webSocket.onerror = function () {
            //     /* 通讯异常 */
            //     console.log('通讯异常')
            // }
            // state.webSocket.close = function () {
            //     /* 关闭连接时回调函数 */
            //     console.log('连接已断开')
            // }
      },
      testMessage(state){
        state.socket.emit('online', "asdfasf")

       
      }
    },
    actions:{
        
    }
    //modules:{},
})