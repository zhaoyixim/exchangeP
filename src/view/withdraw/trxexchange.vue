<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import exchangeSearch from "@/components/common/exchangeSearch.vue";
  import { ref,reactive,ComponentInternalInstance, getCurrentInstance } from "vue";
  import { useRouter } from "vue-router";
  import { showDialog } from 'vant';

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that = proxy as object;
  const router = useRouter();
  let nextclickbtn = ref(false)
    /**获取账户余额 */
  const userinfo = reactive({data:{usdtAll:"",usdt:""}});

  userinfo.data = that.$vcache.vget("meminfo")
   /**
   * 提交数据
   */
   let formdata = reactive({
      data:{
        trxexchangenum:{ labelvalue:"",checked:false },
        trxexchangenumaddress:{ labelvalue:"",checked:false },
        trxexchangenumwnet:[
          {cname:"trc20",checked:true,labelvalue:1, labelname:"TRC20",babelname:"波场 Tron" },
          {cname:"erc20",checked:false,labelvalue:2,labelname:"ERC20",babelname:"以太坊 Ethereum"},
        ]
      }
  }) 

  const formdatachange = (item: any) =>{
    if(item.labelvalue) item.checked = true
    else item.checked = false;
    if(formdata.data.trxexchangenum.checked && formdata.data.trxexchangenumaddress.checked ) nextclickbtn.value = true
    else nextclickbtn.value = false;
  } 
 /*点击下一步 */ 
 const toNextcharge = async ()=>{
     if(!formdata.data.trxexchangenum.labelvalue){
      showDialog({message: '请输入提币的数量',})
      return false;
     }    
     if(!formdata.data.trxexchangenumaddress.labelvalue){
      showDialog({message: '请输入钱包地址',})
      return false;
     }  

     if(formdata.data.trxexchangenumaddress.labelvalue.length < 16){
      showDialog({message: '请输入正确地址',})
      return false;
     }
    /*数据提交 */
    /*可选择直接连钱包充值 */
    /**或者直接下一步充值 */
    let exchangeUrl = "/api/trans/trxexchange"     
    let sendformdata = {
      trxexchangenum:formdata.data.trxexchangenum.labelvalue,
      trxexchangenumaddress:formdata.data.trxexchangenumaddress.labelvalue,
      trxexchangenumwnet:formdata.data.trxexchangenumwnet.find(it=>it.checked)
    }
    nextclickbtn.value = false  
    let getdata = await that.$request.post({url:exchangeUrl,data:sendformdata});
     if(getdata.status){
      userinfo.data=that.$commonFunc.updatememinfo()
      if(getdata.message){      
        showDialog({message: getdata.message}).then(()=>{
            router.push({path:"/exchangeing/"+getdata.data.orderbill._id}) 
        })
        return ;
      }     
           
     }  
  }
</script>

<template>
  <div class="container ">
    <commonHeader ftitle="交换" />
   
    <div class="recharge-box-wrap bgbasecolor3">
        <div class="fontbasecolor">
            <h1>兑换TRX</h1>
            <h5>简单三步，快速兑换</h5>
        </div>
    </div>

    <div class="charge-box-wrap padding30 bgwhite">

        <div class="margintop20 fontdark">
          <div class="font12"> 兑换地址</div>
          <div>
            <input type="text"
            v-model="formdata.data.trxexchangenumaddress.labelvalue" 
            v-on:input="()=>formdatachange(formdata.data.trxexchangenumaddress)"
            class="text-input bgbasecolor7 fontdark font16 borderbox margintop10" placeholder="输入您的TRC-20钱包地址" />
          </div>           
        </div>

        <div class="margintop20 fontdark">
          <div class="font12"> 兑换数量</div>
          <div>
            <input type="number" 
            v-model="formdata.data.trxexchangenum.labelvalue" 
            v-on:input="()=>formdatachange(formdata.data.trxexchangenum)"
            class="text-input bgbasecolor7 fontdark font16 borderbox margintop10" placeholder="输入兑换花费的USDT数量" />
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

        <div class="margintop20 step-box-wrap font14 ">
          <div class="card-title basecolor font14">
            <span class="icon font12 iconfont icon-jiantouxia "></span>
            第一步 填写兑换信息
          </div>
          <div class="step-item fontdark font12 margintop5">
           
            当前仅支持向您的
            <span class="basecolor fontbold">TRC-20网络地址兑换TRX</span>
            ，请确认您的钱包地址类型，填写您的钱包地址和兑换花费USDT数量，点击
            <button class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">下一步</button>。
          </div>

          <div class="card-title fontdark font14 margintop20">
            <span class="icon font12 iconfont icon-jiantouyou basecolor"></span>
            第二步  提交兑换订单
          </div>
          <div class="step-item fontdark font12 margintop5">
            将根据您的花费的USDT数量计算实际兑换TRX数量和转账网络手续费，确认兑换信息后，输入您的安全密码点击
            <button class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">提交订单</button>
          

          </div>

          <div class="card-title fontdark font14 margintop20">
            <span class="icon font12 iconfont icon-jiantouyou basecolor"></span>
            第三步 平台兑换转账
          </div>
          <div class="step-item fontdark font12 margintop5">            
            
            您的兑换订单提交，平台核验确认后10分钟内完成兑换转账，请注意查收。如超过60分钟未转账，请联系
           <span class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">在线客服</span>           
          </div>

        </div>        
    </div>
   
    <div class="margintop20 fontdark bgwhite padding20">
          <div class="font16"> 兑换订单</div>
          <exchangeSearch />
    </div>
    


    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss">
@import '../trans/common.scss';
</style>
