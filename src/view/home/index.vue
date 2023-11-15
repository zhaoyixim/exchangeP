<script lang="ts">
export default {
  name:"homeIndex"
}
</script>
<script setup lang="ts">
import commonFooter from "@/components/common/commonFooter.vue";
import listItem from "@/components/lists/listItem.vue";
import { reactive, toRefs,toRef } from "@vue/reactivity";
import { ref,ComponentInternalInstance, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that:any = proxy;
const router = useRouter()
const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
userinfo.data = that.$vcache.vget("meminfo")
that.$commonFunc.updatememinfo()
/**控制轮播图显示*/
const showbarTap = ref<boolean | true>()
showbarTap.value = true
const swiperLists = reactive({data:[]});
const configLists = reactive({data:[]});
const listItemData = reactive({data:[]});
const swiperurl = "api/index/swiper";


const initPage = async() =>{
  that.$request.get({url:swiperurl}).then((res: never[])=>{
  swiperLists.data  = res
  });
  const configurl = "api/index/configs";
  that.$request.get({url:configurl}).then((res: never[])=>{
    configLists.data  = res
  });
  /*页面数据 */
  const pageInfo = reactive({data:{pageSize:10,page:1}})
  const listurl = "api/index/lists";
  that.$request.post({url:listurl,data:{listType:0,...pageInfo.data,userId:userinfo.data._id}}).then((res: never[])=>{
    listItemData.data  = res
  });

 
  
 
}

initPage()


const toSearch = () => {
  router.push({path:'/transaction'})
}
const toList=(item:number)=>{
  router.push({name:'transaction',query:{ctype:item}})
}

defineExpose({showbarTap});
</script>

<template>
  <div class="container">
    <div class="showbar-wrap bgbasecolor3" v-if="showbarTap"> 
      <div class="showbar">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <template v-for="(item,index) in swiperLists.data" :key="index">
            <van-swipe-item>
              <img :src="item.imgurl" class="image-box" />
            </van-swipe-item>
          </template>
        </van-swipe>      
      </div>
    </div>
    <div class="main-body-box">
      <div class="search-box-wrap margintop10">
        <div class="btn-wrap">
            <div @click="()=>toList(1)" class="vbtn bgbasecolor3 fontbasecolor uicon">
              <div class="icon iconfont icon-U font14 uiconfixed uiconwhite"></div>  
              <div>购买USDT</div>
            </div>

            <div  @click="()=>toList(2)" class="vbtn bgbasecolor4 basecolor uicon">
              <div class="icon iconfont icon-U font14 uiconfixed uiconbasecolor"></div>  
              <div>出售USDT</div>
            </div>
        </div>
        <div class="search-box-body margintop10 bgwhite">
          <div  v-if="false"  class="select-area disflex "> 
            <div class="select-box">
               <select class="select-item font16">
                <option v-for="(it,index) in configLists.data.tags" :key="index"  :selected="it.selected">{{it.cname}}</option>               
               </select>
            </div>
            <div class="select-box">
               <select class="select-item font16">
                <option v-for="(its,index) in configLists.data.paytags" :key="index"  :selected="its.selected">{{its.cname}}</option>               
               </select>
            </div>
          </div>
          <div class="search-input-area margintop10">
            <input type="number" class="search-input" placeholder="交易金额" />
          </div>
          <div class="search-btn-area margintop10">
           <button @click="()=>toSearch()" class="search-btn-box basecolor font16">搜索优惠</button>
          </div>

        </div>
      </div>

      
      <!--list-->
      <div v-if="listItemData.data?.length > 0" class="list-area-wrap">
        <listItem :itemData="listItemData.data"/>
      </div>
      <!--list end-->
    </div>
    <commonFooter factive='0' />
  </div>
</template>
<style lang="scss">


  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    height: 156px;
    line-height: 160px;
    text-align: center;
   
  }


  .showbar-wrap{
    height:160px;
    .showbar{
      width: 100%; height: 100%;
    }
  }
.main-body-box{padding: 10px;}
.btn-wrap{display: flex; justify-content: space-between; }
.vbtn{padding-left: 33px; padding-right: 33px;}



</style>