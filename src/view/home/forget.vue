<script lang="ts" setup>
import { reactive } from "@vue/reactivity";
import validate from "@/utils/validate.js";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import md5 from 'js-md5';
import { Button,showToast } from 'vant';
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that:any = proxy;
let formdata = reactive([
  {labelname:"登陆邮箱",labelkey:"email",labelvalue:"", placetxt:"请输入邮箱",required:true,validFunc:"email", checked:true},
  {labelname:"验证码",labelkey:"msgcode",labelvalue:"", placetxt:"请输入验证码",required:true,validFunc:"notEmpty",checked:true},
  {labelname:"新密码",labelkey:"password",labelvalue:"", placetxt:"长度在6-16字符之间", required:true,validFunc:"checkpasswordlength", checked:true},
  {labelname:"再次确认",labelkey:"confirmpasswd",labelvalue:"", placetxt:"请再次确定密码", required:true,validFunc:"checkpasswordagain", checked:true},
])

const  submitClick=async ()=>{
  formdata.forEach(it=>{
     if(it.required){
        if(validate.notEmpty(it.labelvalue)) {
              if(undefined != it.validFunc && it.labelkey === 'confirmpasswd'){
                //重复密码
                if(validate.notEmpty(it.labelvalue)&&validate[it.validFunc](it.labelvalue,formdata[2].labelvalue))  it.checked = true;
                 else it.checked=false;
              }else{
                if(undefined != it.validFunc && validate[it.validFunc](it.labelvalue)) it.checked = true;
                else it.checked=false;
              }
        }else it.checked=false;
    }
  });

  let findItem = formdata.find(it=>!it.checked);
  if(undefined != findItem) {showToast("验证出错");console.log("验证不通过");return ;};
  //验证通过
  let senddata:any= {};
  formdata.forEach(item=>{
     senddata[item.labelkey] = item.labelvalue;
  })
  senddata.password = md5(senddata.password);
  senddata.confirmpasswd = md5(senddata.confirmpasswd);
  let changeurl = "/api/member/changewd";
  let meminfo = await that.$request.post({url:changeurl,data:senddata})

   if(meminfo){
    showToast("修改成功")
     router.push({
      name:'login'
     })
   }

};

const inputFocus = (item)=>{
  item.labelvalue = ""
}
const sendCode = ()=>{  
  if(!validate.notEmpty(formdata[0].labelvalue)){ showToast("请输入邮箱");return ;}
  if(!validate.email(formdata[0].labelvalue)){ showToast("请输入正确邮箱格式");return ;}
  let sendcodeurl:string = '/api/member/sendcode';
  that.$request.post({url:sendcodeurl,data:{email:formdata[0].labelvalue}})
  showToast("已发送，请查收")
}
</script>
<template>
  <div class="container vh100">
    <div class="form-box-wrap font14 fontbold fontdark"> 
      <div class="lr-title font22">重置密码</div>
      <div class=" fontnormal font16 font666 forgettitletips">输入您的电子邮件获取验证码以重置密码</div>
      <div class="lr-input-wrap" v-for="(item,index) in  formdata" :key="index">
        <template v-if="item.labelkey == 'msgcode' ">
          <div>{{item.labelname}}</div>
          <div class="disflex msgcodebox">
            <input type="text" v-model="item.labelvalue" @focus="()=>inputFocus(item)" :class='{"lr-input":true, "msgcodeinput":true, "dangerred":!item.checked}' :placeholder="item.placetxt"  /> 
            <van-button @click="()=>sendCode()" type="primary" class="msgcodebtn bgbasecolor3">获取验证码</van-button>
          </div>
        </template>
        <template v-else>
          <div>{{item.labelname}}</div>
         <div> <input type="text" v-model="item.labelvalue" @focus="()=>inputFocus(item)" :class='{"lr-input":true,"dangerred":!item.checked}' :placeholder="item.placetxt"  /> </div>
        </template>
      </div>
      <div class="vbtn-box">
        <button @click="()=>submitClick()" class="vbtn fontbasecolor bgbasecolor3">提交</button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "@/assets/css/loginAndreg.scss";
.dangerred{border:1px red solid !important;color:red !important;}
.msgcodebox{justify-content: space-between;align-items: center;}
.msgcodeinput{width: 64% !important;}
.msgcodebtn{flex: 1; font-size: 12px !important;}
</style>