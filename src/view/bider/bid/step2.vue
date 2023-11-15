<script lang="ts" setup>
import { reactive, ref } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance } from "@vue/runtime-core";
import { showDialog, showToast } from 'vant';
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that = proxy as object;
const props = defineProps({stepData:{}})
const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
userinfo.data = that.$vcache.vget("meminfo")
const stepData:any = props.stepData;
/**是否购买，true 购买 false 出售 */
const buyModel = ref(true);
const bailList = reactive({data:{}});
const restUsdt = ref(parseFloat(userinfo.data.usdt))

const freezeTotalU = ref(0)

if(stepData.setbid.find((it: any)=>it.labelvalue ===2).checked) buyModel.value = false;
/**
   * 提交数据
   */
let formdata = reactive({
      data:{
        step:2,
        ValidPeriod:40, 
        times:0,        
        baitdata:0,
        imageFiles:"",
        sellCount:10,
        bidlimit:{ lowprice:0,higherprice:6900 },   
        bidUsdtLimit:{lowprice:10,higherprice:1000}                  
      }
}) 
if(buyModel.value){
  const bailUrl = "api/bid/getbailList";
  that.$request.get({url:bailUrl}).then((res: any)=>{     
      bailList.data = res
  });
}
const rmbValue = reactive({lowprice:0,higherprice:0})
const RmbInputchange = () =>{
  let realPrice = parseFloat(stepData.realPrice) *100
  rmbValue.lowprice = realPrice*(formdata.data.bidUsdtLimit.lowprice)/100
  rmbValue.higherprice = realPrice*(formdata.data.bidUsdtLimit.higherprice)/100
  
}
RmbInputchange()

const ValidSellCountInput = () =>{
  let realPrice = parseFloat(stepData.realPrice) *100
  formdata.data.bidlimit.lowprice = (Math.floor(formdata.data.sellCount *realPrice)/100)
  let maxCount =  formdata.data.bidlimit.higherprice>formdata.data.bidlimit.lowprice?formdata.data.bidlimit.higherprice:formdata.data.bidlimit.lowprice
  if(maxCount > parseFloat(userinfo.data.usdt)){
    showToast("您账户U币不足");
    return ;
  }
  restUsdt.value = restUsdt.value - formdata.data.sellCount
  formdata.data.bidlimit.higherprice =maxCount  

  changeFreezeTotalU();
}
const clickTimes = () =>{
  formdata.data.times +=1
  let higherprice = (formdata.data.bidlimit.lowprice * formdata.data.times).toFixed(2)
  let IntHigherprice =  parseFloat(higherprice)
  let userUsdt =parseFloat(userinfo.data.usdt)
  if(IntHigherprice >=userUsdt){
    showToast("您账户U币不足");
    return ;
  }
  formdata.data.bidlimit.higherprice =IntHigherprice
  changeFreezeTotalU();
}
const inputTimes = () => {
  if(formdata.data.times  == 0){
    initData()
  }else {
    clickTimes(); 
    changeFreezeTotalU();  
  }
}
const changeFreezeTotalU= ()=>{
    freezeTotalU.value = formdata.data.times * formdata.data.sellCount
}
const initData = async () =>{
  const initUrl = "api/bid/countSetting";
  await that.$request.post({url:initUrl,data:{realPrice:stepData.realPrice}}).then((res: any)=>{     
    formdata.data = res
  });  
}
initData();
ValidSellCountInput()
const clickBailList = (event:any) => {
  formdata.data.baitdata = parseInt(event.target.value)
}
const ValidPeriodInput = () => {
  if(!buyModel) return ;
  if(formdata.data.ValidPeriod<5) formdata.data.ValidPeriod = 5;
  if(formdata.data.ValidPeriod>=60) {
    showToast("最大时限为60分钟");
    formdata.data.ValidPeriod = 60;
  }
}

const emit = defineEmits(["stepClick","stepBeforeClick"]);
/**
 *  第二步提交
 */
const stepClick = () =>{
  if(!buyModel.value){
    //卖
    if(formdata.data.imageFiles.length>0){
      showDialog({ message: '该出价您将冻结'+freezeTotalU.value+'U',title:"提示" }).then(()=>{
        emit("stepClick",formdata)
      });  
    }else{showToast('请添加收款码图')}
  }else{
    emit("stepClick",formdata)
  }  
}
const stepbeforeClick = () =>{
   emit("stepBeforeClick",formdata)
}
const beforeRead = (file: { type: string; }) =>{
  if (file.type !== 'image/jpeg' && file.type !== 'image/png'  ) {
        showToast('请上传 jpg 格式图片');
        return false;
      }
      return true;
}
const afterRead = (file:any)=>{
  /**上传后 */
  formdata.data.imageFiles = file.content
}
const imageFiles = ref([])
</script>
<template>
    <div>
        <div class="padding20">
            <div class="fontdark font17">设置交易时限 <span v-if="buyModel" class="fontB5 font14">(最大60分钟,最小5分钟)</span><span class="fontB5 font14" v-else>0表示长期有效</span> </div> 
            <div class="input-wrap disflex font12 align-items-center margintop10">
                <div class="flex">
                    <input  type="number" v-model="formdata.data.ValidPeriod" @input="()=>ValidPeriodInput()" class="borderbox font14 input-item text-input bordergrey"  />                    
                </div>
                <div class="paddingbox bgbasecolor7">分钟内有效</div>                
            </div>

            <div class="margintop10 fontB5 font12">
              订单的有效时间限制(用户触发订单后{{formdata.data.ValidPeriod}}内有效,过期自动失效)
            </div>        
        </div>

        
        <div v-if="!buyModel" class="padding20">
            <div class="fontdark font17">单次售卖<span class="fontB5 font14">(您设置的单价为:{{stepData.realPrice}}) </span> </div> 
            <div class="input-wrap disflex font12 align-items-center margintop10">
                <div class="flex">
                    <input  type="number" v-model="formdata.data.sellCount" @input="()=>ValidSellCountInput()" class="borderbox font14 input-item text-input bordergrey"  />                    
                </div>
                <div class="paddingbox bgbasecolor7">USDT</div>                
            </div>
            <div class="margintop10 warningcolor font14">              
              <span class="fontB5"> 您拥有{{userinfo.data.usdtAll}}USDT,可冻结{{userinfo.data.usdt}}</span>
              可操作{{restUsdt}}USDT
            </div> 
        </div>


        <div  v-if="!buyModel" class="padding20">
            <div class="fontdark font17">设置交易次数 <span class="fontB5 font14">(0 为不限制次数)</span></div> 
            <div class="input-wrap disflex font12 align-items-center margintop10">
               <div class="paddingbox bgbasecolor7">允许交易</div>    
                <div class="flex">
                    <input  type="number"  step="1" @input="()=>inputTimes()" v-model="formdata.data.times" class="borderbox font14 input-item text-input bordergrey"  />                    
                </div>
                <div class="paddingbox bgbasecolor7">次</div>
                <div @click="()=>clickTimes()" class="paddingbox bgbasecolor10 fontbold">+</div>              
            </div>

            <div class="margintop10 fontB5 font12">
              该需求总共可以触发<span v-if="formdata.data.times<=0">无限</span> <span v-else>{{formdata.data.times}}</span>次
            </div>  
            
            <div v-if="formdata.data.times>0" class="margintop10 basecolor font14">
               该出价需求总将冻结 {{freezeTotalU}}U
            </div>
        </div>

        <div class="padding20 fontdark margintop10">
            <div class="fontdark font17">
              <span v-if="!buyModel">交易限额</span>
              <span v-else>需求额度</span>
              <span v-if="!buyModel" class="fontB5 font14">(交易总额度限制展示-自动计算)</span>
              <span v-else class="fontB5 font14">您需要的额度范围</span>
            </div>
            <!--售卖-->
            <div v-if="!buyModel" class="input-wrap disflex font12 align-items-center margintop10">
                <div class="paddingbox2 fontbold bgbasecolor10">￥</div>               
                <div class="flex">
                    <input  type="number"  disabled class="borderbox font14 input-item text-input" v-model="formdata.data.bidlimit.lowprice" />                    
                </div>
                <div class="paddingbox2 bgbasecolor7 fontbold">最低</div>                
            </div>  
            
            <div v-if="!buyModel" class="input-wrap disflex font12 align-items-center margintop10">
                <div class="paddingbox2 fontbold bgbasecolor10">￥</div>               
                <div class="flex">
                    <input  type="number"  class="borderbox font14 input-item text-input" v-model="formdata.data.bidlimit.higherprice" />                    
                </div>
                <div class="paddingbox2 bgbasecolor7 fontbold">最高</div>                
            </div>
            <!--售卖end-->
            <!--购买-->
            <div v-if="buyModel" class="input-wrap disflex font12 align-items-center margintop10">
                <div class="paddingbox2 fontbold bgbasecolor10">￥</div>               
                <div class="flex">
                    <input  type="number" min="10" @input="()=>RmbInputchange()"  class="borderbox font14 input-item text-input" v-model="formdata.data.bidUsdtLimit.lowprice" />                    
                </div>
                <div class="paddingbox2 bgbasecolor7 fontbold">最低</div>                
            </div>  
            <div v-if="buyModel" class="margintop10 fontB5 font12">
               您将最低获得多少<span class="fontsuccess">￥{{rmbValue.lowprice}}</span>
            </div>
            <div v-if="buyModel" class="input-wrap disflex font12 align-items-center margintop10">
                <div class="paddingbox2 fontbold bgbasecolor10">￥</div>               
                <div class="flex">
                    <input  type="number"  min="10" @input="()=>RmbInputchange()"  class="borderbox font14 input-item text-input" v-model="formdata.data.bidUsdtLimit.higherprice" />                    
                </div>
                <div class="paddingbox2 bgbasecolor7 fontbold">最高</div>                
            </div>
            <div v-if="buyModel" class="margintop10 fontB5 font12">
               您将最高获得多少<span class="fontsuccess">￥{{rmbValue.higherprice}}</span>
            </div>
            <!--购买end-->

            <div v-if="!buyModel" class="margintop10 fontB5 font12">
               根据单次售卖额度以及总交易次数自动计算而出
            </div>
            <div v-if="buyModel" class="margintop10 fontB5 font12">
               您的设置的购买单价为 <span class="fontsuccess">￥{{stepData.realPrice}}/U</span>
            </div>
        </div>

        <div v-if="!buyModel" class="padding20">
            <div class="fontdark font17">该出价将冻结U币数额</div> 
            <div class="input-wrap disflex font12 align-items-center margintop10">
               <div class="paddingbox bgbasecolor7">该出价将冻结(自动计算)</div>    
                <div class="flex">
                    <input  type="number" disabled v-model="freezeTotalU" class="borderbox font14 input-item text-input bordergrey"  />                    
                </div>
                <div class="paddingbox bgbasecolor7">USDT</div>
            </div>

            <div class="margintop10 fontB5 font12">
              该交易将冻结最大限制额度以供用户直接购买，
            </div>        
        </div>


        <div v-if="buyModel" class="padding20 fontdark margintop10">
            <div class="fontdark font17">要求保证金<span class="fontB5 font14">(要求商家缴纳最低保证金数额)</span></div>
            <template v-if="bailList.data?.length<=0">
              <div  class="input-wrap disflex font12 align-items-center margintop10">
                  <div class="paddingbox bgbasecolor7 fontbold">最低要求缴纳</div>                
                  <div class="flex">
                      <input  type="number"  class="borderbox font14 input-item text-input bordergrey" v-model="formdata.data.baitdata" />                    
                  </div>
                  <div class="paddingbox fontbold bgbasecolor7">USDT</div>           
              </div> 
            </template>
            <div class="input-wrap disflex font12 align-items-center margintop10">
              <div class="select-area disflex borderbox margintop10"> 
                  <div class="select-box borderbox">
                  <select  @change="(e)=>clickBailList(e)" class="select-item fontdark font16 borderbox input-focus">
                      <option v-for="(it,index) in bailList.data" :key="it.labelvalue" :value="index" :selected="it.checked">{{it.labelvalue}}</option>               
                  </select>
                  </div>
              </div>        
            </div>
            <div class="margintop10 fontB5 font12">
               要求保证金在该范围内的商家接单
            </div>
        </div>


        <div v-if="!buyModel" class="padding20">
            <div class="fontdark font17"  >上传收款二维码 </div> 
            <div class="input-wrap disflex font12 align-items-center margintop10">
              <van-uploader v-model="imageFiles"  :after-read="afterRead" :max-count="1" :show-upload="true"	 :deletable="true" :before-read="beforeRead"/>        
            </div>

            <div class="margintop10 fontB5 font12">
               购买用户将在此处进行付款
            </div>        
        </div>




        <div class="padding20 disflex justify-spacebetween paddingbottom100">
            <button @click="()=>stepbeforeClick()" class="vbtn basecolor bgbasecolor4 font14">上一步</button>              
            <button @click="()=>stepClick()" class="vbtn basecolor bgbasecolor4 font14">下一步</button>                   
        </div>


    </div>

</template>