<script setup lang="ts">
import commonFooter from "@/components/common/commonFooter.vue";
import commonHeader from "@/components/common/commonHeader.vue";
import { ref,ComponentInternalInstance, getCurrentInstance, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button,showToast } from 'vant';
import { reactive } from "vue";
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that : any = proxy;
const { query, params } = useRoute();
const queryTipsCon = reactive({timeLimits:false,feeTips:false})
let router = useRouter()
const TradesId = ref(params.memoryTransId)
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
const imageFiles = ref([])

/**提交的表单数据 */
type formdataInter ={
  rmbCount:any,
  usdtCount:any
}
let formdata = []
const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
userinfo.data = that.$vcache.vget("meminfo")
const bntDisabled= ref(false)
/**提交方法 */
const submitDataFun =async () =>{
   const tranUrl = "api/trade/uploadTradeImg"
   console.log(formdata)
   if(formdata.length<=0){
    showToast('请上传付款截图');
    return false;
   }
  let rebackjson = await that.$request.post({url:tranUrl,data:{tradeId:TradesId.value,detailpayModel:false,imageFiles:formdata}})
  
  if(rebackjson._id){
      bntDisabled.value = true
      const totranUrl = "payover"
      router.push({name:totranUrl,params:{memoryTransId:rebackjson._id}})
  }
}

const beforeRead = (file: { type: string; }) =>{
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        showToast('请上传 jpg/png 格式图片');
        return false;
      }
      return true;
}
const afterRead = (file:any)=>{
  /**上传后 */
  formdata.push(file.content)  
}


</script>

<template>
  <div class="container ">
    <commonHeader ftitle="购买交易" />
    <div class="disflex dtl-box ">
      <div class="dtl-header-wrap bgwhite paddingbottom20">
        <div class="bgbasecolor3 dtl-bg-header">
            <div class="dtl-title-box fontbasecolor">
              <h3 class="font20">
                该商家以缴纳保证金1000USDT，剩余可占用保证金200USDT,</h3>
              <h5 class="fontnormal font14"> 该订单可触发商户剩余最多200USDT保证金冻结(如订单为完成将在{{bidData.data.validPeriod}}分钟后自动解冻)</h5>
            </div>
        </div>
        <div class="bgwhite header-box borderradius10 boxshadow">
            <div class="input-wrap second-input-wrap">
              <p class="font14 fontbold">商户收款码</p>
              <div class="buy-box disflex font14 borderbox">               
                <div class="image-wrap">
                  <img class="image-box" :src="bidData.data.imageFiles"/>
                </div>

              </div> 
              <div class="right-tips-mute font12 borderbox">商户的收款截图</div>            
            </div>           
        </div>
      </div>      
    </div> 

    <div>

      <div class="deal-info-wrap bgwhite">     
        <div class="deal-title-box disflex">
            <div class="deal-title font16 fontbold">上传截图</div>           
        </div>
      

        <div class="deal-list-wrap">         
            <div class="item-wrap bottomborder">                  
              <div class="input-wrap second-input-wrap">
                <p class="font14 fontbold">上传付款截图</p>

                <div class="buy-box font14 borderbox">
                    
                  <div class="align-items-center margintop10">
                    <van-uploader v-model="imageFiles"  multiple :preview-size="[100, 100]" :after-read="afterRead" :max-count="3" :show-upload="true"	 :deletable="true" :before-read="beforeRead"/>        
                  </div>

                </div> 
                <div class="right-tips-mute font12 borderbox">请上传付款截图(商户将在{{bidData.data.validPeriod}}内确定，否则系统将在24小时候自动确定)</div>            
                <div class="item-box font14 margintop10">
                  <div class="font666">如有争议：请点击咨询客服</div>
                </div>
              </div>              
            </div>

            <div class="btn-box-wrap">
              <button :disabled="bntDisabled" class="btn-box font14 fontbasecolor fontnormal borderbox" @click="()=>submitDataFun()" >我已付款</button>
              
              <div class="btn-fixed right-tips-mute text-center font14 borderbox">创新C2C交易平台，安全可靠，交易便捷</div>
            </div> 
        </div>
      </div>
    </div>


    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss">
@import '@/assets/css/transdtl.scss';
.image-wrap{max-height: 400px; max-width: 325px;}
.bottomborder{
  border-bottom:1px solid #EBEDF3;
}
.item-wrap{padding-bottom: 30px !important;}
</style>