<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import listSearch from "@/components/common/listSearch.vue";
  import { useRouter } from "vue-router";
  import { ref,reactive,ComponentInternalInstance, getCurrentInstance } from "vue";
  import { showDialog } from 'vant';
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that = proxy as object;
  const router = useRouter();
  //防止重复提交
  let nextclickbtn = ref(true)  
  /**获取账户余额 */
  const userinfo = reactive({data:{usdtAll:"",usdt:""}});

  userinfo.data = that.$vcache.vget("meminfo")
 /**
   * 提交数据
   */
  let formdata = reactive({
      data:{
        rechargenum:null,       
      }
  })
  
 /*点击下一步 */ 
  const toNextcharge = async ()=>{
     if(!formdata.data.rechargenum){
      showDialog({message: '请输入需要充值的数量',})
      return false;
     }    
    /*数据提交 */
    /*可选择直接连钱包充值 */
    /**或者直接下一步充值 */
    let chargeUrl = "/api/trans/trxexchange"     
    let sendformdata = {trxexchangenum:formdata.data.rechargenum}
    nextclickbtn.value = false
    let getdata = await that.$request.post({url:chargeUrl,data:sendformdata});
     if(getdata.status){
       router.push({path:"/chargeing/"+getdata.data.orderbill._id})     
     }  
  }

const formdatachange = (e: any) =>{
  if(!formdata.data.rechargenum)  nextclickbtn.value = false
  else  nextclickbtn.value = true
} 

</script>

<template>
  <div class="container ">
    <commonHeader ftitle="换汇" />
   
    <div class="recharge-box-wrap bgbasecolor3">
        <div class="fontbasecolor">
            <h1>TRX换汇</h1>
            <h5>简单三步，快速换汇</h5>
        </div>
    </div>

    <div class="charge-box-wrap padding30 bgwhite">
        <div class="alert-box-wrap disflex label-light-danger">
            <div class="alert-icon-box ">
                <div class="icon iconfont icon-jinggao_o fontdanger font42"></div>
            </div>
            <div class="alert-text-box">
                <h5 class="fontbold margin0">提示</h5>
                <div class="font12 margintop3">
                  充币地址仅接受 <b>波场TRX</b> 充币，随意转入其他任何币种 <b>概不受理损失自负</b>，如无法分辨确认，请勿使用！<b>TRX换汇USDT将收取您对应服务费率，请仔细查看订单详情</b>，一旦换汇成功无法撤销，发起换汇订单即视为您已认同该服务使用条款。<b>充币订单地址为易优公用地址，仅在订单时效内匹配充值，请勿私用随意转入</b>，如未按规则流程使用，造成任何损失自负！  </div>
            </div>
        </div>
        
     
        <div class="margintop10 chargeing-lineheight">          
          
          <div class="margintop20 fontdark">
            <div class="font12"> 换汇数量</div>
            <div>
              <input type="number" 
                 v-model="formdata.data.rechargenum"
                 v-on:input="(e: any)=>formdatachange(e)"
              class="text-input bgbasecolor7 fontdark font16 borderbox margintop10" placeholder="输入要充币的TRX数量" />
            </div>
            <div class="font12 margintop5">
              账户余额:<b>{{userinfo.data.usdtAll}}USDT</b> 
              <span class="basecolor"> 可用:<b>{{userinfo.data.usdt}}USDT</b></span>    
            </div>
            <div class="btn-box-wrap margintop20">
                <button class="btn-box font14 fontbasecolor fontnormal borderbox " 
                  :disabled="!nextclickbtn"
                  @click="toNextcharge"
                >下一步</button>
                <div class="btn-fixed right-tips-mute font12 borderbox margintop5">
                  账户邮箱未验证，请验证后充币       
                  <span class="basecolor">去验证</span>         
                  <span class="icon font12 iconfont icon-jiantouyou basecolor"></span>
                </div>
              </div> 
          </div>


              
        </div>

        <div class="margintop40 step-box-wrap font14 ">
          <div class="card-title basecolor font14">
            <span class="icon font12 iconfont icon-jiantouxia "></span>
            第一步 填写充币数量
          </div>
          <div class="step-item fontdark font12 margintop5">
            当前支持
            <span class="label-danger label-inline step-btn-padding">TRC20</span>和
            <span class="label-info label-inline step-btn-padding">ERC20</span>
            网络泰达币(USDT)充币，请确认您的转账网络类型，填写要充币的USDT数量，点击
            <button class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">下一步</button>。
          </div>

          <div class="card-title fontdark font14 margintop20">
            <span class="icon font12 iconfont icon-jiantouyou basecolor"></span>
             第二步  生成充币订单
          </div>
          <div class="step-item fontdark font12 margintop5">           
            易优会为您分配一个充币地址，并生成充币订单，该充币订单30分钟内有效，转账完成后请点击
            <span class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">我已支付</span>
            开始验证。如超时前您<span class="basecolor">未完成支付</span>
            ，则超时后自动取消该充币订单。
            ，<span class="fontdanger">订单取消后请勿向订单地址转账，否则有可能被他人订单认领</span>

          </div>

          <div class="card-title fontdark font14 margintop20">
            <span class="icon font12 iconfont icon-jiantouyou basecolor"></span>
            第三步 转账支付充币
          </div>
          <div class="step-item fontdark font12 margintop5"> 
            使用您的钱包扫码或输入我们的充币地址，足额转账要充币的数量，转账完成点击
            <span class="vbtn-noborder bgbasecolor4 basecolor label-inline step-btn-padding">我已支付</span>
            开始验证，区块验证成功后充币到账。
           <span class="basecolor">如因您转账数量误差</span>
           ，转账后超过10分钟未自动验证入账，请尽快联系 
           <span class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">在线客服</span>
           处理。
          </div>

        </div>        
    </div>
   
    <div class="margintop20 fontdark bgwhite padding20">
      <div class="font16"> 充币订单</div>
      <listSearch />
    </div>
    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss">
@import './common.scss';
.chargeing-lineheight{line-height: 28px;}
.qcord-box{width: 200px; height: 200px; margin-bottom: 15px;  border-radius: 0.42rem;border: 1px solid #EBEDF3;padding: 2px;}
.step-btn-fixed{padding: 2.4px 9px !important;}
.search-btn-box-fixed{padding: 2px 0 !important;}
.search-btn-area{padding-top: 20px; }
</style>
