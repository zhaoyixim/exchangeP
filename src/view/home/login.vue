<script lang="ts" setup>
import { reactive, toRefs,toRef } from "@vue/reactivity";
import validate from "@/utils/validate.js";
import vcache from "@/utils/vcache.js";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import md5 from 'js-md5';
import { showToast  } from 'vant';
//let gettoken = await that.$commonFunc.setToken();
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that:any = proxy;



let formdata = reactive({username:"",password:""})
let flags = reactive({username:true,password:true});
let getvurl =  vcache.vget("vurl")
const  submitClick=async ()=>{
   if(!validate.checkusernamelength(formdata.username)){
    flags.username = false
    return false
   }else flags.username = true;
   if(!validate.checkpasswordlength(formdata.password)){
    flags.password = false
    return  false
   }else flags.password = true;
   formdata.password = md5(formdata.password)
   let gettoken = await that.$commonFunc.setToken(formdata)
   if(gettoken){
    //登陆动作
    let loginurl = '/api/member/login'
    let meminfo = await that.$request.post({url:loginurl,data:formdata})
    if(meminfo){
      vcache.vset("meminfo",meminfo)
      showToast("登录成功");
      const getvurl =  vcache.vget("vurl")
      if(getvurl){
        let revurl = getvurl.replace("#","")
        vcache.vdelete("vurl")
        router.push({path:revurl})
      }else{
        router.push({path:"/index"})
      }     
    }
   }

};

const inputFocus = (item)=>{
 if(item === 0 ) formdata.username = "";else formdata.password = "";
}

</script>
<template>
  <div class="container vh100">
    <div class="form-box-wrap font14 fontbold fontdark"> 
      <div class="lr-title font22">登陆</div>
      <div class="lr-account  lr-input-wrap">
        <div>登陆账号</div>
        <div> <input v-model="formdata.username" @focus="()=>inputFocus(0)" placeholder="请输入账号" type="text" :class='{"lr-input":true,"dangerred":!flags.username}' /> </div>
      </div>
      <div class="lr-passwd  lr-input-wrap">
        <div class="lr-passwd-title-box">
          <div>登陆密码</div>
          <router-link to="/forget" >
            <div class="basefontcolor font13">忘记密码？</div>
          </router-link>
        </div>
        <div> <input v-model="formdata.password" @focus="()=>inputFocus(1)" type="password" placeholder="请输入密码" :class='{"lr-input":true,"dangerred":!flags.password}' /> </div>
      </div>
      <div class="vbtn-box">
        <button class="vbtn  fontbasecolor bgbasecolor3" @click="()=>submitClick()">登陆</button>
        <router-link to="/reg">
          <button class="vbtn basefontcolor bgbasecolor4 margintop10">注册账号</button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "@/assets/css/loginAndreg.scss";
.dangerred{border:1px red solid !important;color:red !important;}
</style>