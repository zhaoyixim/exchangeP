<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import withdrawSearch from "@/components/common/withdrawSearch.vue";
  import { useRouter } from "vue-router";
  import { ref,reactive,getCurrentInstance,ComponentInternalInstance } from "vue";
  import { showToast,showDialog } from 'vant'; 
  import vbtnDialog from "@/components/vdialog/vbtnDialog.vue";
  import useClipboard from 'vue-clipboard3';
  const { toClipboard } = useClipboard();
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that = proxy as object;
  const router = useRouter()

  //复制
const copybtn =async ()=>{
  let address =  pageData.data.address
  if(!address ) {
    showDialog({message: "请输入钱包地址"}); return false;
  }
  if(address.length<16) {
    showDialog({message: "请输入正确的钱包地址"}); return false;
  }

  try {
    await toClipboard(address);
    showToast("复制成功!");
  } catch (e) {
    console.error(e);
    showToast("复制失败!您的浏览器不支持复制功能!");   
  }      
}


  let orderId = router.currentRoute.value.params.id;
  let pageData = reactive({data:{
    netTypeLabel:"",_id:"",orderSts:"",leftTimeSeconds:0,orderStsLabel:"",ctime:"",nums:"",address:"",hint:"",qrcode:""}});

  
  const initPageData =new Promise(async (resolve, reject) => {
    let pageUrl = "/api/trans/chargeing/"+orderId    
    let getdata = await that.$request.get({url:pageUrl});
    if(getdata.status){
      pageData.data = getdata.data   
      pageData.data.netTypeLabel = pageData.data.netTypeLabel.toUpperCase()
    }
    resolve(pageData)
   })

  initPageData.then(res=>{}) 
/**dialog 数据 */
let vdialogcontroll = reactive({content:"",show:false,title:"",modelType:"0"});
/**取消充值 */
let needScondClick :number = 1;
const cancelDialog = ()=>{
  vdialogcontroll.show = !vdialogcontroll.show 
  if(needScondClick === 1){
    needScondClick = 2
    vdialogcontroll.title = "待确认"
    vdialogcontroll.content = "确定取消该提现订单吗?"
    vdialogcontroll.modelType = "1"
  } 
}
/**确定回调-或者唯一时候的回调 */
const confirmBtn =async ()=>{
  if(needScondClick == 2){
    needScondClick = 1   
    let getdata = await cancelOrderBill();
    if(getdata.status){      
      if(getdata.data.message){
        showToast(getdata.data.message);
      }else{        
        vdialogcontroll.title = "提现订单取消成功"
        vdialogcontroll.content = ""
        vdialogcontroll.modelType = "2"
      }
    }
  }
}
/**删除回调 */
const cancelBtn =  ()=>{ 
  vdialogcontroll.show = false
}

/**
 * 内部方法
 */
 
 /**
  * 取消订单
  */

  const cancelOrderBill =async ()=>{
    let cancelOrdderUrl = "/api/trans/withdrawcancel/"+orderId;
    return await that.$request.get({url:cancelOrdderUrl});  
  }


   /**页面数据 */
   let pageInfo = reactive({currentPage:1,totalItems:10,pageSize:10,pageTotal:1})
   
   /**传给子组件的值 */
   const lists = reactive({data:[]});
  
   //const recordlist = [{ lists : data }];
   /*默认查询订单记录 */

   const getorderlist =async ( pageInfo: { currentPage: number; totalItems: number; pageSize: number; pageTotal: number; })=>{    
        let searchorderurl = "/api/search/orderlist";
        let getdata = await that.$request.post({url:searchorderurl,data:pageInfo});
        if(getdata.status){          
          pageInfo.totalItems=getdata.totalItems   
          pageInfo.pageTotal = Math.ceil(getdata.totalItems / getdata.pageSize);
          lists.data=getdata.list         
        } 
   }
   getorderlist(pageInfo);


</script>

<template>
  <div class="container ">
    <commonHeader ftitle="提现" />    
    <vbtnDialog 
    @confirmCall="confirmBtn" 
    @cancelCall="cancelBtn" 
    :title="vdialogcontroll.title"
    :show = "vdialogcontroll.show"
    :content = "vdialogcontroll.content"
    :modelType = "vdialogcontroll.modelType"
    />
    <div class="recharge-box-wrap bgbasecolor3">
        <div class="fontbasecolor">
            <h1>提现到钱包</h1>
            <h5>简单三步，快速提现</h5>
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
                  {{pageData.data.hint}}
                </div>
            </div>
        </div>        
        
        <div class="margintop20 fontdark disflex">
          <div class="font12"> 提现地址</div>
          <button @click="()=>copybtn()" class="vbtn-noborder font12 bgbasecolor7 fontgrey label-inline step-btn-padding  marginleftfixed step-btn-fixed">复制</button>         
        </div>
        <div class="margintop10 chargeing-lineheight">
          <div class="font14 fontbold font333">{{pageData.data.address}}</div>  
          <div class="chargeing-listinfo-box font13 font333">
            <div class="disflex justify-spacebetween">
                <div>提现网络：</div>
                <div class="font12"><span class="label-danger label-inline step-btn-padding step-btn-fixed">
                  {{pageData.data.netTypeLabel}}
                </span></div>
            </div>
            <div class="disflex justify-spacebetween">
                <div>提现数量：</div>
                <div><span class="font14 fontbold">{{pageData.data.nums}} USDT</span></div>
            </div>
          </div>

          <div class="font14 fontbold font333 margintop20">订单信息</div>  
          <div class="chargeing-listinfo-box font13 font333">            
            <div class="disflex justify-spacebetween">
                <div>订单编号：</div>
                <div><span class="fontbold"> {{pageData.data._id}} </span></div>
            </div>
            <div class="disflex justify-spacebetween">
                <div>订单状态：</div>
                <div><span class="fontbold">{{pageData.data.orderStsLabel}}</span></div>
            </div>
            <div class="disflex justify-spacebetween">
                <div>生成日期：</div>
                <div><span class="fontbold"> {{pageData.data.ctime}} </span></div>
            </div>          
          </div>
       
          <div class="margintop20 font14">
              <button @click="()=>cancelDialog()" 
                class="search-btn-box search-btn-box-transparent bgbasecolor7 fontgrey search-btn-box-fixed">取消提现</button>
          </div>

              
        </div>

        <div class="margintop40 step-box-wrap font14 ">
          <div class="card-title fontdark font14">
            <span class="icon font12 iconfont icon-jiantouyou"></span>
            第一步 填写充币数量
          </div>
          <div class="step-item fontdark font12 margintop5">
            当前支持
            <span class="label-danger label-inline step-btn-padding">TRC20</span>和
            <span class="label-info label-inline step-btn-padding">ERC20</span>
            网络泰达币(USDT)充币，请确认您的转账网络类型，填写要充币的USDT数量，点击
            <button class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">下一步</button>。
          </div>

          <div class="card-title  basecolor  font14 margintop20">
            <span class="icon font12 iconfont icon-jiantouxia basecolor"></span>
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
         <div class="font16"> 提币订单</div>      
         <withdrawSearch/>
    </div>
    
   

    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss">
@import '../trans/common.scss';
.chargeing-lineheight{line-height: 28px;}
.qcord-box{width: 200px; height: 200px; margin-bottom: 15px;  border-radius: 0.42rem;border: 1px solid #EBEDF3;padding: 2px;}
.step-btn-fixed{padding: 2.4px 9px !important;}
.search-btn-box-fixed{padding: 2px 0 !important;}
.search-btn-area{padding-top: 20px; }
/**搜索部分 */

.marginleftfixed{margin-left: 20px;}
</style>
