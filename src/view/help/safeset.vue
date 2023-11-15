<script lang="ts" setup>
import { reactive } from "@vue/reactivity";
import commonFooter from "@/components/common/commonFooter.vue";
import commonHeader from "@/components/common/commonHeader.vue";

import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { showDialog,showToast } from 'vant';
import md5 from 'js-md5';
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that:any = proxy as object;
const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
  userinfo.data = that.$vcache.vget("meminfo")
 /**
   * 提交数据
   */
   const formdata = reactive({      
      loginCode:[
        {cname:"登录账号",cvalue:userinfo.data.username,placetxt:"",enabled:true},
        {cname:"登录邮箱",cvalue:userinfo.data.email,placetxt:"请输入登录密码",enabled:true},
        {cname:"旧密码",cvalue:"",placetxt:"请输入登录密码",enabled:false,checked:false},
        {cname:"新密码",cvalue:"",placetxt:"请输入新密码",enabled:false,checked:false},
        {cname:"密码确认",cvalue:"",surePw:true, placetxt:"请再次输入密码",enabled:false,checked:false}
      ]
  }) 
const submitBtn =async () =>{
    let saveData =formdata.loginCode.filter(res=>{
        if(!res.enabled) return res;
    })
    if(saveData && saveData[0].cvalue && saveData[1].cvalue){
        let postData = {
            oldPw:md5(saveData[0].cvalue),
            newPw:md5(saveData[1].cvalue),
        }
        let renewPw =md5(saveData[2].cvalue)
        if(renewPw != postData.newPw){
            showToast('两次输入密码不匹配')
             return ;
        }
        if(saveData[1].cvalue.length <6){
            showToast('长度需要至少6个字符')
            return ; 
        }
        const changePW= '/api/member/profilechangewd'
        const returnjson = await that.$request.post({url:changePW,data:postData})
        if(returnjson){
            showToast('修改完成');
            setTimeout(()=>{
                router.push({path:'/login'})
            },500)            
        }
    }else{
        showToast('请填写完数据');
    }
    console.log(saveData,"saveData")
}
const inputBlur = (item:any) =>{   
    if(!item.enabled ){
        if(item.cvalue){
            if(item.cvalue.length > 6){
                showToast('长度需要至少6个字符')
                return ; 
            }
            item.checked = true
        }else{
            showToast(item.placetxt)
            return ;
        }
        if(item.surePw){            
            let pwd1 = formdata.loginCode[3].cvalue;
            console.log(pwd1,item.cvalue,item.cvalue == pwd1)
            if(item.cvalue != pwd1){
                showToast('两次输入密码不匹配')
                item.checked=false
            }
        }       
    }   
}
const toLogin = () => {
    router.push({path:'/login'})
}
</script>
<template>
  <div class="container vh100">  
    <commonHeader ftitle="安全设置" />
    <div class="p-wrap bgwhite margintop10 paddingbottom20">  
        <div class="padding20 paddingbottom0">
            <div class="fontdark font17 borderbox paddingbottom20 borderbottom">登录密码</div>            
            <div class="disflex padding20 bordergrey margintop30 align-items-center">
                <div class="icon iconfont icon-gantanhao1 font36 fontdanger margintop10"></div>
                <div class="font12 fontdark model-title-content">
		        	    如果您遗忘了登录密码，请移步至 <span @click="()=>toLogin()" class="basecolor">登录页面></span>
                  ，点击 <b>忘记密码</b> 进行找回。
			          </div>
            </div>      
        </div>

        <div class="padding20 fontdark margintop10 paddingtop0"> 
            <div v-for="(it,index) in formdata.loginCode" :key="index" class=" input-wrap  font12 align-items-center borderradius4 margintop15">
                <div class="disflex">
                    <div class="paddingbox2 bgbasecolor7 fontbold">{{it.cname}}</div>  
                    <div class="input-box bordergrey">
                        <input  type="text" :placeholder="it.placetxt"
                        v-model="it.cvalue" :disabled="it.enabled" @blur="()=>inputBlur(it)"
                        class="borderbox font14 input-item text-input" />                    
                    </div>
                </div>
                                    
                <div class="fontB5 font12 margintop5 tipsFixed">长度需要至少6个字符</div>   
                
                        
            </div>
        </div>
        <div class="padding20 disflex justify-spacebetween">    
            <div></div>        
            <button @click="()=>submitBtn()" class="vbtn fontbasecolor bgbasecolor3 font14">提交修改</button>                   
        </div>
    </div>
    
    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss" scoped>
.title-label{padding:12px 0;
    .wizard-title{margin-bottom: 0.5rem;}
}
.border-bottom{border-bottom: 4px #8950FC solid;}

.border-bottom-grey{border-bottom: 3px #EBEDF3 solid;}
.uiconfixed::before{position: relative;top: 2px;}
.model-title-content{padding-left: 20px;}
.tipsFixed{margin-left: 20px;}
</style>