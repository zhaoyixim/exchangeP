<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import bidItem from "@/components/lists/bidItem.vue";
  
  import { reactive, toRefs,toRef } from "@vue/reactivity";
  import { showToast } from 'vant';

  import { ref,ComponentInternalInstance, getCurrentInstance } from "vue";
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that:any = proxy;
  const listItemData = reactive({data:[]});
  const needFlg = ref(true)
  const tapItem = reactive({data:[
    {cname:"未完成",checked:true,labelvalue:1},
    {cname:"已完成",checked:false,labelvalue:2},
  ]})
  const forceUpdateKey = ref(new Date().getTime())
  const listurl = "api/trade/getNeedLists";  
  const clickItemIndex = ref(1);

  /*页面数据 */
  const pageInfo = reactive({data:{pageSize:10,page:1}})
  /**listType : 0 ->所有 1-> 购买 2->售出 */
  const itemDataFunc = async (items:any) => {
    pageInfo.data.page=1
    tapItem.data.forEach(item=>item.checked = false);
    items.checked = true
    listItemData.data =await getItemData(items.labelvalue)
    /**强制更新 */
    forceUpdateKey.value +=1 
  }
  /**下拉加载部分 */
  const loading = ref(false);
  const finished = ref(false);
  const finishedTxt = ref("下拉加载");//没有更多了
  const refreshing=ref(false);

  /**数据加载部分 */
  const getItemData =async (_Val:number,init:boolean=false) =>{ 
    clickItemIndex.value = _Val    
    const itemdatas = await that.$request.post({url:listurl,data:{listType:_Val,...pageInfo.data}});
    if(init) listItemData.data = itemdatas;
    else
      return itemdatas;
  } 
  getItemData(1,true)
  const count = ref(0)
  const onLoadEvent = async() => {
      ++ pageInfo.data.page ;
      let items =  await getItemData(clickItemIndex.value)
      if( items.length> 0 && pageInfo.data.pageSize>items.length){
        listItemData.data.push(...items)
        loading.value = false;
      //finished.value= true;
       console.log("下拉",count.value ,"次")
      }else{
        finished.value= true;
        finishedTxt.value = "没有更多了"
      }      
  };

  /**下拉部分 */
 const onRefresh = () => {
  pageInfo.data.page=1
  finished.value = false
  loading.value = false;
  getItemData(clickItemIndex.value,true)
 }

</script>

<template>
  <div class="container">
    <div class="positionFixed">
      <commonHeader ftitle="需求订单" />
      <div class="disflex tap-box bgwhite">
        <div class="disflex tap-center fontgrey font14">
          <div v-for="(it,index) in tapItem.data" :key="index" @click="()=>itemDataFunc(it)" 
            :class='["tans-item",it.checked?"item-active":""]'>{{it.cname}}</div>
        </div>
      </div>
   </div>
   <div class="fixedHeight">
    
   </div>
    <div class="margintop10 fontB5 font14 text-center">右划操作</div>
    <div v-if="listItemData.data?.length > 0" :key="forceUpdateKey" class="list-area-wrap padding10 paddingtop0">
      <van-pull-refresh disabled v-model="refreshing" @refresh="onRefresh"  class="exports">
          <van-list v-model:loading="loading"  :immediate-check="false"  :finished="finished" :finished-text="finishedTxt" @load="onLoadEvent">
              <bidItem :itemData="listItemData.data" :needFlg="needFlg"/>       
          </van-list> 
      </van-pull-refresh>   
    </div>
    <div v-else>
      <div class="no-order fontgrey">暂无市场需求</div>     
    </div>
    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss" scoped>
.positionFixed{position: fixed;top: 0;width: 100%;}
.fixedHeight{height: 90px;}
.container{height: 100vh; overflow: hidden;}
.list-area-wrap{ height: 83vh;overflow-y: scroll;}
.exports{min-height: 84vh;}
//.van-pull-refresh {min-height: 79vh;}
//.van-pull-refresh__track{min-height: 79vh;}
.tap-box{ align-items: center; justify-content: center; box-sizing: border-box; width: 100%; }
.tap-center{ width: 60%; justify-content: space-between;
  .tans-item{border: 1px transparent solid;width: 100px; padding: 12px 0; text-align: center; }
  .item-active{border-bottom: 2px #8950FC solid;}

}
.no-order{margin-top: 150px; width: 100%; text-align: center; }
</style>