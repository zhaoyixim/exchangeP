<script setup lang="ts">
import { ref,reactive,watchEffect } from 'vue'
import { useRouter } from 'vue-router';
let router = useRouter()

let vdialogdata = defineProps({
  show: {
    type:Boolean,
    default:false,
  },
  content: {
    type: String,
    default: "",
  }
});
let vdialogRef = reactive({content:{},show:false})
watchEffect(()=>{  
    vdialogRef.content = vdialogdata.content
    vdialogRef.show = vdialogdata.show
})
const clickOverLay = ()=>{
    vdialogRef.show = !vdialogRef.show
}

</script>

<template>
 <div>
    <van-overlay :show="vdialogRef.show" @click="()=>clickOverLay()">
    <div class="vdialog-wrap fontdark" @click.stop>
        <div class="vdialog-box borderbox font16  bgwhite borderradius10">
            <div class="vdialog-title paddingbox disflex justify-spacebetween  ">
                <div>充币订单</div>
                <div @click="()=>clickOverLay()" class="closeiconfixed icon iconfont icon-guanbi font14"></div>
            </div>
            <div class="vdialog-body font13">     
                <div v-html="vdialogRef.content"></div>
            </div>

            <div class="vdialog-footer paddingbox disflex justify-spacebetween font12">
                <div></div>
                <div @click="()=>clickOverLay()" class="vbtn-normal vbtn-light">关闭</div>
            </div>
        </div>   
    </div>
    </van-overlay>
 </div>
</template>

<style lang="scss" scoped>
.vdialog-wrap{
    .closeiconfixed{margin-top: 5px;}
    position: relative;padding: 10px;
    .vdialog-box{
        .paddingbox{padding: 18px 21px;}

        .vdialog-title{border-bottom: 1px solid #EBEDF3;}
        .vdialog-body{ padding: 21px; line-height: 24px;}
        .vdialog-footer{border-top: 1px solid #EBEDF3;}
    }
}
</style>
