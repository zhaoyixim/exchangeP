<script lang="ts" setup>
import { reactive } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance, ref } from "vue";
import { useRouter } from "vue-router";
import { showDialog,showToast } from 'vant';
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that:any = proxy as object;
const userinfo:any = reactive({data:{}});
userinfo.data = that.$vcache.vget("meminfo")
const modelShow = ref(false)
const modelValue = ref(500)
/**冻结模式 */
const freezeModel = ref(true)
const freezeBtn = (item:number)=>{
  if(item == 1 ) {
    modelValue.value = 500
    freezeModel.value = true
  }
  if(item == 2 ) {
    modelValue.value = userinfo.data.freezeBail
    freezeModel.value = false
  }
  modelShow.value = !modelShow.value
}

const submitBtn = async() =>{
  const url = '/api/member/freezeU'
  let sendData = {
    count:modelValue.value,
    freezeModel:freezeModel.value
  }
  let returnJson = await that.$request.post({url,data:sendData})  
  if(returnJson){ 
    showToast('冻结成功')
    if(freezeModel.value){
      showToast('冻结成功')
    }else{
      showToast('解冻成功')
    }   
    setTimeout(()=>{that.$commonFunc.updatememinfo();router.push({path:"/"})},500)
    

  }
}
</script>
<template>
  <div class="container vh100">
    <commonHeader ftitle="交易保障" /> 
    <div class="margintop10 padding30 bgwhite">
       
        <div class="fontdark font17 borderbox border-bottom ">
                交易保障
        </div>
        <div class="pro-body borderGrey margintop10">
            <div class="pro-content">
              <div class="text-align icon iconfont icon-jiaoyibaozhangxian font88 basecolor"></div>
            </div>
            <div class="pro-bottom padding20 paddingtop0">
              <div class="font18 fontbold basecolor">保证金</div>
              <div class="fontdark font12 margintop5">
                部分购买交易需要您冻结一定的保证金作为交易前提，更好的保障账户信誉，
                约束交易双方规范交易流程。您可以将您的账户余额部分冻结作为保证金，冻结成功方可进行出价和购买交易
              </div>
              <div class="font12 margintop5">
                <br>
                可使用额度：<b class="basecolor">{{userinfo.data.usdt}} USDT</b>
                <br> 
                冻结进账额度(进行中的进账额度)：<b class="basecolor">{{userinfo.data.freezeUsdt}} USDT</b>
                <br>
                冻结出账额度(进行中的出账额度)：<b class="basecolor">{{userinfo.data.freezeOutUsdt}} USDT</b>
                <br>
                进行中的订单数：<b class="basecolor">{{userinfo.data.unfinishednum}} USDT</b>    
                <br>
                保证金:<b class="basecolor">{{userinfo.data.freezeBail}} USDT</b>                
              </div>
            </div>

            <div class="margintop5 disflex vbtn-fiexd">
              <button @click="()=>freezeBtn(1)" class="vbtn basecolor bgbasecolor4 font12 marginright20">我要冻结</button>  
              <button  @click="()=>freezeBtn(2)"  class="vbtn fontbasecolor bgbasecolor3 font12">我要解冻</button>                   
             </div>
        </div>
            <div class="">
              <van-popup v-model:show="modelShow" 
               :closeable=true :style="{ padding: '10px' , width:'100%',borderRadius:'8px'}">
                <div class="borderradius10 borderbox model-boxWrap">
                    <div class="model-title borderbottom fontdark font16">
                      我要 <span v-if="freezeModel"> 冻结</span> <span v-else>解冻</span>
                    </div>                    
                    <div  class="form-box margin20">
                      <div class="input-wrap disflex font12 align-items-center margintop10 input-box disflex">
                          <input  type="text" v-model="modelValue" 
                          class="borderbox  font14 input-item-fixed text-input"  />   
                          <div class="paddingbox bgbasecolor7">USDT</div>         
                      </div>             
                      <div class=" disflex justify-spacebetween">
                        <div></div>
                        <button @click="submitBtn" class="margintop20 vbtn fontbasecolor bgbasecolor3 font12">提交</button>                   
                      </div>                      
                    </div>      
                </div>
              </van-popup>
            </div>

    </div>
  </div>
</template>
<style lang="scss" scoped>
.van-popup--center{width: 100% !important;}
.pro-bottom{line-height: 1.8;}
.borderGrey{border: 2px #EBEDF3  solid; border-radius: 6px; }
.pro-content{padding: 100px;}
.vbtn-fiexd{
   padding-bottom: 20px;
   margin-left: 20px;
  }
  .marginright20{margin-right: 20px;}
  .no-content{padding: 88px 0;}
</style>