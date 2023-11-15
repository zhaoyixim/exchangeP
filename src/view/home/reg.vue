<script lang="ts" setup>
import { reactive } from "@vue/reactivity";
import validate from "@/utils/validate.js";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import md5 from 'js-md5';
import { showToast  } from 'vant';
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that = proxy;
let formdata = reactive([
  {labelname:"账号",labelkey:"username",labelvalue:"", placetxt:"长度在5-16字符之内",required:true, validFunc:"checkusernamelength", checked:true},
  {labelname:"邮箱",labelkey:"email",labelvalue:"", placetxt:"请输入邮箱",required:true,validFunc:"email", checked:true},
  {labelname:"登陆密码",labelkey:"password",labelvalue:"", placetxt:"长度在6-16字符之间", required:true,validFunc:"checkpasswordlength", checked:true},
  {labelname:"推荐码",labelkey:"recode",labelvalue:"", placetxt:"没有可不填",required:false,checked:true}
])

const  submitClick=async ()=>{
  formdata.forEach(it=>{
     if(it.required){
        if(validate.notEmpty(it.labelvalue)) {
              if(undefined != it.validFunc && validate[it.validFunc](it.labelvalue)) it.checked = true;
              else it.checked=false;
        }else it.checked=false;
    }
  });

  let findItem = formdata.find(it=>!it.checked);
  if(undefined != findItem) {console.log("验证不通过");return ;};
  //验证通过
  let senddata:any= {};
  formdata.forEach(item=>{
     senddata[item.labelkey] = item.labelvalue;
  })
  senddata.password = md5(senddata.password);
  let memurl = "/api/member/reg";
  let meminfo = await that.$request.post({url:memurl,data:senddata})

   if(meminfo){
    showToast("注册成功，请登录");
     router.push({
      name:'login'
     })
   }

};

const inputFocus = (item)=>{
  item.labelvalue = ""
}
</script>
<template>
  <div class="container vh100">
    <div class="form-box-wrap font14 fontbold fontdark"> 
      <div class="lr-title font22">注册</div>
      <div class="lr-input-wrap" v-for="(item,index) in  formdata" :key="index">
        <div>{{item.labelname}}</div>
        <div> <input type="text" v-model="item.labelvalue" @focus="()=>inputFocus(item)" :class='{"lr-input":true,"dangerred":!item.checked}' :placeholder="item.placetxt"  /> </div>
      </div>
     
      <div class="vbtn-box">
        <button @click="()=>submitClick()" class="vbtn fontbasecolor bgbasecolor3">注册</button>
        <router-link to="/login" > 
            <button class="vbtn  basefontcolor bgbasecolor4 margintop10">账号登陆</button>
         </router-link>
      </div>
    </div>
   
  </div>
</template>
<style lang="scss">
@import "@/assets/css/loginAndreg.scss";
.dangerred{border:1px red solid !important;color:red !important;}
</style>