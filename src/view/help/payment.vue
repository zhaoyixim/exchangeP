<script lang="ts" setup>
import { reactive, ref } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { showDialog,showToast } from 'vant';

const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that = proxy as object;
const fileList = reactive({data:[]})

const bounceVisibal = ref(false)
const setAddPayment = ()=>{
  bounceVisibal.value = true
}

/**控制账户选择项 */
const accountSetting = ref(false)
/**
* 提交数据
*/
let formdata = reactive({
      data:{       
        accountType:[
            {cname:"请选择",labelvalue:0,key:"",checked:true},
            {cname:"QQ支付",labelvalue:1,key:"qq",checked:false},
            {cname:"微信支付",labelvalue:2,key:"weixin",checked:false},
            {cname:"支付宝",labelvalue:3,key:"alipay",checked:false},
        ],
        accountStyle:[
          {cname:"账户图片",checked:true,labelvalue:1},
          {cname:"账户信息",checked:false,labelvalue:2},          
        ],
      
      }
}) 
const clickAccountType = (e)=>{
  let itemindex = e.target.value
  let items =formdata.data.accountType;
  let item = items[itemindex];
  items.forEach(it=>{it.checked = false});
  item.checked = true
}
const clickAccountStyle = (e)=>{
  let itemindex = e.target.value
  let items =formdata.data.accountStyle;
  let item = items[itemindex];
  items.forEach(it=>{it.checked = false});
  item.checked = true
  if(item.labelvalue === 1) accountSetting.value = false
  else accountSetting.value = true
}
</script>
<template>
  <div class="container vh100">
    <commonHeader ftitle="交易保障" /> 
    <div class="margintop10 padding30 bgwhite">
       
        <div class="fontdark font17 borderbox border-bottom ">
                收款设置
        </div>
        <div class="pro-body borderGrey margintop20">
            <div class="pro-content">
              <div class="text-align icon iconfont icon-shoukuan font88 basecolor"></div>
            </div>
            <div class="pro-bottom padding20 paddingtop0">
              <div class="font18 fontbold basecolor">我的账户</div>
              <div class="fontdark font12 margintop5">
                您可以将您常用的收款账户信息，或账户二维码图片等添加进来，在交易聊天中便捷发送给对方。 
                
              </div>              
            </div>

            <div class="margintop5 disflex vbtn-fiexd">
              <button @click="()=>setAddPayment()" class="btn-outline-primary basecolor basebordercolor font12 marginright20">添加账户</button>  
                         
            </div>
        </div>  
        <div  class="borderbox no-content fontgrey ">暂无相关数据 </div>
    </div>

    <div>
      <van-popup v-model:show="bounceVisibal"  :closeable=true :style="{ padding: '30px' ,borderRadius:'8px'}">
         <div class="borderradius10 borderbox model-boxWrap">            
            <div class="fontdark font16 borderbox borderbottom model-title ">添加账户</div>
            <div class="margintop30">
              <div class="fontdark font12 margintop30">账户类型：</div>
              <div class="select-area disflex borderbox margintop10"> 
                  <div class="select-box borderbox">
                  <select  @change="(e)=>clickAccountType(e)" class="select-item fontdark font12 borderbox input-focus bgbasecolor7 ">
                      <option v-for="(it,index) in formdata.data.accountType" :key="it.labelvalue" :value="index" :selected="it.checked">{{it.cname}}</option>               
                  </select>
                  </div>
              </div>
            </div>
            <div class="margintop30">
              <div class="fontdark font12">账户样式：</div>
              <div class="select-area disflex borderbox margintop10"> 
                  <div class="select-box borderbox">
                  <select  @change="(e)=>clickAccountStyle(e)" class="select-item fontdark font12 borderbox input-focus bgbasecolor7 ">
                      <option v-for="(its,indexs) in formdata.data.accountStyle" :key="its.labelvalue" :value="indexs" :selected="its.checked">{{its.cname}}</option>               
                  </select>
                  </div>
              </div>  
            </div>            
            <div v-if="!accountSetting" class="margintop30">
              <div class="font12"> 账户图片：</div>
              <div class="margintop10">
                <van-uploader v-model="fileList.data" multiple :max-count="1" :deletable="true" />
              </div>
              <div class="font12 fontgrey margintop10">请选择上传您的账户二维码图片</div>
            </div>
            <div v-if="accountSetting" class="margintop30">
              <div class="font12"> 账户信息：</div>
              <van-field 
                rows="4"              
                autosize             
                type="textarea"
                maxlength="100"
                placeholder="请填写账户详细信息"
                show-word-limit
              />
              <div class="font12 fontgrey margintop10 accountinfo-tips">
                请填写账户详细信息如：<br>
                开户行：工商银行<br>
                银行账号：6231394019278888<br>
                账号姓名：易优 
              </div>
            </div>
            <div class="margintop30">
              <div class="font12"> 账户备注：</div>
              <input type="number" class="text-input bgbasecolor7 fontdark font12 borderbox margintop10" 
             placeholder="该备注仅您可看到"/>
            </div>
            <div class="margintop30 disflex justify-spacebetween">
             <div></div>
             <div>
              <button class="vbtn-normal font12 btn-light ">关闭</button>
              <button class="closemarginleft vbtn-normal fontbasecolor bgbasecolor3 font12">提交账户</button>                   
             </div>
            </div>
         </div>
      </van-popup>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.pro-bottom{line-height: 1.8;}
.closemarginleft{margin-left: 10px;}
.borderGrey{border: 2px #EBEDF3  solid; border-radius: 6px; }
.pro-content{padding: 100px;}
.vbtn-fiexd{padding-bottom: 20px;margin-left: 20px;  }
.marginright20{margin-right: 20px;}
.no-content{padding: 88px 0;}
.model-boxWrap{
  width: 322px; overflow: hidden;
  .model-title{padding-bottom:30px;}
}
.van-cell{  margin-top: 20px;  background-color: #F3F6F9;    border-color: #F3F6F9;    color: #3F4254;}
.accountinfo-tips{line-height: 1.8;}
</style>