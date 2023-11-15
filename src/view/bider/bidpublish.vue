<script lang="ts" setup>
import { reactive, ref } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { showDialog,showNotify,showToast } from 'vant';
import stepOne from "./bid/step1.vue";
import stepTwo from "./bid/step2.vue";
import stepThree from "./bid/step3.vue";
import stepFour from "./bid/step4.vue";
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that = proxy as object;
const stepData = reactive({step1:{},step2:{},step3:{},step4:{}});
const currentPriceInt =ref("6.90")
const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
userinfo.data = that.$vcache.vget("meminfo")

const stepBtn = ref(1)
const toFreeze = () =>{
  router.push({path:'/protection'})
}
stepBtn.value = 1
const stepIntClick = (data: { data: { step: any; }; }) =>{
  stepBtn.value += 1;  
  const stepInc = data.data.step
  stepData['step'+stepInc] = data.data
  if(stepBtn.value >4) stepBtn.value = 4;
  if(stepInc == 4){
    //数据提交
    submitData()
  }  
}
const initDatas = ref(0);
const passLimitUsdt = ref(false)
const InitData = async()=>{
  const initUrl = "/api/trans/defaultLimitUsdt";
  initDatas.value = await that.$request.get({url:initUrl});
  passLimitUsdt.value =(parseInt(userinfo.data.usdt)-initDatas.value > 0)?true:false;
}
InitData()
const stepDecClick = (data: any) =>{
  stepBtn.value -= 1;  
  const stepInc = data.data.step
  if(stepBtn.value <=0) stepBtn.value = 0;
  if(stepInc >0){
    stepData['step'+stepBtn.value] = {}
  }
}

/**数据提交 */
let forSubmitData = {};
const submitData = async() => {
  forSubmitData.bidType = stepData.step1.setbid.find(it=>it.checked).labelvalue;
  forSubmitData.bidPriceType = stepData.step1.bidtype.find(it=>it.checked).labelvalue;
  forSubmitData.bidPrice = stepData.step1.bidprice;
  forSubmitData.realPrice = stepData.step1.realPrice;
  forSubmitData.bidMethod = stepData.step1.bidmethod.find(it=>it.checked).cname;
  forSubmitData.bidMethodNum = stepData.step1.bidmethod.find(it=>it.checked).labelvalue;
  
  forSubmitData.bidRmbMax = stepData.step2.bidlimit.higherprice;
  forSubmitData.bidRmbMin = stepData.step2.bidlimit.lowprice;
  forSubmitData.bidUsdtMax = stepData.step2.bidUsdtLimit.higherprice;
  forSubmitData.bidUsdtMin = stepData.step2.bidUsdtLimit.lowprice;
  forSubmitData.sellCount = stepData.step2.sellCount;

  forSubmitData.validPeriod = stepData.step2.ValidPeriod;
  forSubmitData.bidTimes = stepData.step2.times; 
  forSubmitData.askBailNums = stepData.step2.baitdata;
  if(stepData.step2.imageFiles?.length<=0) forSubmitData.imageFiles ="";
  else {forSubmitData.imageFiles = stepData.step2.imageFiles;}
  
  forSubmitData.orderStartDate = stepData.step3.orderStartDate;
  forSubmitData.orderStartTime = stepData.step3.orderStartTime;
  forSubmitData.orderEndDate = stepData.step3.orderEndDate;
  forSubmitData.orderEndTime = stepData.step3.orderEndTime;

  forSubmitData.bidTitle = stepData.step4.title;
  const priceTitle = stepData.step4.priceTitle.filter(it=>it.checked);
  forSubmitData.bidPriceTitle = JSON.stringify(priceTitle);
  forSubmitData.bidDesp = stepData.step4.despcontent; 

  const createBailUrl = "api/bid/createBidOrder";
  let rebackdata = await that.$request.post({url:createBailUrl,data:forSubmitData});
  if(rebackdata == 'ok'){
    showToast('提交成功')
    that.$commonFunc.updatememinfo()
    setTimeout(() => {
      router.push({path:"/bidmanager"})
    }, 500);    
  }
}
</script>
<template>
  <div class="container vh100">  
    <div class="p-wrap bgwhite">
        <commonHeader ftitle="发布交易出价" /> 
        <div class="margintop10 padding20 p-title-wrap font14">
            <div :class='["title-label","fontbold","borderbox","borderbox",stepBtn == 1?"basecolor font13 border-bottom":"fontB5 border-bottom-grey",]'>
                1、设置出价
            </div>
            <div  :class='["title-label","fontbold","borderbox","borderbox",stepBtn == 2?"basecolor font13 border-bottom":"fontB5 border-bottom-grey",]'>   
                <span class="font20">2、</span>交易设置
            </div>
            <div :class='["title-label","fontbold","borderbox","borderbox",stepBtn == 3?"basecolor font13 border-bottom":"fontB5 border-bottom-grey",]'>         
                <span class="font20">3、</span>出价周期
            </div>
            <div :class='["title-label","fontbold","borderbox","borderbox",stepBtn == 4?"basecolor font13 border-bottom":"fontB5 border-bottom-grey",]'>         
                <span class="font20">4、</span>交易说明
            </div>
        </div>

        <div v-if=" stepBtn === 1 &&  !passLimitUsdt " class="margin20 alert-box-wrap disflex label-light-danger">
            <div class="alert-icon-box ">
                <div class="icon iconfont icon-jinggao_o fontdanger font38"></div>
            </div>
            <div class="alert-text-box">                
                <div class="font12 margintop3">
                    <b>抱歉，您还不能创建出价</b>
                   <div>
                    您的 账户保证金>= <b>500 USDT</b> 时才可以发布出价。
                    <span @click="()=>toFreeze()" class="basecolor"> 去冻结>></span>
                   </div> 
                </div>
            </div>
        </div>
        <div v-else-if="stepBtn == 1 && parseFloat(userinfo.data.usdt)>0" class="margin20 alert-box-wrap  label-light-danger">          
          您能操作的U币数量为{{userinfo.data.usdt}}<br>
           <span v-if="userinfo.data.freezeUsdt>0"> 冻结的U币数量为{{userinfo.data.freezeUsdt}}</span>
        </div>
        <template v-if="stepBtn == 1">
          <stepOne :currentPriceInt="currentPriceInt" :passLimitUsdt="passLimitUsdt"  @stepClick="stepIntClick"/>
        </template>
        <template v-else-if="stepBtn == 2">
          <stepTwo @stepClick="stepIntClick" :stepData="stepData.step1" @stepBeforeClick="stepDecClick"/>
        </template>
        <template v-else-if="stepBtn == 3">
          <stepThree @stepClick="stepIntClick" :stepData="stepData.step2" @stepBeforeClick="stepDecClick"/>
        </template>
        <template v-else="stepBtn == 4">
          <stepFour @stepClick="stepIntClick"  :stepData="stepData.step1" @stepBeforeClick="stepDecClick"/>
        </template>
    </div>
  </div>
</template>
<style lang="scss">
@import "./bid/common.scss";
</style>