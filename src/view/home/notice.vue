<script setup lang="ts">
import commonFooter from "@/components/common/commonFooter.vue";
import commonHeader from "@/components/common/commonHeader.vue";
import { showToast } from "vant";
import { ref,ComponentInternalInstance, getCurrentInstance, reactive } from "vue";
import { useRouter } from "vue-router";
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that:any = proxy;
let router = useRouter();
const userinfo:any = reactive({data:{}});userinfo.data = that.$vcache.vget("meminfo");

if(!userinfo.data._id){ showToast('未登录'); router.push({path:"/login"});}

const forceUpdateKey = ref(new Date().getTime())
const tapItem = reactive({data:[
    {cname:"未读",checked:true,labelvalue:1},
    {cname:"已读",checked:false,labelvalue:2},
]})
const pageInfo = reactive({data:{pageSize:10,page:1}})

const messages:any = reactive({data:[]})
let listSourceData=reactive({data:[]});


const itemDataFunc = async (items:any) => {
    pageInfo.data.page=1  
    tapItem.data.forEach(item=>item.checked = false);
    items.checked = true
    //listItemData.data =await getItemData(items.labelvalue)
    /**强制更新 */
    forceUpdateKey.value +=1 
    let tapData = [],arrays:any =[];
    if(items.labelvalue == 1){
       tapData = listSourceData.data.filter((res:any)=>{if(res.isRead ==1) return res;})
    }
    if(items.labelvalue == 2 ){
       tapData = listSourceData.data.filter((res:any)=>{if(res.isRead ==2) return res;})       
    }
    tapData.map((res: any)=>{arrays[res.fromTradeId] = res; });
    messages.data = {...arrays} 
}

const getListFunc = async() =>{
  const listUrl = "api/vchat/getMessageList"
  listSourceData.data =await that.$request.post({url:listUrl,data:{userId:userinfo.data._id,}})
  let arrays:any = []
  listSourceData.data.map((res: any)=>{arrays[res.fromTradeId] = res; });
  itemDataFunc(tapItem.data.find(it=>it.checked))
}
getListFunc();
const clickItem = (items:any) =>{
  let queryParams ={
    userId:items.userId,
    touserId:items.touserId,
    fromBidId:items.fromBidId,
    fromTradeId:items.fromTradeId
  }
  if(userinfo.data._id != items.userId){
    queryParams.userId = items.touserId;
    queryParams.touserId = items.userId;
  }
  router.push({name:"vchat",query:queryParams})
}
</script>

<template>
  <div class="container ">
    <commonHeader ftitle="新消息" />
    <div class="disflex tap-box bgwhite">
        <div class="disflex tap-center fontgrey font14">
          <div v-for="(it,index) in tapItem.data" :key="index" @click="()=>itemDataFunc(it)" 
            :class='["tans-item",it.checked?"item-active":""]'>{{it.cname}}</div>
        </div>
    </div>

    <div v-if="listSourceData.data.length>0" class="news-box bgwhite">
      <div class="news-content font12 fontdark">
        <div v-for="(item,index) in messages.data" :key="index"
          @click="()=>clickItem(item)"
        class="new-box disflex lign-items-center borderbox bordergrey borderradius4">
          <div class="new-left disflex align-items-center justify-spacecenter">
            <div :class='["font18","fontdot",item.isRead?"dot-active":"dot-unactive"]'></div>
          </div>
          <div class="new-content fontgrey font14">
            <span v-if="item.ctype == 2">图片</span>
            <span v-if="item.ctype == 3">视频</span>
            <span v-else>{{item.content}}</span>            
          </div>
        </div>
      </div>      
    </div>
    <div v-else class="no-order fontgrey">暂无消息</div>
    <commonFooter factive='3' />
  </div>
</template>
<style lang="scss" scoped>
.container{height: 100vh;}

.tap-box{ align-items: center; justify-content: center; box-sizing: border-box; width: 100%; }
.tap-center{ width: 60%; justify-content: space-between;
  .tans-item{border: 1px transparent solid;width: 100px; padding: 12px 0; text-align: center; }
  .item-active{border-bottom: 2px #8950FC solid;}

}
.news-box{  padding:5px;  margin: 10px 0;}
.new-box{padding:10px;}
.new-left{
 padding: 5px 10px;width: 24px;
}
.new-content{flex: 1; overflow: hidden;  padding: 10px 10px 10px 20px; border-left: 1px #E4E6EF solid;}

</style>