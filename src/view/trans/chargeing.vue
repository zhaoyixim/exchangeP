<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import recordlist from "@/components/lists/recordlist.vue"; 
  import { useRouter } from "vue-router";
  import { ref,reactive,getCurrentInstance,ComponentInternalInstance } from "vue";
  import { showToast,showDialog } from 'vant';
  import { useCountDown } from '@vant/use';
  import vbtnDialog from "@/components/vdialog/vbtnDialog.vue";
  import useClipboard from 'vue-clipboard3';
  const { toClipboard } = useClipboard();
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that = proxy as object;
  const router = useRouter()
  let orderId = router.currentRoute.value.params.id;
  let pageData = reactive({data:{
    netTypeLabel:"",_id:"",orderSts:"",leftTimeSeconds:0,orderStsLabel:"",ctime:"",nums:"",address:"",hint:"",qrcode:""}});


  const vervifyBtnLoading = ref(false)
  const vervifyBtnEnable = ref(false)
  const confirmData = reactive({data:{}})
  const comfirmBtnEnable = ref(false)
  /**验证参数 */
  const validData = reactive({walletAddress:"",payHash:""})
  const initPageData =new Promise(async (resolve, reject) => {
    let pageUrl = "/api/trans/chargeing/"+orderId    
    let getdata = await that.$request.get({url:pageUrl});
    if(getdata.status){
      pageData.data = getdata.data   
      pageData.data.netTypeLabel = pageData.data.netTypeLabel.toUpperCase()
      if(getdata.data.depositData){
        confirmData.data=getdata.data.depositData
        validData.walletAddress=confirmData.data.walletAddress
        validData.payHash=confirmData.data.payHash
        if( validData.payHash){
          comfirmBtnEnable.value = true
          vervifyBtnEnable.value = true
        }
      }
    }
    resolve(pageData)
   })
 
  let current = reactive({})
  let showTimeBlock = ref(true)
  initPageData.then(res=>{    
    let data = res.data
    if(pageData.data.leftTimeSeconds<=0) showTimeBlock.value = false
    else showTimeBlock.value = true
    const countDown = useCountDown({
        time: data.leftTimeSeconds,
      onFinish:()=>{
        /**倒计时完 取消订单 */
        cancelOrderBill()
        pageData.data.orderSts = "4"
        pageData.data.orderStsLabel = "验证超时"
        showTimeBlock.value = false
      }
    });    
    // 开始倒计时
    countDown.start();
    current = countDown.current;     
  })   
//复制
const copybtn =async ()=>{
  let address =  pageData.data.address
  if(!address ) {showDialog({message: "请输入钱包地址"}); return false;}
  if(address.length<16) {showDialog({message: "请输入正确的钱包地址"}); return false;}
  try {
    await toClipboard(address);
    showToast("复制成功!");
  } catch (e) {
    console.error(e);
    showToast("复制失败!您的浏览器不支持复制功能!");   
  }      
}
/**dialog 数据 */
let vdialogcontroll = reactive({content:"",show:false,title:"",modelType:"0"});
/**取消充值 */
let needScondClick :number = 1;
const cancelDialog = ()=>{
  vdialogcontroll.show = !vdialogcontroll.show 
  if(needScondClick === 1){
    needScondClick = 2
    vdialogcontroll.title = "待确认"
    vdialogcontroll.content = "确定取消该充币订单吗?"
    vdialogcontroll.modelType = "1"
  } 
}
/**我已经支付 */
const confirmDialog =async ()=>{    
  if(!validData.walletAddress){showToast("请输入付款钱包");return ;}
  if(!validData.payHash){showToast("请输入付款hash值");return ;}
  if(confirmData.data?.conSts){showToast("您已经提交过了");return ;}
  let {conSts,data,message}=await confirmOrderBill();
  confirmData.data =data      
    if(!conSts){      
       showToast(message);
    }else{
        vervifyBtnEnable.value = true
        comfirmBtnEnable.value=true
        vdialogcontroll.title = "订单确认成功，等待网络验证"
        vdialogcontroll.show = true
        vdialogcontroll.modelType = "2" 
    }
    
}
/**确定回调-或者唯一时候的回调 */
const confirmBtn =async ()=>{
  if(needScondClick == 2){
    needScondClick = 1   
    let {data,status} = await cancelOrderBill();
    console.log({data,status})
    if(status){      
      if(data.message){
        showToast(data.message);
      }else{  
        vervifyBtnEnable.value = true      
        vdialogcontroll.title = "充币订单取消成功"
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
/*** 内部方法 */ 
/*** 取消订单*/
const cancelOrderBill =async ()=>{
  let cancelOrdderUrl = "/api/trans/cancel/"+orderId;
  return await that.$request.get({url:cancelOrdderUrl});  
}
/*** 确定支付订单*/
const confirmOrderBill = async ()=>{
  let sendData = {orderId,walletAddress:validData.walletAddress,
    payHash:validData.payHash}
  let confirmOrdderUrl = "/api/trans/confirm";
  const reback = await that.$request.post({url:confirmOrdderUrl,data:sendData});
  return reback.data;
}
/**验证网络情况 */
const checkNetVerifyBtn = async() => {
  const verifyUrl = "/api/v1/table/netverify";
  if(confirmData.data._id){
    vervifyBtnLoading.value = true
    const reback = await that.$request.post({url:verifyUrl,data:{depositId:confirmData.data._id}});
  }
}
const clearInput =(item)=>{
  item = ""
}
/**搜索部分 */
const searchnet = (e:any)=>{  
      let itemindex = e.target.value
      let items = searchdata.data.ordernet;
      let item = items[itemindex];
      items.forEach(it=>{it.selected = false});    
      item.selected = true
  }  
  const searchordersts = (e:any)=>{
      let itemindex = e.target.value
      let items = searchdata.data.ordersts;
      let item = items[itemindex];
      items.forEach(it=>{it.selected = false});
      item.selected = true
  }   
  /**   搜索数据*/
   let searchdata = reactive({
        data:{
          ordernum:null,
          ordernet:[
            {cname:null,   labelvalue:0,selected:true, labelname:"请选择充币网络"},
            {cname:"trc20",labelvalue:1,selected:false,labelname:"波场-TRC20"},
            {cname:"erc20",labelvalue:2,selected:false,labelname:"以太坊-ERC20"},      
          ],
          ordersts:[
            {labelvalue:0,selected:true, labelname:"订单状态"},
            {labelvalue:1,selected:false,labelname:"支付成功"},
            {labelvalue:2,selected:false,labelname:"转账验证"},
            {labelvalue:3,selected:false,labelname:"等待支付"},
            {labelvalue:4,selected:false,labelname:"验证超时"},
            {labelvalue:5,selected:false,labelname:"订单取消"}            
          ]
        }
   })

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
  const clickPageChange = async (event: number)=>{
    pageInfo.currentPage = event
    getorderlist(pageInfo)
  }
  
  const clickSearch = async ()=>{
      let ordernet = searchdata.data.ordernet.find(it=>it.selected);
      let orderSts = searchdata.data.ordersts.find(it=>it.selected);
      let ordernum = searchdata.data.ordernum;    
      if(!ordernum && orderSts?.labelvalue ===0 && ordernet?.labelvalue === 0){
        showDialog({message: "请输入查询条件"}); return false;
      }
      let senddata = {
        ordernum,
        ordernet,
        orderSts
      }
      if(ordernet?.labelvalue == 0) delete senddata.ordernet;
      if(orderSts?.labelvalue == 0) delete senddata.orderSts;    
      let searchurl = "/api/search/orderlist"
      let getdata = await that.$request.post({url:searchurl,data:senddata});
      if(getdata.status){          
          pageInfo.totalItems=getdata.totalItems   
          pageInfo.pageTotal = Math.ceil(getdata.totalItems / getdata.pageSize);
          lists.data=getdata.list         
        } 
   }

</script>

<template>
  <div class="container ">
    <commonHeader ftitle="充值USDT" />    
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
            <h1>充币USDT</h1>
            <h5>简单三步，快速充币</h5>
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
        <div class="font14 fontbold">二维码</div>            
        <div class="qcord-box">
          <img  class="image-box" :src="pageData.data.qrcode"  />
        </div>
        <div class="margintop20 fontdark">
          <div class="font12"> 充币地址:{{pageData.data.address}}</div>
          <button 
            @click="()=>copybtn()"
          class="vbtn-noborder  font12 bgbasecolor7 fontgrey label-inline step-btn-padding margintop10 step-btn-fixed">复制</button>         
        </div>
        <div class="margintop10 chargeing-lineheight">
          <div class="font14 fontbold font333">{{pageData.data.address}}</div>  
          <div class="chargeing-listinfo-box font13 font333">
            <div class="disflex justify-spacebetween">
                <div>充币网络：</div>
                <div class="font12"><span class="label-danger label-inline step-btn-padding step-btn-fixed">
                  {{pageData.data.netTypeLabel}}
                </span></div>
            </div>
            <div class="disflex justify-spacebetween">
                <div>充币数量：</div>
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
            <div v-if="showTimeBlock" class="disflex justify-spacebetween">
                <div>订单超时：</div>
                <div><span v-if="current.seconds" class="fontbold">还剩 {{current.minutes}} 分 {{ current.seconds}} 秒</span></div>
            </div>
          </div>

          <div class="margintop20">
              <div class="fontdark font17">输入钱包地址 <span class="fontB5 font14">(用于验证使用)</span></div> 
              <div class="input-wrap disflex font12 align-items-center margintop10"> 
                  <input v-model="validData.walletAddress" @focus="()=>clearInput(validData.payHash)" placeholder="请输入付款钱包地址"  class="borderbox font14 input-item text-input bordergrey"  /> 
              </div>
              <div class="margintop10 fontB5 font12">
              </div>        
          </div>

          <div class="margintop20">
              <div class="fontdark font17">输入支付HASH值 <span class="fontB5 font14">(用于验证使用)</span></div> 
              <div class="input-wrap disflex font12 align-items-center margintop10"> 
                  <input v-model="validData.payHash" @focus="()=>clearInput(validData.payHash)" placeholder="请输入付款哈希值" class="borderbox font14 input-item text-input bordergrey"  /> 
              </div>
              <div class="margintop10 fontB5 font12">
              </div>        
          </div>

          <div class="search-btn-area margintop20 font14 bordertop">
              <button @click="()=>confirmDialog()"
                 :disabled="comfirmBtnEnable" 
                 :class='["search-btn-box","search-btn-box-transparent",comfirmBtnEnable?"bgbasecolor4":"bgbasecolor3","fontbasecolor","search-btn-box-fixed"]'>我已支付</button>
          </div>
          <div v-if="vervifyBtnEnable" class="margintop20 font14">
              <van-button :loading="vervifyBtnLoading" type="primary" @click="()=>checkNetVerifyBtn()" 
                text="查看网络验证结果"  loading-text="查看网络验证结果" size="small"
                class="search-btn-box search-btn-box-transparent bgbasecolor7 fontgrey search-btn-box-fixed"/>
                
          </div>

          <div class="margintop20 font14">
              <button @click="()=>cancelDialog()" class="search-btn-box search-btn-box-transparent bgbasecolor7 fontgrey search-btn-box-fixed">取消</button>
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
      <div class="margintop20">
             <div class="padding10 paddingbottom0 font14">
              <div class=" disflex align-items-center bgbasecolor7 charge-search-box">
                <div class="charge-search-input-icon font26 icon iconfont icon-sousuo1"></div>
                <div class="charge-search-input-wrap"> <input type="number" v-model="searchdata.data.ordernum" class="search-input" placeholder="搜索编号" /></div>              </div>             
             </div>

            <div class="search-box-body bgwhite">
              <div class="select-area-charge "> 
                <div class="select-box ">
                  <select class="select-item2 fontdark font14"   @change="(e)=>searchnet(e)" placeholder="请选择充币网络">
                    <option v-for="(it,idx) in searchdata.data.ordernet" :key="idx" :value="it.labelvalue"  @click="()=>searchnet(idx)">
                      {{it.labelname}}
                    </option> 
                  </select>
                </div>
                <div class="select-box margintop10">
                  <select class="select-item2 fontdark font14" @click="(e)=>searchordersts(e)" >
                    <option v-for="(its,idxs) in searchdata.data.ordersts" :key="idxs" :value="its.labelvalue"  >
                      {{its.labelname}}
                    </option>                                                                                                                                         
                  </select>
                </div>
              </div>              
              <div class="search-btn-area margintop10">
                <button @click="()=>clickSearch()" class="search-btn-box search-btn-box-transparent bgbasecolor4 basecolor font16">搜索</button>
              </div>
            </div>
          </div>
          <div class="recordlist-wrap">
              <recordlist  :lists="lists.data" />
              <div class="margintop10">
                <van-pagination 
                  v-model="pageInfo.currentPage" 
                  :total-items="pageInfo.totalItems" 
                  :show-page-size="pageInfo.pageSize" 
                  @change="(e)=>clickPageChange(e)"                 >
                  <template #prev-text>
                    <van-icon name="arrow-left" />
                  </template>
                  <template #next-text>
                    <van-icon name="arrow" />
                  </template>
                  <template #page="{ text }">{{ text }}</template>
                </van-pagination>
                <div class="text-align font12 fontgrey margintop10">共{{pageInfo.totalItems}}条记录，每页显示10条，当前第{{pageInfo.currentPage}}/{{pageInfo.pageTotal}}页</div>
              </div>             
          </div>
          <div v-if="lists.data.length<=0" class="charge-no-content no-content fontgrey">暂无相关数据 </div>
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
/**搜索部分 */
.select-area-charge {
    .select-item2{width: 100%;}
}
.charge-search-box{padding: 0 10px;border-radius: 0.42rem;}
.charge-search-input-icon{width: 26px;}
.charge-search-input-wrap{flex: 1;}
.charge-no-content{padding: 80px 0;}
</style>
