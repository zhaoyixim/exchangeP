<script setup lang="ts">
import commonFooter from "@/components/common/commonFooter.vue";
import commonHeader from "@/components/common/commonHeader.vue";
import { ref,ComponentInternalInstance, getCurrentInstance, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button,showToast } from 'vant';
import { reactive } from "vue";
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that : any = proxy;
const { params } = useRoute();
const TradesId = ref(params.memoryTransId)
let router = useRouter()

if(undefined == TradesId.value) {
  showToast("“非法请求");
  history.go(-1);  
}
const bidData = reactive({data:[]})
const TradeUrl = "api/trade/dtl"
const initPageData = async() => {
   let initdata =await that.$request.post({url:TradeUrl,data:{id:TradesId.value,trade:true}})
   bidData.data = initdata
}
initPageData();
const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
userinfo.data = that.$vcache.vget("meminfo")
const bntDisabled= ref(false)
const submitDataFun=()=>{
  router.push({name:'profile'})
}
</script>

<template>
  <div class="container ">
    <commonHeader ftitle="购买交易" />
    <div class="margintop10 padding30 bgwhite">
       <div class="pro-body borderGrey margintop10">
        <div class="pro-content">
             <div class="text-align icon iconfont icon-duigou_kuai font88 basecolor"></div>
           </div>
           <div class="text-center font18 margin20">操作成功</div>
           <div class="pro-bottom padding20 paddingtop0">
             <div class="font18 fontbold basecolor">保证金</div>
             <div class="fontdark font12 margintop5">
               该商户已缴纳保证金 
               <span class="basecolor fontbold">1000USDT</span>
               该笔订单已经冻结保证金100USDT
             </div>
             <div class="font12 margintop5">
               冻结数量：<b class="basecolor">100USDT</b> 
               <br>打款：<b class="basecolor">等待商家确定后自动打款</b> 
               <br>争议：<b class="basecolor">争议处理：请点击此处召唤客服</b> 
             </div>
           </div>

           <div class="btn-box-wrap">
              <button :disabled="bntDisabled" class="btn-box font14 fontbasecolor fontnormal borderbox" @click="()=>submitDataFun()" >确定</button>
              
              <div class="btn-fixed right-tips-mute text-center font14 borderbox">创新C2C交易平台，安全可靠，交易便捷</div>
            </div> 
       </div>  
   </div>
 </div>
  <commonFooter factive='2' />
  
</template>
<style lang="scss">
@import '@/assets/css/transdtl.scss';
.container{min-height: 80vh !important;}
</style>