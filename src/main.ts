import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import request from './utils/request'
import vcache from './utils/vcache.js'
import commonFunc from './utils/vcommon.js'
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import Socketio from "./plugins/Socket.io";

const app = createApp(App)
app.use(router).use(Socketio, {
    connection: "ws://127.0.0.1:9892",
    options: {
      autoConnect: false, //关闭自动连接
      // ...其它选项
    },
  });
app.config.globalProperties.$request = request;
app.config.globalProperties.$vcache = vcache;
app.config.globalProperties.$commonFunc = commonFunc;
app.mount('#app')



