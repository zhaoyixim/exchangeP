<script lang="ts" setup>
import { reactive } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { showDialog,showToast } from 'vant';
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that:any = proxy as object;
const kefuData = reactive({data:{}})
const initData = async() =>{
  const url = '/api/index/kefu'
  kefuData.data =await that.$request.get({url});
  console.log(kefuData.data,"kefuData.data")
}
initData()
</script>
<template>
  <div class="container vh100">
    <commonHeader ftitle="客服" /> 
    <div class="margintop10 padding30 bgwhite">
       
        <div class="fontdark font18 borderbox border-bottom ">
          客服
        </div>
        <div class="pro-body borderGrey margintop10">          
          <div class="p-wrap bgwhite  paddingbottom20">  
            <div v-for="(item,index) in kefuData.data" :key="index" class="padding20 paddingbottom0">
                <div class="fontdark font14 borderbox paddingbottom20 borderbottom">{{item.ctype2Lable}}
                  ({{item.account}})
                </div>            
                <div class="disflex padding20 bordergrey margintop30 align-items-center justify-spacecenter">
                    <div class="font12 fontdark model-title-content">
                      <img class="image-box" :src="item.photo" />
                    </div>
                </div>      
            </div>  
          </div>
        </div>                 
    </div>
  </div>
</template>
<style lang="scss" scoped>
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