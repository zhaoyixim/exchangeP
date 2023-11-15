<script setup lang="ts">
import commonFooter from "@/components/common/commonFooter.vue";
import commonHeader from "@/components/common/commonHeader.vue";
import { ref,ComponentInternalInstance, getCurrentInstance, toRefs } from "vue";
import { useRoute,useRouter } from "vue-router";
import { Button,showImagePreview,showToast } from 'vant';
import { reactive } from "vue";
let router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that : any = proxy;
const { query, params } = useRoute();
const queryTipsCon = reactive({timeLimits:false,feeTips:false})
const bidId = ref(params.memory)
const isCollect = ref(false)
const collectData = reactive({data:{}})
const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
userinfo.data = that.$vcache.vget("meminfo")
const clickCollect =async () =>{
  let collectUrl = "api/trade/collectitem"
  if(!isCollect.value){
    collectData.data = await that.$request.post({url:collectUrl,data:{fromBidId:bidId.value}})
    showToast('收藏成功');
  }else{
    collectUrl = "api/trade/collectDelete"
    let collectId = collectData.data._id
    if(!collectId) {
      showToast('操作失败');return ;
    }
    await that.$request.post({url:collectUrl,data:{collectId}})   
    showToast('取消收藏成功'); 
  }  
  isCollect.value = !isCollect.value    
}

const clicktips = (itemkey:number)=>{
  /**展示问号的小提示 */
  if(itemkey == 2){
    queryTipsCon.timeLimits = !queryTipsCon.timeLimits
  }else{
    queryTipsCon.feeTips = !queryTipsCon.feeTips
  }
}


if(undefined == bidId.value) {
  showToast("“非法请求");
  history.go(-1);  
}

let tipTitles = []
const TradeUrl = "api/trade/dtl";
type formdataInter ={
  rmbCount:any,
  usdtCount:any
}
const bntDisabled= ref(false);//按钮
const btnCancel = ref(false);//取消按钮
const formdata = reactive<formdataInter>({rmbCount:null,usdtCount:null,payImages:null,imageFiles:null })
const memberinfo = ref()
const submitBtnTxt = ref("确定完成")
const needData = ref({})/**需求的数据 */
const bidItems = ref({})/**bid url 接受的数据 */
const bidNeedItem = ref()/**列表过来的数据--缓存数据 */
const imageShow = ref(false)
let imagesArr = []
const imageFiles = ref([])
let payImageData = []
const tranUrl = "api/trade/uploadTradeImg"
const showUploadBar = reactive({
  showReceiptCode:true,//是否展示收款码
  showReceiptCodeUpload:false,//是否展示上传收款码功能
  showReciveCodeWaitting:false,//是否展示等待上传功能
  showPayedCode:true,//是否展示付款码
  showPayedCodeUpload:false,//是否展示上传付款码功能
  showPayedCodeWaitting:false,//是否展示等待付款上传功能
})
let ctype = 1,staFlag = 1,buymodel = 1;

/**弹窗 */
const modelShow = ref(false)
const modelValue =  ref()
/**是否展示取消按钮 */
const cancelBtn = ref(false)
const cancelBtnTxt = ref('驳回')
const initPageData = async() => {
  /**BID数据 */
  let initdata =await that.$request.post({url:TradeUrl,data:{id:bidId.value}})
      let collectUrl = "api/trade/checkCollect"; /**检查是否收藏 */
      let collectData =await that.$request.post({url:collectUrl,data:{fromBidId:bidId.value}})
      collectData.data = collectData
      if(collectData.data?._id){isCollect.value = true}
  if(initdata.bidPriceTitle.length>0){tipTitles = JSON.parse(initdata.bidPriceTitle)}

  bidItems.value= initdata;
   /** 点击需求列表订单过来的数据*/
  bidNeedItem.value = await that.$vcache.vget('bidNeedItem')
  
   /**toUser 用户信息 */
  memberinfo.value = initdata.memberinfo;

  needData.value= bidNeedItem.value.needData;//that.$vcache.vdelete('bidNeedItem')
  
  ctype = bidNeedItem.value.ctype;  staFlag = needData.value.staFlag;buymodel=needData.value.buymodel;

  formdata.rmbCount = needData.value.rmbNums;
  formdata.usdtCount = needData.value.usdtNums;
  if(bidItems.value?.imageFiles){//收款码
    formdata.imageFiles =initdata.imageFiles;
  }else if(needData.value.imageFiles){//收款码
    formdata.imageFiles = JSON.parse(needData.value.imageFiles);  
  }
  if(needData.value?.payImages){//付款截图
    formdata.payImages = JSON.parse(needData.value.payImages);
  }

  if(ctype==2){//商户
    showUploadBar.showPayedCode = true
    if(buymodel == 1){//买入
      if(staFlag ==2){
        bntDisabled.value = false;
        cancelBtn.value=false;
        showUploadBar.showPayedCode=true;showUploadBar.showPayedCodeUpload=true;
      }
      if(staFlag ==1){
        bntDisabled.value = true;
        cancelBtn.value=false;
        showUploadBar.showPayedCode=true;
        showUploadBar.showPayedCodeUpload=true;
        showUploadBar.showPayedCodeWaitting = true
      }    
      
    }else{//售出
        if(staFlag ==2){showUploadBar.showPayedCode = true;showUploadBar.showPayedCodeUpload = true;
          cancelBtn.value=true;
        }
        if(staFlag ==4){
          showUploadBar.showPayedCode = false;
          showUploadBar.showPayedCodeUpload = true;
          cancelBtn.value=true;
          cancelBtnTxt.value='放弃交易'
        }
       
    }   
    
  }else{//买家   
    if(buymodel == 1){ //买入   
      if(staFlag == 1){
        showUploadBar.showPayedCode=false
        cancelBtn.value = true
        cancelBtnTxt.value='取消'
      }  
      if(staFlag ==2){
        showUploadBar.showPayedCode = true;
        showUploadBar.showPayedCodeUpload = true;
        bntDisabled.value = true ;
        submitBtnTxt.value = "等待商家确定。。。";
        cancelBtn.value = true;
        cancelBtnTxt.value = "取消"
      }
    }else{
      //售出
      if(staFlag ==1){
        cancelBtn.value=true;
        cancelBtnTxt.value='取消'
        showUploadBar.showReceiptCode = true;showUploadBar.showReceiptCodeUpload = true;showUploadBar.showPayedCodeWaitting = true
      }
      if(staFlag ==4){
        showUploadBar.showReceiptCode = true;
        showUploadBar.showReceiptCodeUpload = false;
        showUploadBar.showPayedCodeWaitting = true;
        bntDisabled.value = true;
       
      }
    }
  }

  if(staFlag == 9){bntDisabled.value = true;}
  
  if(staFlag == 11){btnCancel.value = true;}
}
initPageData();
const tomerChanle= () =>{
  let touserId = needData.value.touserId;
  if(userinfo.data._id == needData.value.touserId) touserId = needData.value.userId;
  let queryParams ={
    userId:userinfo.data._id,
    touserId:touserId,
    fromBidId:needData.value.fromBidId,
    fromTradeId:needData.value._id
  }
  router.push({name:"vchat",query:queryParams})
}
const toKefu= () =>{
  router.push({name:"kefu"})
}

/**提交方法 */
const submitDataFun =async () =>{   
   const surebuyurl = "api/trade/sureBuy"
   const needId = needData.value._id
   let returnjson = "";  
   if(!needId) {showToast('数据错误'); return ;}
   if(staFlag == 9){
    bntDisabled.value = true
    cancelBtn.value=false
    showToast('该订单已经完成');
    return false;
   }
   if(ctype ==1 ){ 
    if(buymodel == 2){//卖
      if(staFlag ==1){
        if(imageFiles.value.length<=0){
          showToast('请上传收款二维码');
          return false;
        }
         returnjson = await that.$request.post({url:tranUrl,data:{tradeId:needId,detailpayModel:true,imageFiles:payImageData}});
      
         submitBtnTxt.value = '等待买方上传付款码'
       } 
       if(staFlag ==5){
        returnjson = await that.$request.post({url:surebuyurl,data:{needId:needId}})

       } 
    }else{

      if(imageFiles.value.length<=0){
          showToast('请上传付款截图');
          return false;
        }
         returnjson = await that.$request.post({url:tranUrl,data:{tradeId:needId,detailpayModel:false,imageFiles:payImageData}});
      
         submitBtnTxt.value = '等待商家确定'
    }
  
     

  }else{
    if(buymodel == 2){ //售出
      if(staFlag ==1){
        if(imageFiles.value.length<=0){
          //无收款码
            showToast('请上传收款码');return false;
        }
        returnjson = await that.$request.post({url:tranUrl,data:{tradeId:needId,detailpayModel:true,imageFiles:payImageData}});
        submitBtnTxt.value = '等待买方付款。。。';       
      }  
      if(staFlag ==4){
        console.log(imageFiles.value,"imageFiles")
        if(imageFiles.value.length<=0){
          //有收款码
            showToast('请上传付款截图');return false;
        }      
        returnjson = await that.$request.post({url:tranUrl,data:{tradeId:needId,detailpayModel:false,imageFiles:payImageData}});
        submitBtnTxt.value = '等待卖方确定。。。'; 
      }   
    }else{
      if(staFlag ==2){
        returnjson = await that.$request.post({url:surebuyurl,data:{needId:needId}})
      }

    }
  }


   
   
  if(returnjson){     
      showToast('操作完成'); 
      bntDisabled.value = true   
      setTimeout(()=>{
        router.push({path:"/needorder"})
      },200)      
  }   
}
const cancelUrl = "api/trade/cancelRq"
const submitRejectFun =async ()=>{
  /**驳回 */
  if(ctype ==1 && buymodel == 2 && staFlag == 1){//取消
    await  that.$request.post({url:cancelUrl,data:{ctype,needId:needData.value._id}})
    btnCancel.value=true
    showToast('取消成功'); return ;
  }
  modelShow.value =!modelShow.value
}
const submitPopupBtn = async() =>{
  /**驳回原因 */
  console.log("modelValue",modelValue.value)

    await  that.$request.post({url:cancelUrl,data:{ctype,needId:needData.value._id,reason:modelValue.value}})
    btnCancel.value=true
    showToast('取消成功'); return ;


}
const imgPreview = () => {
  imageShow.value = true
  imagesArr=formdata.imageFiles 
}
const showReciveCode = () =>{  
  imageShow.value = true
  if(needData.data.buymodel == 2){
    imagesArr=formdata.imageFiles
  }else{
    imagesArr=[bidItems.value.imageFiles]
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
  payImageData.push(file.content)  
}

</script>

<template>
  <div class="container ">
    <commonHeader ftitle="交易详情" />
    <div class="disflex dtl-box ">
      <div class="dtl-header-wrap bgwhite paddingbottom20">
        <div class="bgbasecolor3 dtl-bg-header">
            <div class="dtl-title-box fontbasecolor">           
              <p class="text-left font14">该订单要求保证金:<span class="font16 fontbold"> {{bidItems.askNums}}</span> 
                <span class=""> 您当前保证金: <span class="font16 fontbold">{{userinfo.data.freezeBail}}</span></span></p>
              <p class="fontnormal font14">出售额度: {{needData.usdtNums}}U 单价:{{bidItems.realPrice}}/U</p>
              <template v-if="staFlag<10">
                <h5 v-if="ctype == 1 && buymodel ==2" class="fontnormal font14 text-left">
                  该订单将有{{needData.usdtNums}}U进入出售冻结,此时U币未进入买方账户，
                  仅对方付款并上传付款截图后，您再点击确定，额度方能进入买方账户</h5>
                <h5 v-if="ctype == 2 && buymodel ==2" class="fontnormal font14 text-left">
                  该订单您将有{{needData.usdtNums}}U进入入账冻结,此时U币未进入您账户，
                  仅您付款并上传付款截图后，卖方再点击确定，额度方能进入您账户</h5>
                <h5 v-if="ctype == 1 && buymodel ==1" class="fontnormal font14 text-left">
                  该订单将有{{needData.usdtNums}}U进入入价冻结,此时U币未进入您账户，
                  仅在您付款并上传付款截图后，商家点击确定，额度方能进入您账户</h5>

                <h5 v-if="ctype == 2 && buymodel ==1" class="fontnormal font14 text-left">
                  该订单将有{{needData.usdtNums}}U进入出价冻结,此时U币未进入对方账户，
                  仅在买家付款并上传付款截图后，您点击确定，额度方能进入对方账户</h5>

             </template>
             <template v-if="staFlag==11">
              该交易已被取消：
              <p v-if="bidItems.reason">取消原因:{{bidItems.reason}}</p>
            </template>

            </div>
        </div>
        <div class="bgwhite header-box borderradius10 boxshadow">         

            <div class="input-wrap second-input-wrap">
              <p v-if="ctype==2 && buymodel ==2" class="font14 fontbold">我将获得</p>
              <template v-else> 
                <p v-if="buymodel == 1" class="font14 fontbold">我要购买</p>
                <p v-if="buymodel == 2" class="font14 fontbold">我将出售</p>
              </template>   
              <div class="buy-box disflex font14 borderbox">
                <input type="number" disabled v-model="formdata.usdtCount"  class="fill-input"                 
                placeholder="输入购买数量" />
                <div class="right-tips-box disflex font666 borderbox">
                  <span class="right-tips disflex">USDT</span>
                </div>                
              </div> 
            </div>

            <div class="input-wrap first-input-wrap"> 
              <p v-if="ctype==2 && buymodel ==2" class="font14 fontbold">我需要支付</p>   
              <template v-else> 
                <p v-if="buymodel == 1" class="font14 fontbold">我将支付</p>
                <p v-if="buymodel == 2" class="font14 fontbold">我将获得</p>
              </template>       
              <div class="buy-box disflex font14 borderbox">
                <input type="text" disabled v-model="formdata.rmbCount" class="fill-input"                 
                placeholder="输入购买金额" />
                <div class="right-tips-box disflex font666 borderbox">
                  <span class="right-tips disflex">RMB</span>
                </div>                
              </div>
            </div>
            <van-image-preview v-model:show="imageShow" :images="imagesArr">
              <template #image="{ src }">
                <img style="width: 100%;" :src="src">
              </template>
            </van-image-preview>
            
            <div v-if="showUploadBar.showReceiptCode" class="input-wrap first-input-wrap">             
              <p class="font14 fontbold">收款码
                <span v-if="ctype==2 && buymodel ==2" class="fontnormal">(您需要向该收款码付款并上传截图)</span>
              </p>             
              <div class="buy-box disflex font14 borderbox">                   
                <div  v-if="showUploadBar.showReceiptCodeUpload" class=" second-input-wrap">                
                  <div class="buy-box font14 borderbox">                    
                      <div class="align-items-center ">
                        <van-uploader v-model="imageFiles"  :preview-size="[100, 100]" :after-read="afterRead" :max-count="1" :show-upload="true"	 :deletable="true" :before-read="beforeRead"/>        
                      </div>
                  </div> 
                  <div class="right-tips-mute font12 borderbox">请上传收款码</div>            
                  <div class="item-box font14 margintop10">
                    <div class="font666">如有争议：请
                      <span @click="toKefu">点击咨询客服</span></div>
                  </div>                    
                 </div> 
                <img v-else class="image-box" :src="formdata.imageFiles" @click="()=>showReciveCode()"  /> 
                
              </div>
              <div v-if="showUploadBar.showReciveCodeWaitting" class="padding20 text-center"> 等待上传。。。</div>  
           
            </div>

            <div v-if="showUploadBar.showPayedCode"  class="input-wrap first-input-wrap">
              <p  class="font14 fontbold">付款截图</p>                
              <div  class="buy-box disflex font14 borderbox">
                <template v-for="(item,index) in formdata.payImages" >                     
                  <van-image
                  width="10rem"
                  height="10rem"
                  fit="cover"
                  position="left"
                  :src="item"
                  @click="()=>imgPreview()"
                />
                </template>    
              </div>  
              
              <div v-if="showUploadBar.showPayedCodeWaitting" class="padding20 text-center"> 等待上传。。。</div> 
             
            </div>
            <div v-else class="input-wrap first-input-wrap">
              <p class="font14 fontbold">上传付款截图</p>       
              <div class=" second-input-wrap">                
                <div class="buy-box font14 borderbox">                    
                  <div class="align-items-center ">
                    <van-uploader v-model="imageFiles" multiple  :preview-size="[100, 100]" :after-read="afterRead" :max-count="3" :show-upload="true"	 :deletable="true" :before-read="beforeRead"/>        
                  </div>
                </div> 
                <div class="right-tips-mute font12 borderbox">请上传付款截图(用户<span v-if="bidItems.validPeriod == 9">付款后</span> <span v-else>在 {{bidItems.validPeriod}}分钟内付款后</span>，请及时确定，否则系统将进入异常订单程序)</div>            
                <div class="item-box font14 margintop10">
                  <div class="font666">如有争议：请点击咨询客服</div>
                </div>
              </div> 
            </div>


            <div class="btn-box-wrap">
              <button :disabled="bntDisabled" 
              class="btn-box font14 fontbasecolor fontnormal borderbox" 
              @click="()=>submitDataFun()" >{{submitBtnTxt}}</button>              
              <button v-if="cancelBtn"              
              :disabled="btnCancel" 
              class="btn-box font14 basecolor fontnormal borderbox bgbasecolor4 margintop20" 
              @click="()=>submitRejectFun()" >{{cancelBtnTxt}}</button>              
            
              <div class="btn-fixed right-tips-mute font12 borderbox">创新C2C交易平台，安全可靠，交易便捷</div>
            </div>            
        </div>
      </div>
    </div>
    <div class="deal-info-wrap bgwhite">     
        <div class="deal-title-box disflex">
            <div class="deal-title font16 fontbold">交易出价</div>
            <div @click="()=>clickCollect()" 
              :class='["collect-deal-box","disflex",isCollect?"transbasecolor bgbasecolor3":"bgbasecolor4 basefontcolor"]'>                
                <div :class='["icon","iconfont","font16","",isCollect?"icon-cc-star transbasecolor":"icon-star1 basefontcolor"]'></div>                
                <div class="font12">收藏出价</div>
            </div>
        </div>

        <div class="deal-list-wrap">         
          <div class="item-wrap disflex bottomborder">
            <div class="item-box font14">
              <div class="font666">交易价格</div>
              <div class="disflex margintop5 fontbold">￥{{bidItems.realPrice}}/ 
                <div class="disflex tips-box font12 fontnormal">
                  <div class="">usdt</div> 
                  <div v-if="bidItems.bidPrice>0" class="disflex font12 fontdanger">
                      <div class="icon font12 fontbold iconfont icon-jiantou_xiangxia xiangshangfixed"> </div>
                      <div><span>高</span>于市价 {{bidItems.bidPrice}}% </div> 
                  </div>
                  <div v-else class="disflex font12">
                      <div class="icon font12 fontbold iconfont icon-jiantou_xiangshang xiangshangfixed"> </div>
                      <div><span>低</span>于市价 {{bidItems.bidPrice}}% </div>                     
                  </div>
                </div>
              </div>
            </div>
            <div class="item-box font14">
              <div class="font666">手续费率
                <div v-if="queryTipsCon.feeTips"  @click="()=>clicktips(1)" class="tips-item bgwhite font12 boxshadow tips-tax">
                  <div class="tips-content">该类型交易将额外收取您的交易手续费率</div>
                  <div class="litter-arrow"></div>
                </div>
                <span class="icon iconfont icon-wenhao font12" @click="()=>clicktips(1)"></span>
              </div>
              <div class="disflex margintop5 fontbold">{{bidItems.fee || 0}}%</div>
            </div>                           
          </div>

          <div class="item-wrap disflex bottomborder">
            <div class="item-box font14">
              <div class="font666">交易限额</div>
              <div class="disflex margintop5 font12 ">
                <span class=" item-fixed">最低</span>
                <span class="font14 fontbold">￥{{bidItems.bidRmbMin}} ~</span>
                <span class=" item-fixed">最高</span>
                 <span class="font14 fontbold">￥{{bidItems.bidRmbMax}}</span>                
              </div>
            </div>
            <div class="item-box font14">
              <div class="font666">交易时限
                <div v-if="queryTipsCon.timeLimits"  @click="()=>clicktips(2)" class="tips-item bgwhite font12 boxshadow tips-timelimit">
                  <div class="tips-content">交易超时{{bidItems.validPeriod}}分钟后买方未支付则交易取消，卖方USDT将退还</div>
                  <div class="litter-arrow"></div>
                </div>

                <span class="icon iconfont icon-wenhao font12"  @click="()=>clicktips(2)"></span>
              </div>
              <div class="disflex margintop5 fontbold">{{bidItems.validPeriod}}分钟</div>
            </div>                       
          </div>  
          
          
          <div class="item-wrap disflex bottomborder">
            <div class="item-box font14">
              <div class="font666">用户限定</div>
              <div class="disflex margintop5 font12 ">
                <span class=" item-fixed">仅限</span>
                <span class="font14 fontbold">一级会员</span>
                <span class=" item-fixed"> 及以上，</span>
                <span class="font14 fontbold">一级验证</span>  
                <span class=" item-fixed"> 及以上，</span>              
              </div>
            </div>                                 
          </div>  

          <div class="item-wrap disflex">
            <div class="item-box font14">
              <div class="font666">交易限制</div>
              <div class="disflex margintop5 font12 ">
                <span class=" item-fixed">该交易</span>
                <span v-if="bidItems.bidTimes >0" class="font14 fontbold">限制交易{{bidItems.bidTimes}}次</span>
                <span v-else class="font14 fontbold">不限次数</span>
                <span class=" item-fixed"> ，新交易对象</span>
                <span class="font14 fontbold">不限数额</span>
              </div>
            </div>                                 
          </div>  
        
        </div>
    </div>

    <div  class="deal-info-wrap  merch-dtl-wrap bgwhite bottomborder">     
        <div class="deal-title-box disflex">
            <div class="deal-title font16 fontbold">卖家信息</div>
        </div>
        <div class="avatar-box-item disflex">
          <div class="avatar-img-box">
            <img class="avatar-box image-box" :src="memberinfo.avatar" />
          </div>
          <div class="right-avatar">
            <div class="right-item disflex">
              <div v-if="memberinfo.nickname">{{memberinfo.nickname}}</div> 
              <div v-else-if="memberinfo.username">{{memberinfo.username}}</div>
              <div class="right-item-icon basecolor icon iconfont font14 icon-renzheng"></div>
            </div>
            <div class="right-item disflex fontgrey font12">              
              <div class="dot-position">
                <span class="label-dot"></span>
                最近登录时间:{{memberinfo.logintime}}
              </div>
            </div>
            <div @click="tomerChanle" class="disflex  right-item-main basecolor font14 bgbasecolor4">               
              <div  class="basecolor icon iconfont  icon-24gl-paperPlane">  </div>
              <div>  联系卖家</div>
            </div>
          </div>
        </div>



        <div class="deal-info-list  font12">
           <div class="infolist-item disflex">
            <div class="info-list-left">
              交易保障：
            </div>
            <div v-if=" bidItems.askNums" class="info-list-right">
              <div class="identyfy-box font12 fontcolortips">
                  <div class="identify-flg fontcolortips"><div class="icon iconfont icon-yanzheng fontcolortips font12 "></div></div>
                  <div>保证金{{  bidItems.askNums}}  USDT</div>
                </div>
            </div>           
          </div>
          <div class="infolist-item disflex">
            <div class="info-list-left">
              邮箱验证：
            </div>
            <div class="info-list-right">
              <div v-if="memberinfo.checkemail" class="list-item-label  label-light-success ">
                <span class="font13 icon iconfont icon-duigou_kuai text-success fontcolortips"></span>已验证                
              </div>
              <div v-if="!memberinfo.checkemail" class="list-item-label label-light">
                未验证                
              </div>
            </div>           
          </div> 
          <div class="infolist-item disflex">
            <div class="info-list-left">
              收藏关注：
            </div>
            <div class="info-list-right">
              <b>{{bidItems.collect}}</b>
              人收藏
            </div>           
          </div>

          <div class="infolist-item disflex">
            <div class="info-list-left">
             累计交易：
            </div>
            <div class="info-list-right">              
              <b>{{bidItems.tradeNums}}</b>
              笔
            </div>           
          </div>

          <div class="infolist-item disflex">
            <div class="info-list-left">
              最近登录：
            </div>
            <div class="info-list-right">
              <b>
                {{memberinfo.logintime}}
              </b>
              
            </div>           
          </div>

          <div class="infolist-item disflex">
            <div class="info-list-left">
              注册时间：
            </div>
            <div class="info-list-right">
              <b>
                {{memberinfo.ctime}}
              </b>
              
            </div>           
          </div>
        </div>
    </div>

   
    <div class="deal-info-wrap deal-desp bgwhite">     
        <div class="deal-title-box disflex">
            <div class="deal-title font16 fontbold">交易说明</div>            
        </div>
        <div v-if="tipTitles.length > 0" class="litter-mute-box disflex font12">
            <div v-for="(it,index) in tipTitles.filter(s=>s.checked)" :key="index" class="label-inline label-light">{{it.cname}}</div>
        </div>
        <div class="desp-content font14">			
      {{bidItems.bidDesp}}		
    </div>
    </div>
   

    <div class="deal-info-wrap deal-flue bgwhite">         
        <div class="deal-title-box disflex">
            <div class="deal-title font16 fontbold">交易流程</div>            
        </div>
        <div class="deal-card-box">
          <div class="timeline">
            <div class="timeline-items boxborder">
              <div class="timeline-item">
                <div class="timeline-media boxborder">
                  <b class="timeicon">1</b>
                </div>
                <div class="timeline-content boxborder">
                  <div class="timeblock disflex boxborder">
                    <div class="timeline-title boxborder">
                      <b class="font16 fontdark fontbold">发起交易</b>
                    </div>
                  </div>
                  <div class="timeline-items boxborder font12 ">
                  输入您要出售或购买的数量，确定交易数量和金额后点击 立即购买 or 立即出售 按钮发起交易。发起成功会从卖方账户托管交易对应数量的USDT，并将交易信息发送给买方。您可以将您的telegram绑定 <a class="basecolor" href="https://t.me/Eu_otc_bot">易优Bot @Eu_otc_bot</a>，或开启邮件提醒，更便捷的接收交易通知 <a class="basecolor" href="https://www.otc-u.com/h5/my_ding.html">去设置&gt;</a>。
                </div>
                </div>
              </div>
            </div>
          </div>


          <div class="timeline">
            <div class="timeline-items boxborder">
              <div class="timeline-item">
                <div class="timeline-media boxborder">
                  <b class="timeicon">2</b>
                </div>
                <div class="timeline-content boxborder">
                  <div class="timeblock disflex boxborder">
                    <div class="timeline-title boxborder">
                      <b class="font16 fontdark fontbold">买方付款 or 交易取消</b>
                    </div>
                  </div>
                  <div class="timeline-items boxborder font12 ">
                    交易订单发起成功后，您可在交易对话页面与对方联系，确认交易信息或支付交易金额，如交易超过交易时限后买方仍未支付或双方自助取消交易，交易取消成功后交易托管USDT数量将退回卖方账户。

                  </div>
                </div>
              </div>
            </div>
          </div>


          <div class="timeline">
            <div class="timeline-items boxborder">
              <div class="timeline-item">
                <div class="timeline-media boxborder">
                  <b class="timeicon">3</b>
                </div>
                <div class="timeline-content boxborder">
                  <div class="timeblock disflex boxborder">
                    <div class="timeline-title boxborder">
                      <b class="font16 fontdark fontbold">卖方放行 or 发起争议</b>
                    </div>
                  </div>
                  <div class="timeline-items boxborder font12 ">
                    如买方支付成功，卖方已确认收到交易对应金额，请尽快放行交易订单，放行后托管USDT将转入买方账户。如买方确认订单已支付状态而卖方实际未收到款，或某方未遵从交易流程规范进行的其他事项，双方都可在交易对话界面发起争议维权 
                    <a class="basecolor" href="https://www.otc-u.com/h5/news_show.html?sn=eccbc87e4b5ce2fe28308fd9f2a7baf3">点击查看详情&gt;</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div class="timeline">
            <div class="timeline-items boxborder">
              <div class="timeline-item border-left-no">
                <div class="timeline-media boxborder">
                  <b class="timeicon">4</b>
                </div>
                <div class="timeline-content boxborder">
                  <div class="timeblock disflex boxborder">
                    <div class="timeline-title boxborder">
                      <b class="font16 fontdark fontbold">交易结束</b>
                    </div>
                  </div>
                  <div class="timeline-items boxborder font12 ">
                    交易结束用户可对该笔交易点评反馈，如超时未反馈则默认正面好评。  
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
    </div>


    <div v-if="false" class="deal-info-wrap  bgwhite">     
        <div class="deal-title-box disflex">
            <div class="deal-title font16 fontbold">交易反馈</div>            
        </div>

        <div class="card-body boxborder">
          <div class="card-title paddingbottom20 bottomborder">
            <div class="disflex boxborder card-title-item font12">
              <div class="disflex card-pill-all label-pill ">
                全部评价
                <span class="title-pill">2811</span>
              </div>

              <div class="disflex card-pill-all label-default ">
                正面反馈 
                <span class="title-pill">2811</span>
              </div>

              <div class="disflex card-pill-all label-default ">
                负面反馈 
                <span class="title-pill">0</span>
              </div>

            </div>
          </div>

          <div class="comment-box-wrap ">
            <div class="comment-box paddingbottom20 bottomborder">
                <div class="comment-padding ">
                  <div class="disflex  item-box">
                    <div class="item-avatar">
                        <img class="image-box item-img" src="../../assets/avatar.jpg" />
                    </div>
                    <div class="item-right font12">
                        <div class="fontbold">zhouqupeng8617 <span class="dot-position label-dot"></span> </div>
                        <div class="fontgrey item-time">2023-03-08</div>
                    </div>
                  </div>
                </div>

                <div class="comment-padding comment-item-tips font12">
                  <div class="fontbold">[购买] 微信支付</div>
                  <div class="fontnormal">买方满意，默认好评</div>
                </div>

                <div class="comment-padding comment-item-tips font12 item-label disflex text-success">
                  <div class="fontbold icon iconfont icon-jurassic_zan"></div>
                  <div class="">正面</div>
                </div>
            </div>

            <div class="text-conter font12">
              <div class="conter-btn fontgrey">
                 加载中
              </div>
            </div>
          </div>
        </div>
    </div>

    <div class="">
          <van-popup v-model:show="modelShow" 
               :closeable=true :style="{ padding: '10px' , width:'100%',borderRadius:'8px'}">
                <div class="borderradius10 borderbox model-boxWrap">
                    <div class="model-title borderbottom fontdark font16 padding20">
                       {{cancelBtnTxt}}原因:
                    </div>                    
                    <div  class="form-box margin20">
                      <div class="input-wrap disflex font12 align-items-center margintop10 input-box disflex">
                          <textarea type="area" v-model="modelValue" placeholder="请输入原因"
                          class="borderbox  font14 input-item-fixed text-input" ></textarea>
                      </div>             
                      <div class=" disflex justify-spacebetween">
                        <div></div>
                        <button @click="submitPopupBtn" class="margintop20 vbtn fontbasecolor bgbasecolor3 font12">确定</button>                   
                      </div>                      
                    </div>      
                </div>
          </van-popup>
     </div>


    
    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss">
@import '@/assets/css/transdtl.scss';
.bottomborder{
  border-bottom:1px solid #EBEDF3;
}
.input-item-fixed{height: 100px;}
.dtl-title-box{padding-top: 15px !important;}
</style>