<script setup lang="ts">
import { ref,reactive,watchEffect,onMounted  } from 'vue'
import { useRouter } from 'vue-router';
let router = useRouter()

/**回调 */

const emitCall = defineEmits([ "confirmCall","cancelCall" ]);
const confirmCallLay = () => {  
    emitCall('confirmCall');
    clickOverLay();
}
const cancelBtnLay = () => {   
   // console.log("adsfadsf")
    emitCall('cancelCall');
    clickOverLay();
}
onMounted(() => {
    /*confirmCallLay();cancelBtnLay();*/
});
/**
 * modelType
 * 1---waring
 * 2---success
 * 3---wrong
 */
let vdialogdata = defineProps({
  modelType:{
    type:String || Number,
    default:1,      
  },
  show: {
    type:Boolean,
    default:false,
  }, 
  title:{
    type:String,
    default:"",
  },
  content:{
    type:String,
    default:"",
  },
});
let vdialogRef = reactive({content:"",show:false,modelType:1,title:"",})
watchEffect(()=>{  
    vdialogRef.title = vdialogdata.title
    vdialogRef.content = vdialogdata.content
    vdialogRef.show = vdialogdata.show
    vdialogRef.modelType = parseInt(vdialogdata.modelType)    
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
            <div class="vdialog-title text-center">
                <div :class='["icon","iconfont","font65",
                vdialogRef.modelType===1?"warningcolor":"",
                vdialogRef.modelType===1?"icon-iconfontgantanhao3":"",
                vdialogRef.modelType===2?"rightcolor":"",
                vdialogRef.modelType===2?"icon-duigoudaibiankuang":"",
                vdialogRef.modelType===3?"fontdanger":"",
                vdialogRef.modelType===3?"icon-cuowu1":"",
                ]'></div>               
            </div>
            <div class="vdialog-body text-center">                
                <div v-if="vdialogRef.title" class="font16" v-text="vdialogRef.title"></div>
                <div v-if="vdialogRef.content" class="font14 margintop20" v-text="vdialogRef.content"></div>
            </div>
            <div class="vdialog-footer disflex justify-spacebetween font12 margintop20">
                <template v-if="vdialogRef.modelType===1">
                    <div class="vdbtn borderradius4 fontbasecolor bgbasecolor9 " @click="()=>cancelBtnLay()">不，我再想想</div>
                    <div class="vdbtn borderradius4 fontbasecolor bgbasecolor3" @click="()=>confirmCallLay()">是的，取消</div>
                </template>
                <div v-if="vdialogRef.modelType===2" class="text-center vdbtn-box">
                    <div class="vdbtn borderradius4 fontbasecolor bgbasecolor3  " @click="()=>confirmCallLay()">ok</div>
                </div>
                <div v-if="vdialogRef.modelType===3" class="text-center vdbtn-box">
                    <div class="vdbtn borderradius4 fontbasecolor bgbasecolor5 " @click="()=>confirmCallLay()">ok</div>
                </div>
               
            </div>
        </div>   
    </div>
    </van-overlay>
 </div>
</template>

<style lang="scss" scoped>
.vdialog-wrap{position: relative;padding: 10px; margin-top: 50%;
    .closeiconfixed{margin-top: 5px;}    
    .vdialog-box{padding-bottom: 45px;
        .vdbtn-box{margin: auto;}
        .paddingbox{padding: 18px 21px;}
        .vdialog-title{padding-top: 45px;}
        .vdialog-body{ padding-top: 25px;}
        .vdialog-footer{padding: 0 66px;
            .vdbtn{padding: 8px 28px;}
        }
    }
}
</style>
