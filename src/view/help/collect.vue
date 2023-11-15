<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";

  import { reactive, toRefs,toRef } from "@vue/reactivity";
  import { showToast } from 'vant';

  import { ref,ComponentInternalInstance, getCurrentInstance } from "vue";
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that:any = proxy;
  const listItemData = reactive({data:[]});

  const forceUpdateKey = ref(new Date().getTime())
  const listurl = "api/trade/getCollectLists"; 
 
  const collectFlg = ref(true)
  /*页面数据 */
  const pageInfo = reactive({data:{pageSize:10,page:1}})
  
  /**下拉加载部分 */
  const loading = ref(false);
  const finished = ref(false);
  const finishedTxt = ref("下拉加载");//没有更多了
  const refreshing=ref(false);

  /**数据加载部分 */
  const getItemData =async () =>{ 
    const itemdatas = await that.$request.post({url:listurl,data:{...pageInfo.data}});    
    listItemData.data = itemdatas; 
    console.log(listItemData.data)
    return itemdatas;
  } 
  getItemData()
  const count = ref(0)
  const onLoadEvent = async() => {
      ++ pageInfo.data.page ;
      let items =  await getItemData()
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
  getItemData()
 }

</script>

<template>
  <div class="container">
    <div class="positionFixed">
      <commonHeader ftitle="收藏列表" />      
   </div>
   <div class="fixedHeight">

   </div>

    <div v-if="listItemData.data?.length > 0" :key="forceUpdateKey" class="list-area-wrap padding10">
      <van-pull-refresh disabled v-model="refreshing" @refresh="onRefresh"  class="exports">
          <van-list v-model:loading="loading"  :immediate-check="false"  :finished="finished" :finished-text="finishedTxt" @load="onLoadEvent">
              <listItem :itemData="listItemData.data" :collectFlg="collectFlg"  />       
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
.fixedHeight{height: 42px;}
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