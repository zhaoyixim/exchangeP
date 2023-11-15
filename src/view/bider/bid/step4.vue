<script lang="ts" setup>
import { reactive, ref } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance } from "@vue/runtime-core";
import { showDialog, showToast } from 'vant';
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that = proxy as object;
const props = defineProps({stepData:{},})
/**是否购买，true 购买 false 出售 */
const buyModel = ref(true);
const bailList = reactive({data:{}});
if(props.stepData?.setbid?.find((it: any)=>it.labelvalue ===2).checked) buyModel.value = false;
/**
   * 提交数据
   */
let formdata = reactive({data:{}}) 

const bailUrl = "api/bid/getStep4Data";
that.$request.post({url:bailUrl,data:{buyModel:buyModel.value}}).then((res: never[])=>{     
  formdata.data = res
});


const emit = defineEmits(["stepClick","stepBeforeClick"]);
/**
 *  第四步提交
 */
const btnDisabled = ref(false)
const stepClick = () =>{
  btnDisabled.value = true
   emit("stepClick",formdata)
}
const stepbeforeClick = () =>{
   emit("stepBeforeClick",formdata)
}
const clickSpanTitle = (item) => {
  item.checked = !item.checked
}
</script>
<template>
    <div>
        <div class="padding20">
            <div class="fontdark font17">设置交易标题 <span class="fontB5 font14">(标题将在16字数左右)</span></div> 
            <div class="input-wrap disflex font12 align-items-center margintop10">
              <div class="paddingbox2 bgbasecolor7">交易标题：</div>   
                <div class="flex">
                    <input  type="text" v-model="formdata.data.title"  class="borderbox font14 input-item text-input bordergrey"  />                    
                </div>                            
            </div>    
        </div>

        <div class="padding20">
            <div class="fontdark font17">请选择出价标题 <span class="fontB5 font14">(最多只能选择3个)</span></div> 
           
           <div class="margintop20 disflex font12">
             <span v-for="(item,index) in formdata.data.priceTitle" :key="index"
              @click="()=>clickSpanTitle(item)"
             :class='["label-inline",item.checked?"label-success":"label-light"]' >{{item.cname}}</span>
           </div>
        </div>      

        <div class="padding20 fontdark margintop10">
            <div class="fontdark font17">交易说明</div>
           
            <div class="margintop20">
              <van-cell-group inset>
                <van-field
                  v-model="formdata.data.despcontent"
                  rows="2"
                  autosize                  
                  type="textarea"
                  maxlength="200"
                  placeholder="请输入说明文字"
                  show-word-limit
                />
              </van-cell-group>
            </div>           
            <div class="margintop10 fontB5 font12">               
            </div>
        </div>
        <div class="padding20 disflex justify-spacebetween paddingbottom100">
            <button @click="()=>stepbeforeClick()" :disabled="btnDisabled"  class="vbtn basecolor bgbasecolor4 font14">上一步</button>              
            <button @click="()=>stepClick()" :disabled="btnDisabled" class="vbtn basecolor bgbasecolor4 font14">提交</button>                   
        </div>
    </div>
</template>
<style lang="scss" scoped>
.van-cell-group--inset{border: 1px #E4E6EF solid !important;}
</style>