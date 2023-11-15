<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import withdrawSearch from "@/components/common/withdrawSearch.vue";
  import { ref,reactive,ComponentInternalInstance, getCurrentInstance } from "vue";
  import { showDialog } from 'vant';
  import { useRouter } from "vue-router";

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that:any = proxy as object;
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
        withdrawnum:{ labelvalue:"",checked:false },
        withdrawaddress:{ labelvalue:"",checked:false },
        withdrawnet:[
          {cname:"trc20",checked:true,labelvalue:1, labelname:"TRC20",babelname:"波场 Tron" },
          {cname:"erc20",checked:false,labelvalue:2,labelname:"ERC20",babelname:"以太坊 Ethereum"},
        ]
      }
  }) 
  const formdatachange = (item: any) =>{
    if(item.labelvalue) item.checked = true
    else item.checked = false;
  
    if(formdata.data.withdrawaddress.checked && formdata.data.withdrawnum.checked ){ 
      nextclickbtn.value = true
    }else nextclickbtn.value = false;
  } 
  const labelclick = (itemindex:any)=>{
      let items = formdata.data.withdrawnet;
      let item = items[itemindex];
      items.forEach(it=>{it.checked = false});
      item.checked = true
  }


  
 /*点击下一步 */ 
 const toNextcharge = async ()=>{
     if(!formdata.data.withdrawnum.labelvalue){
      showDialog({        
        message: '请输入提币的数量',
      })
      return false;
     }    
     if(!formdata.data.withdrawaddress.labelvalue){
      showDialog({        
        message: '请输入钱包地址',
      })
      return false;
     }  

     if(formdata.data.withdrawaddress.labelvalue.length < 16){
      showDialog({        
        message: '请输入正确地址',
      })
      return false;
     }
    /*数据提交 */
    /*可选择直接连钱包充值 */
    /**或者直接下一步充值 */
    let withdrawUrl = "/api/trans/withdraw"     
    let sendformdata = {
      withdrawnum:formdata.data.withdrawnum.labelvalue,
      withdrawaddress:formdata.data.withdrawaddress.labelvalue,
      withdrawnet:formdata.data.withdrawnet.find(it=>it.checked)
    }
    nextclickbtn.value = false  
    let getdata = await that.$request.post({url:withdrawUrl,data:sendformdata});
     if(getdata.status){
      userinfo.data=that.$commonFunc.updatememinfo()
      if(getdata.message){
        showDialog({message: getdata.message}).then(()=>{
            router.push({path:"/withdrawing/"+getdata.data.orderbill._id}) 
        })
        return ;
      }     
           
     }  
  }


  const toKefu = () =>{
  router.push({path:"/kefu"})
 }
</script>

<template>
  <div class="container ">
    <commonHeader ftitle="提现" />
   
    <div class="recharge-box-wrap bgbasecolor3">
        <div class="fontbasecolor">
            <h1>提币USDT</h1>
            <h5>简单三步，快速提币</h5>
        </div>
    </div>

    <div class="charge-box-wrap padding30 bgwhite">
        <div class="alert-box-wrap disflex label-light-danger">
            <div class="alert-icon-box ">
                <div class="icon iconfont icon-jinggao_o fontdanger font38"></div>
            </div>
            <div class="alert-text-box">                
                <div class="font12 margintop3">
                    提示：谨防油卡，话费卡，灰U变现，USDT跑分等欺诈骗局
                </div>
            </div>
        </div>

        <div>
            <div class="font12">提币网络</div>
            <div class="radio-box-wrap fontdark margintop5">              
              <div class="radio-box font12 fontbold" v-for="(item,index) in formdata.data.withdrawnet" :key="index">
                  <label class="disflex option borderbox" @click="()=>labelclick(index)">
                    <span class="option-control">
                      <span class="disflex radio">
                        <input class="radio-input" type="radio" :name="item.cname" value="1" :checked="item.checked" />
                        <span 
                          :class='["disflex","radio-circle","borderbox",item.checked?"bgbasecolor3":"bgbasecolor6",item.checked?"radio-circle-after":""]'></span>
                      </span>
                    </span>
                    <span class="option-label">
                      <span class="disflex option-head fontbold borderbox">
                        <span class="option-title font12">
                          <span 
                           :class='[item.checked?"label-danger":"label-info","label-inline","label-fixed"]'  
                           >{{item.labelname}}</span>
                        </span>
                        <span class="option-focus font13">{{item.babelname}}</span>
                      </span>
                    </span>
                  </label>
                </div> 
            </div>
        </div>

        <div class="margintop20 fontdark">
          <div class="font12"> 提币地址</div>
          <div>
            <input type="text"
            v-model="formdata.data.withdrawaddress.labelvalue"
            v-on:input="()=>formdatachange(formdata.data.withdrawaddress)"
            class="text-input bgbasecolor7 fontdark font16 borderbox margintop10" placeholder="输入钱包地址" />
          </div>           
        </div>

        <div class="margintop20 fontdark">
          <div class="font12"> 提币数量</div>
          <div>
            <input type="number" 
            v-model="formdata.data.withdrawnum.labelvalue"
            v-on:input="()=>formdatachange(formdata.data.withdrawnum)"
            class="text-input bgbasecolor7 fontdark font16 borderbox margintop10" placeholder="输入要提取的数量" />
          </div>
          <div class="font12 margintop5">
            账户余额:<b>{{userinfo.data.usdtAll}}USDT</b> 
            <span class="basecolor"> 可用:<b>{{userinfo.data.usdt}}USDT</b></span>    
          </div>
          <div class="btn-box-wrap margintop20">
              <button class="btn-box font14 fontbasecolor fontnormal borderbox"
              :disabled="!nextclickbtn"
              @click="toNextcharge">下一步</button>
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
            第一步 填写提币信息
          </div>
          <div class="step-item fontdark font12 margintop5">
            当前支持
            <span class="label-danger label-inline step-btn-padding">TRC20</span>和
            <span class="label-info label-inline step-btn-padding">ERC20</span>
            网络泰达币(USDT)提币，请确认您的钱包网络类型，填写您的提币钱包地址和要提币的USDT数量，点击
            <button class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">下一步</button>。
          </div>

          <div class="card-title fontdark font14 margintop20">
            <span class="icon font12 iconfont icon-jiantouyou basecolor"></span>
            第二步  提交提币订单
          </div>
          <div class="step-item fontdark font12 margintop5">           
            
            将根据您的提币数量计算转账网络手续费，确认提币信息后，请点击
            <button class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">提交订单</button>
          

          </div>

          <div class="card-title fontdark font14 margintop20">
            <span class="icon font12 iconfont icon-jiantouyou basecolor"></span>
            第三步 平台提币转账
          </div>
          <div class="step-item fontdark font12 margintop5">            
            您的提币订单提交，平台工作时间核验确认后30分钟内完成转账，请注意查收。如超过30分钟未转账，请联系
           <span @click="toKefu" class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">在线客服</span>           
          </div>

        </div>        
    </div>
   
    <div class="margintop20 fontdark bgwhite padding20">
          <div class="font16"> 提币订单</div>          
          <withdrawSearch />
    </div> 

    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss">
@import '../trans/common.scss';
</style>
