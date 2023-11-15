<script setup lang="ts">
import { reactive, } from 'vue'
import { useRouter } from 'vue-router';
import footerItem from "./footerItem.vue";

let getactivenum = defineProps<{ factive: string | '0' }>();

let refactivenum = parseInt(getactivenum.factive)
let footlist = reactive({
  list:[
    {fname:"首页",flink:"/index",factive:false,iconlabel:"icon-home1"},
    {fname:"交易",flink:"/transaction",factive:false,iconlabel:"icon-bibijiaoyi"},   
    {fname:"我的",flink:"/profile",factive:false,iconlabel: "icon-wode1"},
    {fname:"消息",flink:"/notice",factive:false,iconlabel:"icon-xiaoxi"},
  ]
  });
  footlist.list.forEach((item,index)=>{
    if(refactivenum == index) item.factive = true
    else item.factive = false
  })
</script>

<template>

 <footerItem />
  <div class="footer-wrap bgbasecolor2 fontbasecolor">
    <div v-for="(item,index) in footlist.list" :key="index" class="font16 footer-body">
      <router-link :to="item.flink">
        <div class="footerItem">
            <div :class="{'factive':item.factive }">
              <div :class="[ 'icon','iconfont','font18',item.iconlabel]"></div>
            </div>
          <div :class="['font14',item.factive?'basecolor':'' ]"> {{item.fname}} </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">

.footer-wrap{ width: 100%;  position:fixed;z-index: 100; bottom:0;  display:flex; flex-direction: row; align-items: center;  justify-content: center; height: 50px;
  .footer-body{ text-align: center; width: 100%; display: flex;justify-content:center;}
  .footerItem{margin-bottom: 4px;}
  .factive{color:#8457e2;}
}
</style>
