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
   if(formdata.length<=0){
    showToast('请上传收款二维码');
    return false;
   }
  let rebackjson = await that.$request.post({url:tranUrl,data:{tradeId:TradesId.value,detailpayModel:true,imageFiles:formdata}})
  if(rebackjson._id){
      bntDisabled.value = true
      const totranUrl = "sellover"
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
            <div class="dtl-title-box fontbasecolor text-left">
              <h3 class="font20">您将出售100USDT到用户zhaoyixim,</h3>
              <h5 class="fontnormal font14">您将需要<span v-if="bidData.data.validPeriod == 9">及时</span> <span v-else>在 {{bidData.data.validPeriod}}分钟内</span>查看账户收款情况进行并确认，如果对方上传了付款图您又未进行确认，该订单将进入异常程序</h5>
              <h5 class="fontnormal font14">你的USDT将会提前打入对方账户进行冻结，如果对方24小时未付款，USDT将会自动回归您账户,</h5>
            </div>
        </div>     
      </div>      
    </div> 
    <div>
      <div class="deal-info-wrap bgwhite">     
        <div class="deal-title-box disflex">
            <div class="deal-title font16 fontbold">收款码</div>           
        </div>
        <div class="deal-list-wrap">         
            <div class="item-wrap bottomborder">                  
              <div class="input-wrap second-input-wrap">
                <p class="font14 fontbold">上传收款码</p>
                <div class="buy-box font14 borderbox">
                    
                  <div class="align-items-center margintop10">
                    <van-uploader v-model="imageFiles"  :preview-size="[100, 100]" :after-read="afterRead" :max-count="1" :show-upload="true"	 :deletable="true" :before-read="beforeRead"/>        
                  </div>

                </div> 
                <div class="right-tips-mute font12 borderbox">请上传收款码(用户<span v-if="bidData.data.validPeriod == 9">付款后</span> <span v-else>在 {{bidData.data.validPeriod}}分钟内付款后</span>，请及时确定，否则系统将进入异常订单程序)</div>            
                <div class="item-box font14 margintop10">
                  <div class="font666">如有争议：请点击咨询客服</div>
                </div>
              </div>              
            </div>

            <div class="btn-box-wrap">
              <button :disabled="bntDisabled" class="btn-box font14 fontbasecolor fontnormal borderbox" @click="()=>submitDataFun()" >提交</button>
              
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