<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import { showDialog, showToast } from "vant";
  import { ComponentInternalInstance, getCurrentInstance, reactive, ref } from "vue";
  import { useRoute, useRouter } from 'vue-router';
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that : any = proxy;
  const { query, params } = useRoute();
  let router = useRouter()
  const bidId = ref(params.memory)
  const queryTipsCon = reactive({timeLimits:false,feeTips:false})
  
  const isCollect = ref(false)
  const collectData = reactive({data:{}})

    /**提交的表单数据 */
  type formdataInter ={
    rmbCount:any,
    usdtCount:any
  }
  const formdata = reactive<formdataInter>({rmbCount:null,usdtCount:null })


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
  const bidData = reactive({data:[]})
  const TradeUrl = "api/trade/dtl"
  let tipTitles = []
  const initData = async() => {
    let initdata =await that.$request.post({url:TradeUrl,data:{id:bidId.value}})
    bidData.data = initdata  
    if(initdata.bidPriceTitle.length>0){
      tipTitles = JSON.parse(initdata.bidPriceTitle)
    }
    formdata.usdtCount = bidData.data.bidUsdtMin
    dataInput('usdtCount')
      /**检查是否收藏 */
    let collectUrl = "api/trade/checkCollect";
    let collectData =await that.$request.post({url:collectUrl,data:{fromBidId:bidId.value}})
    collectData.data = collectData
    if(collectData.data?._id){
        isCollect.value = true
    } 
    let meminfo = await that.$commonFunc.updatememinfo()   
    if(bidData.data.askNums > 0){     
      if(bidData.data.askNums > meminfo.freezeBail){
        showDialog({
          title: '提示',
          message: '该需求要求保证金为'+bidData.data.askNums+",您当前保证金不足，请去冻结保证金",
        }).then(()=>{
          router.push({path:'/protection'})
        })
       
      }
    }

  }
  initData()
  

const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
userinfo.data = that.$vcache.vget("meminfo")
const bntDisabled= ref(false)

/**提交方法 */
const submitDataFun =async () =>{
   const tranUrl = "/api/trade/createTradeOrder"
   if(formdata.usdtCount<=0){
    showToast('购买数量不能为0');
    return false;
   }
   let rebackjson = await that.$request.post({url:tranUrl,data:{fromBidId:bidId.value, buymodel:2,rmbCount:formdata.rmbCount,usdtCount:formdata.usdtCount}})
    if(rebackjson._id){
      bntDisabled.value = true
      const totranUrl = "sendqcode"
      router.push({name:totranUrl,params:{memoryTransId:rebackjson._id}})
    }
}

const dataInput = (keyitem:string) => {
   
   if(keyitem === 'usdtCount'){

    if(formdata[keyitem] < bidData.data.bidUsdtMin){
      showToast('不能少于最小购买额度'+ bidData.data.bidUsdtMin)
      formdata[keyitem] =  bidData.data.bidUsdtMin
      return ;
    }

    if(formdata[keyitem] > userinfo.data.usdt){
      showToast('您账户U额度不足')
      formdata[keyitem] =  userinfo.data.usdt
      return ;
    }

     let countnum = formdata[keyitem] * parseFloat(bidData.data.realPrice)
     formdata.rmbCount  = (Math.ceil(countnum*100)/100).toFixed(2); 
   }else if(keyitem === 'rmbCount'){
    let countnum = formdata[keyitem] / parseFloat(bidData.data.realPrice)
     formdata.usdtCount  = Math.floor(countnum); 
   }
}
</script>


<template>
  <div class="container ">
    <commonHeader ftitle="保障交易" />
    <div class="disflex dtl-box  bgwhite paddingbottom20">
      <div class="dtl-header-wrap">
        <div class="bgbasecolor3 dtl-bg-header">

          <div class="sell-header-box  font12 fontbasecolor ">
             <div class="sell-header bg-success disflex">              
                <div class="icon iconfont icon-yanzheng fontbasecolor"> </div>
                <div class="sell-tips-title"> 要求保证金 {{bidData.data.askNums}} USDT </div>
              </div>   
          </div>
            <div class="dtl-title-box fontbasecolor">
              <h3 v-show="bidData.data.memberinfo" class="font20">通过保障交易将泰达币(USDT)出售给 {{bidData.data.memberinfo.username}},{{bidData.data.fee}}手续费！</h3>
              <h5 class="fontnormal font14"> {{bidData.data.bidTitle}}</h5>
            </div>
        </div>
        <div class="bgwhite header-box-sell borderradius10 boxshadow">
     <!--item-->
            <div class="input-wrap disflex">
              <div class="sell-item"> 
                <p class="font14 fontbold">{{bidData.data.bidMethod}}</p>
                <div class="price-sell-tips font12 label-inline label-light">出价</div>
              </div>
              <div class="sell-item"> 
                <p class="sell-item-p  disflex  fontbold">￥{{bidData.data.realPrice}} / 
                  <span class="font12 fontnormal margintop5">usdt</span>  </p>
                <div class="disflex tips-box  font12 fontnormal">                  
                  <div v-if="bidData.data.bidPrice>0" class="disflex font12 fontsuccess">
                    <div class="icon font12 fontbold iconfont icon-jiantou_xiangshang"> </div>
                    <div>  高于市价 {{bidData.data.bidPrice}}% </div> 
                  </div>
                  <div v-else class="disflex font12 fontsuccess">
                    <div class="icon font12 fontbold iconfont icon-jiantou_xiangxia"> </div>
                    <div>  低于市价 {{bidData.data.bidPrice}}% </div> 
                  </div>

                </div>
                <div class="fontgrey margintop5 font12">限额 ￥{{bidData.data.bidRmbMin}} ~ ￥{{bidData.data.bidRmbMax}}元</div>                
              </div>              
            </div>           


            <div class="input-wrap first-input-wrap-sell">
              <p class="font12">我将出售(账户剩余可操作:{{userinfo.data.usdt}}U)</p>
              <div class="buy-box disflex font12 borderbox">
                <input type="number" v-model="formdata.usdtCount"  @input="()=>dataInput('usdtCount')" class="fill-input " placeholder="出售数量" />
                <div class="right-tips-box disflex font666 borderbox">
                  <span class="right-tips disflex">USDT</span>
                </div>                
              </div>             
            </div>

            <div class="input-wrap second-input-wrap">
              <p class="font12">我将获得</p>
              <div class="buy-box disflex font12 borderbox">
                <input type="number"  v-model="formdata.rmbCount"  @input="()=>dataInput('rmbCount')" class="fill-input " placeholder="获得金额" />
                <div class="right-tips-box disflex font666 borderbox">
                  <span class="right-tips disflex">RMB</span>
                </div>                
              </div>             
            </div>          
<!--item-end-->
            <div class="btn-box-wrap margintop40">
              
              <button :disabled="bntDisabled" class="btn-box font14 fontbasecolor fontnormal borderbox" @click="()=>submitDataFun()" > <span v-if="!userinfo.data.username" >注册并立即出售</span><span v-else>立即出售</span></button>
              
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
              <div class="disflex margintop5 fontbold">￥{{bidData.data.realPrice}}/ 
                <div class="disflex tips-box font12 fontnormal">
                  <div class="">usdt</div> 
                    <div  v-if="bidData.data.bidPrice>0" class="disflex font12 fontdanger">
                      <div class="icon font12 fontbold iconfont icon-jiantou_xiangxia xiangshangfixed"> </div>
                      <div><span>高</span>于市价 {{bidData.data.bidPrice}}% </div> 
                    </div>
                    <div v-else class="disflex font12">
                      <div class="icon font12 fontbold iconfont icon-jiantou_xiangshang xiangshangfixed"> </div>
                      <div><span>低</span>于市价 {{bidData.data.bidPrice}}% </div>                     
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
              <div class="disflex margintop5 fontbold">{{bidData.data.fee || 0}}%</div>
            </div>                           
          </div>

          <div class="item-wrap disflex bottomborder">
            <div class="item-box font14">
              <div class="font666">交易限额</div>
              <div class="disflex margintop5 font12 ">
                <span class=" item-fixed">最低</span>
                <span class="font14 fontbold">￥{{bidData.data.bidRmbMin}} ~</span>
                <span class=" item-fixed">最高</span>
                 <span class="font14 fontbold">￥{{bidData.data.bidRmbMax}}</span>                
              </div>
            </div>
            <div class="item-box font14">
              <div class="font666">交易时限
                <div v-if="queryTipsCon.timeLimits"  @click="()=>clicktips(2)" class="tips-item bgwhite font12 boxshadow tips-timelimit">
                  <div class="tips-content">交易超时{{bidData.data.validPeriod}}分钟后买方未支付则交易取消，卖方USDT将退还</div>
                  <div class="litter-arrow"></div>
                </div>

                <span class="icon iconfont icon-wenhao font12"  @click="()=>clicktips(2)"></span>
              </div>
              <div class="disflex margintop5 fontbold">{{bidData.data.validPeriod}}分钟</div>
            </div>                       
          </div>  
          
          
          <div  v-if="false" class="item-wrap disflex bottomborder">
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
                <span v-if="bidData.data.bidTimes >0" class="font14 fontbold">限制交易{{bidData.data.bidTimes}}次</span>
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
            <img class="avatar-box image-box" :src="bidData.data.memberinfo.avatar" />
          </div>
          <div class="right-avatar">
            <div class="right-item disflex">
              <div v-if="bidData.data.memberinfo.nickname">{{bidData.data.memberinfo.nickname}}</div> 
              <div v-else-if="bidData.data.memberinfo.username">{{bidData.data.memberinfo.username}}</div>
              <div class="right-item-icon basecolor icon iconfont font14 icon-renzheng"></div>
            </div>
            <div class="right-item disflex fontgrey font12">              
              <div class="dot-position">
                <span class="label-dot"></span>
                最近登录时间:{{bidData.data.memberinfo.logintime}}
              </div>
            </div>
            <div v-if="false" class="disflex  right-item-main basecolor font14 bgbasecolor4">               
              <div class="basecolor icon iconfont  icon-homepage_fill"></div>
              <div> 主页</div>
            </div>
          </div>
        </div>

        <div class="deal-info-list  font12">
           <div class="infolist-item disflex">
            <div class="info-list-left">
              交易保障：
            </div>
            <div v-if="bidData.data.askNums" class="info-list-right">
              <div class="identyfy-box font12 fontcolortips">
                  <div class="identify-flg fontcolortips"><div class="icon iconfont icon-yanzheng fontcolortips font12 "></div></div>
                  <div>保证金{{ bidData.data.askNums}}  USDT</div>
                </div>
            </div>           
          </div>
          <div class="infolist-item disflex">
            <div class="info-list-left">
              邮箱验证：
            </div>
            <div class="info-list-right">
              <div v-if="bidData.data.memberinfo.checkemail" class="list-item-label  label-light-success ">
                <span class="font13 icon iconfont icon-duigou_kuai text-success fontcolortips"></span>已验证                
              </div>
              <div v-if="!bidData.data.memberinfo.checkemail" class="list-item-label label-light">
                未验证                
              </div>
            </div>           
          </div> 
          <div class="infolist-item disflex">
            <div class="info-list-left">
              收藏关注：
            </div>
            <div class="info-list-right">
              <b>{{bidData.data.collect}}</b>
              人收藏
            </div>           
          </div>

          <div class="infolist-item disflex">
            <div class="info-list-left">
             累计交易：
            </div>
            <div class="info-list-right">              
              <b>{{bidData.data.tradeNums}}</b>
              笔
            </div>           
          </div>

          <div class="infolist-item disflex">
            <div class="info-list-left">
              最近登录：
            </div>
            <div class="info-list-right">
              <b>
                {{bidData.data.memberinfo.logintime}}
              </b>
              
            </div>           
          </div>

          <div class="infolist-item disflex">
            <div class="info-list-left">
              注册时间：
            </div>
            <div class="info-list-right">
              <b>
                {{bidData.data.memberinfo.ctime}}
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
      {{bidData.data.bidDesp}}		
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
                      <b class="font16 fontdark fontbold">选择出价</b>
                    </div>
                  </div>
                  <div class="timeline-items boxborder font12 ">
                    您可以从买家出价列表中选择适合您的支付方式，在此之前您可能需要对账户进行充币 <a href="my_usdt_in.html">去充币&gt;</a>，冻结保证金以符合交易条件 <a href="my_xbao.html">去冻结&gt;</a>。                </div>
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
    <commonFooter factive='1' />
  </div>
</template>
<style lang="scss">
@import '@/assets/css/transdtl.scss';
.topborder{
    border-top:1px solid #EBEDF3 !important;
  }
</style>