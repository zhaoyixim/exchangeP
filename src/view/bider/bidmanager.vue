<script lang="ts" setup>
import { reactive } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance, ref } from "vue";
import { useRouter } from "vue-router";
import { showDialog,showToast } from 'vant';
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that = proxy as object;
const listItemData = reactive({data:[]});
const forceUpdateKey = ref(new Date().getTime())

const tapItem = reactive({data:[
    {cname:"所有出价",checked:true,labelvalue:1},
    {cname:"进行中的出价",checked:false,labelvalue:2},
  ]})
 /**listType : 0 ->所有 1-> 购买 2->售出 */
 const itemDataFunc = async (items:any) => {
    //pageInfo.data.page=1
    tapItem.data.forEach(item=>item.checked = false);
    items.checked = true
   // listItemData.data =await getItemData(items.labelvalue)
    /**强制更新 */
    forceUpdateKey.value +=1 
  }

const initData = async() =>{
  const bidUrl = "api/bid/getbidlists"
  listItemData.data = await that.$request.get({url:bidUrl})
}
initData()
</script>
<template>
  <div class="container vh100">
    <commonHeader ftitle="出价管理" />
    <div class="disflex tap-box bgwhite">
        <div class="disflex tap-center fontgrey font14">
          <div v-for="(it,index) in tapItem.data" :key="index" @click="()=>itemDataFunc(it)" 
            :class='["tans-item",it.checked?"item-active":""]'>{{it.cname}}</div>
        </div>
    </div>
    
    <div class="margintop10 fontB5 font14 text-center">右划操作</div>
      <!--list-->
      <div v-if="listItemData.data?.length > 0" class="list-area-wrap">
        <bidItem :itemData="listItemData.data"/>
      </div>
      <!--list end-->
      <div v-else class="borderbox no-content fontgrey">暂无相关数据 </div>
  </div>
</template>
<style lang="scss">
.tap-box{ align-items: center; justify-content: center; box-sizing: border-box; width: 100%; }
.tap-center{ width: 60%; justify-content: space-between;
  .tans-item{border: 1px transparent solid;width: 100px; padding: 12px 0; text-align: center; }
  .item-active{border-bottom: 2px #8950FC solid;}
}
.no-content{padding-top: 150px ;}
</style>