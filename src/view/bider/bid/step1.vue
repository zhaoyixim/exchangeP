<script lang="ts" setup>
import { reactive,ref } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance } from "@vue/runtime-core";
import { showToast } from "vant";
const currentIntReadOnly = defineProps({ currentPriceInt:String || Number,passLimitUsdt:Boolean})
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that = proxy as object;
/**
   * 提交数据
   */
   const formdata = reactive({
      data:{
        step:1,
        bidprice:-5, //默认交易单价
        realPrice:0,//计算出来的价格
      
        withdrawaddress:{ labelvalue:"",checked:false },
        bidmethod:[
            {cname:"QQ支付",labelvalue:1,key:"qq",checked:false},
            {cname:"微信支付",labelvalue:2,key:"weixin",checked:true},
            {cname:"支付宝",labelvalue:3,key:"alipay",checked:false},
        ],
        setbid:[
          {cname:"我要购买泰达币",checked:true,labelvalue:1, labelname:"您的出价将公布于出售USDT页面"},
          {cname:"我要出售泰达币",checked:false,labelvalue:2, labelname:"您的出价将公布于购买USDT页面"},          
        ],
        bidtype:[
          {cname:"动态价格",checked:true,cvalue:0, labelvalue:1, labelname:"购买价格将根据泰达币市价变动"},
          {cname:"固定价格",checked:false,cvalue:0,labelvalue:2, labelname:"锁定购买价格，不会根据市价变动"},          
        ]
      }
  }) 

const currentInt =ref();
currentInt.value  = currentIntReadOnly.currentPriceInt as string
const youNowPrice = ref<string |number | any>();
const bidpriceInit:any = ref(6.20);//固定买入单价初始值，从接口获得
const bidpriceSellInit:any = ref(6.45);//固定售出单价初始值，从接口获得

const getInitData = async () => {
  const initPirceUrl = "api/bid/bidinitPrice";
  await that.$request.get({url:initPirceUrl}).then((res: any)=>{    
    bidpriceInit.value =  parseFloat(res.bidpriceInit);
    bidpriceSellInit.value = parseFloat(res.bidpriceSellInit);
    formdata.data = res.initdata;
  });
}
getInitData();

//0 --减 1--加 2 --不是加减
const coomputStepNowPrice = (plusFlg :number=2) => {
  if(formdata.data.bidtype[0].checked){
    if(formdata.data.setbid[0].checked){
      youNowPrice.value =(1 + formdata.data.bidprice*0.01) * parseFloat(currentInt.value)
      youNowPrice.value = (Math.ceil(youNowPrice.value*100)/100).toFixed(2); 
      formdata.data.bidtype[1].cvalue =  youNowPrice.value
    }
    if(formdata.data.setbid[1].checked){
      youNowPrice.value =(1 + formdata.data.bidprice*0.01) * parseFloat(bidpriceSellInit.value)
      youNowPrice.value = (Math.ceil(youNowPrice.value*100)/100).toFixed(2); 
      formdata.data.bidtype[1].cvalue =  youNowPrice.value
    }
  }else if(formdata.data.bidtype[1].checked){    
    if(plusFlg ==1){
      //点击了加号
      bidpriceInit.value = (Math.ceil(formdata.data.bidprice * 100 + 1)/100).toFixed(2);  
      formdata.data.bidprice = bidpriceInit.value  

    }else if(plusFlg == 0){
      bidpriceInit.value = (Math.ceil(formdata.data.bidprice * 100 - 1)/100).toFixed(2);
      formdata.data.bidprice = bidpriceInit.value
    }else{
      if(formdata.data.setbid[0].checked){
        formdata.data.bidprice = bidpriceInit.value.toFixed(2)
      }else{
        formdata.data.bidprice = bidpriceSellInit.value.toFixed(2)
      }
    }
   
  }
  
}

coomputStepNowPrice()
const emit = defineEmits(["stepClick"]);
/**
 *  第一步提交
 */
const stepClick = () =>{ 
  if(!currentIntReadOnly.passLimitUsdt){
    showToast("您账户U币不足，请充值")
    return ;
  }
  formdata.data.realPrice = youNowPrice.value; 
   emit("stepClick",formdata)
}

/*点击减号 */
const minuStepCount = () => {
  if(formdata.data.bidtype[0].checked) formdata.data.bidprice -=1;
  coomputStepNowPrice(0)
  
}
/*加号 */
const PlusStepCount = () => {
  if(formdata.data.bidtype[0].checked) formdata.data.bidprice +=1;
  coomputStepNowPrice(1)
}

/**设置出价 */
const setbidlabelclick = (item: any,biddatas: any[]) =>{
  biddatas.forEach((it: any) => {it.checked = false});
  item.checked = true
  if(item.labelvalue == 1) {
    formdata.data.bidprice = -5;
    formdata.data.bidtype[0].labelname = "购买价格将根据泰达币市价变动"
    formdata.data.bidtype[1].labelname = "锁定购买价格，不会根据市价变动"
  }else {
    formdata.data.bidprice = 5;  
    formdata.data.bidtype[0].labelname = "出售价格将根据泰达币市价变动"
    formdata.data.bidtype[1].labelname = "锁定出售价格，不会根据市价变动"
  }  
  coomputStepNowPrice()

}
/**出价类型 */
const bidtypelabelclick = (item: any,biddatas: any[]) =>{
  biddatas.forEach((it: any) => {it.checked = false});
  item.checked = true
  if(item.labelvalue == 1){
    if(formdata.data.setbid[1].checked){
      formdata.data.bidprice = 5;
      youNowPrice.value = bidpriceSellInit.value
    }else{
      formdata.data.bidprice = -5;
      youNowPrice.value = bidpriceInit.value
    }
    
  } else {
    formdata.data.bidprice = 5;
    if(formdata.data.setbid[1].checked){
      formdata.data.bidprice = bidpriceSellInit.value.toFixed(2)
    }else{
      formdata.data.bidprice = bidpriceInit.value.toFixed(2)
    }    
  }
}

const clickMethod = (e:any)=>{
  let itemindex = e.target.value
  let items =formdata.data.bidmethod;
  let item = items[itemindex];
  items.forEach(it=>{it.checked = false});
  item.checked = true
}


</script>
<template>
    <div>
        <div class="padding20">
            <div class="fontdark font17">设置出价</div>
            <div class="radio-box-wrap fontdark margintop5">              
                <div class="radio-box font12 fontbold" v-for="(item,index) in formdata.data.setbid" :key="index">
                  <label class="disflex option borderbox" @click="()=>setbidlabelclick(item,formdata.data.setbid)">
                    <span class="option-control margintop3">
                      <span class="disflex radio">
                        <input class="radio-input" type="radio" :name="item.cname" value="1" :checked="item.checked" />
                        <span 
                          :class='["disflex","radio-circle","borderbox",item.checked?"bgbasecolor3":"bgbasecolor6",item.checked?"radio-circle-after":""]'></span>
                      </span>
                    </span>
                    <span class="option-label">
                      <span class="disflex option-head borderbox">
                        <span class="option-title font12 fontnormal">
                          <div class="fontnormal font16">{{item.cname}}</div>
                          <div class="margintop5 fontB5">{{item.labelname}}</div>
                        </span>
                        <span class="option-focus font13">
                            <div class="icon iconfont icon-U font14 basecolor uiconfixed uiconbasecolor"></div>  
                        </span>
                      </span>
                    </span>
                  </label>
                </div> 
            </div>            
        </div>

        <div class="padding20">
            <div class="fontdark font17">出价类型</div>
            <div class="radio-box-wrap fontdark margintop5">              
                <div class="radio-box font12 fontbold" v-for="(items,indexs) in formdata.data.bidtype" :key="indexs">
                  <label class="disflex option borderbox" @click="()=>bidtypelabelclick(items,formdata.data.bidtype)">
                    <span class="option-control margintop3">
                      <span class="disflex radio">
                        <input class="radio-input" type="radio" :name="items.cname" value="1" :checked="items.checked" />
                        <span 
                          :class='["disflex","radio-circle","borderbox",items.checked?"bgbasecolor3":"bgbasecolor6",items.checked?"radio-circle-after":""]'></span>
                      </span>
                    </span>
                    <span class="option-label">
                      <span class="disflex option-head borderbox">
                        <span class="option-title font12 fontnormal">
                          <div class="fontnormal font16">{{items.cname}}</div>
                          <div class="margintop5 fontB5">{{items.labelname}}</div>
                        </span>
                        <span class="option-focus font13">
                            <div class="icon iconfont icon-U font14 uiconfixed uiconbasecolor basecolor"></div>  
                        </span>
                      </span>
                    </span>
                  </label>
                </div> 
            </div>            
        </div>

        <div class="padding20 paddingbottom0">
            <div class="fontdark font17 borderbox">交易方式</div>            
            <div class="select-area disflex borderbox margintop10"> 
                <div class="select-box borderbox">
                <select  @change="(e)=>clickMethod(e)" class="select-item fontdark font16 borderbox input-focus">
                    <option v-for="(it,index) in formdata.data.bidmethod" :key="it.labelvalue" :value="index" :selected="it.checked">{{it.cname}}</option>               
                </select>
                </div>
            </div>        
        </div>

        
        <div class="padding20 margintop10 paddingbottom0">
            <div class="fontdark font17">交易单价  <span class="font12 fontgrey">(我要<span  v-if="formdata.data.setbid[1].checked">卖</span><span v-else>买</span>)</span></div>
            <div class="input-wrap disflex font14 align-items-center margintop10">
                <div @click="()=>minuStepCount()" class="paddingbox fontbold bgbasecolor10">-</div>    
                <div v-if="formdata.data.bidtype[1].checked" class="paddingbox2 bgbasecolor7">￥</div>
                <div class="input-box">
                    {{formdata.data.bidprice}}
                </div>
                <div v-if="formdata.data.bidtype[0].checked" class="paddingbox2 bgbasecolor7 fontbold">%</div>

                <div @click="()=>PlusStepCount()" class="paddingbox fontbold bgbasecolor10">+</div>
            </div> 
            <div class="margintop5 fontB5 font12">
               您将以<span v-if="formdata.data.bidtype[1].checked">￥{{formdata.data.bidprice}}/usdt </span>
               <span v-if="formdata.data.bidtype[0].checked&&formdata.data.setbid[0].checked">低于</span>
               <span v-if="formdata.data.bidtype[0].checked&&formdata.data.setbid[1].checked">高于</span>
               <span v-if="formdata.data.bidtype[0].checked">市价{{formdata.data.bidprice}}%</span>价格<span v-if="formdata.data.setbid[0].checked">购买</span>
               <span v-if="formdata.data.setbid[1].checked">出售</span>
                USDT。              
               <br>
              当前市价￥{{currentInt}}/usdt<span v-if="formdata.data.bidtype[0].checked"> ，您的出价为 ￥{{youNowPrice}}。</span>
            </div>          
        </div>
        
       

       
        <div class="padding20 disflex justify-spacebetween">
            <div></div>
            <button @click="()=>stepClick()" class="vbtn basecolor bgbasecolor4 font14">下一步</button>                   
        </div>

    </div>

</template>