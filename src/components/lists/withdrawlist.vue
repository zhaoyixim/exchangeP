<script setup lang="ts">
import { ref,toRefs,onMounted,watchEffect,reactive} from 'vue'
import { useRouter } from 'vue-router';
import orderDialog from "@/components/vdialog/orderDialog.vue";

let router = useRouter()
const datalists = defineProps({
  lists: {
    type: Array,
    default: () => [],
  }
});
let recordList = reactive({})
watchEffect(()=>{  
  recordList = datalists.lists 
})
const tohref = (item)=>{
  //  router.push("/recorddetail")
}
console.log(recordList)

/**dialog 数据 */
let vdialogcontroll = reactive({content:"",show:false});
/**详情 */
const detailDialog = (items: {
nums: string; orderTitle: string; _id: string; netTypeLabel: string; address: string; orderStsLabel: string; ctime: string; 
})=>{

  vdialogcontroll.show = true
  let netTypeLabel = items.netTypeLabel == "TRC20"?"label-danger" :"label-info";
  let stsLabel = "";
  let orderTips = "E0:暂无区块数据，稍后验证";
  if(items.orderSts ==12){stsLabel = "label-light-success"; orderTips = "验证完成";
  }else if(items.orderSts ==11){stsLabel = "label-light-info";  
  }else if(items.orderSts ==11){stsLabel = "label-light-warning";
  }else if(items.orderSts ==13){stsLabel = "label-light-danger";
  }else if(items.orderSts ==13){stsLabel = "label-light-danger";}

  vdialogcontroll.content = "订单标题："+items.orderTitle+
                "<br>订单编号："+ items._id+
                "<br>充币数量：<b>"+items.nums+" USDT</b>"+
                "<br>充值网络："+
                "<span class=\" "+netTypeLabel+" label-inline step-btn-padding step-btn-fixed\">" +items.netTypeLabel +"</span>"+
                "<br>充值地址："+ items.address +
                "<br>订单状态："+
                "<span class=\"vbtn-noborder label-inline " +stsLabel+" step-btn-padding\" >" + items.orderStsLabel +" </span>"+
                "<br>创建时间："+ items.ctime+ "<br>订单备注："+orderTips;
}

</script>

<template>  
  <div>    
  <orderDialog :show="vdialogcontroll.show" :content="vdialogcontroll.content" />
  <div class="list-box margintop10 bgwhite bordertop" v-for="(item,index) in recordList" :key="index" @click="()=>detailDialog(item)">
        <div class="left-area record-lineheight">
              <div class="title-box-wrap">
                <div class="title-box width260 fontdark font14 lineellipsis">                   
                    <span :class='[item.netTypeLabel == "TRC20"?"label-danger":"label-info","font12","step-btn-padding","label-inline","fontnormal"]'>
                      {{item.netTypeLabel }}
                    </span>
                   {{item.orderTitle}}
                </div>
              </div>
              <div  class="limit-wrap limit-words font666 font13 width260 lineellipsis">
                <div>编号：{{item._id}}</div>
                <div>数量：<b><b class="fontdanger font13">+{{item.nums}}</b> USDT</b></div>
                <div>状态：<span class="step-btn-padding record-label label-light-info label-inline">{{item.orderStsLabel}}</span></div>
                <div>日期：{{item.ctime}}</div>
            </div>
          </div>
          <div class="right-area">
            <div class="list-btn-box paddingright0">             
              <div class="font14">
                详情 <span class="icon font14 iconfont icon-jiantouyou basecolor"></span>
              </div>
            </div>            
          </div>
    </div>
  </div>
</template>

<style scoped>
.step-btn-padding{padding: 1.8px 9px;line-height: 12px; }
.record-lineheight{line-height: 22px;}
</style>
