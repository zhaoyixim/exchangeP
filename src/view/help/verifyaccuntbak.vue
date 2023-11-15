<script lang="ts" setup>
import { reactive } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { showDialog,showToast } from 'vant';
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that = proxy as object;


</script>
<template>
  <div class="container vh100">
    <commonHeader ftitle="账户验证" /> 
    <div class="margintop10 padding30 bgwhite">
       
        <div class="fontdark  padding20 font14 borderbox borderbottom ">
          以下信息仅平台可见
        </div>
        <div class="pro-body margintop10">          
            <div class="margintop30">
              <div class="font12"> 邮箱地址</div>
              <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
              placeholder="sandifans2me@gmail.com"/>
              <div class="font12 fontgrey">请进入 [账户验证] 页面绑定 </div>
            </div>
            
            <div class="margintop30">
              <div class="font12"> 手机号码</div>
              <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
              placeholder="你的手机号码"/>
              <div class="font12 fontgrey">请进入 [账户验证] 页面绑定 </div>
            </div>

            <div class="margintop30">
              <div class="font12"> Telegram</div>
              <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
              placeholder="你的Telegram号码"/>
              <div class="font12 fontgrey">请进入 [通知设置] 页面绑定 </div>
            </div>

            <div class="margintop30">
              <div class="font12"> 微信号</div>
              <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
              placeholder="你的微信号(选填)"/>
            </div>

            <div class="margintop30">
              <div class="font12"> QQ号</div>
              <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
              placeholder="你的QQ号(选填)"/>
            </div>

            <div class="margintop30 disflex vbtn-fiexd ">
              <button class="vbtn fontbasecolor bgbasecolor3 font12">保存更改</button>                   
             </div>
        </div>  
        
    </div>
  </div>
</template>
<style lang="scss" scoped>
.pro-bottom{line-height: 1.8;}
.borderGrey{border: 2px #EBEDF3  solid; border-radius: 6px; }
.vbtn-fiexd{padding-bottom: 20px;}
.marginright20{margin-right: 20px;}
</style>