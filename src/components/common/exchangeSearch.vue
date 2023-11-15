<script setup lang="ts">
import { useRouter } from "vue-router";
  import { ref,reactive,ComponentInternalInstance, getCurrentInstance } from "vue";
  import { showDialog } from 'vant';
  import exchangelist from "@/components/lists/exchangelist.vue";
 
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that = proxy as object; 

    /**
   * 搜索数据
   */
   let searchdata = reactive({
        data:{
          ordernum:null,
          ordernet:[
            {cname:null,   labelvalue:0,selected:true, labelname:"请选择交换网络"},
            {cname:"trc20",labelvalue:1,selected:false,labelname:"波场-TRC20"},
            {cname:"erc20",labelvalue:2,selected:false,labelname:"以太坊-ERC20"},      
          ],
          ordersts:[
            {labelvalue:0,selected:true, labelname:"订单状态"},
            {labelvalue:21,selected:false,labelname:"兑换中"},
            {labelvalue:22,selected:false,labelname:"兑换成功"},
            {labelvalue:23,selected:false,labelname:"兑换失败"},
            {labelvalue:24,selected:false,labelname:"兑换取消"}        
          ]
        }
   })

  const searchnet = (e:any)=>{  
      let itemindex = e.target.value
      let items = searchdata.data.ordernet;
      let item = items[itemindex];
      items.forEach(it=>{it.selected = false});    
      item.selected = true
  }  
  const searchordersts = (e:any)=>{   
      let itemindex = e.target.value
      let items = searchdata.data.ordersts;
      let item = items.find(ide=>ide.labelvalue == itemindex);      
      items.forEach(it=>{it.selected = false});
      item.selected = true;
    }
   const clickSearch = async ()=>{
      let ordernet = searchdata.data.ordernet.find(it=>it.selected);
      let orderSts = searchdata.data.ordersts.find(it=>it.selected);
      let ordernum = searchdata.data.ordernum;    
      if(!ordernum && orderSts?.labelvalue ===0 && ordernet?.labelvalue === 0){
        showDialog({message: "请输入查询条件"}); return false;
      }
      let senddata = {
        ordernum,
        ordernet,
        exchange:true,
        orderSts
      }
      if(ordernet?.labelvalue == 0) delete senddata.ordernet;
      if(orderSts?.labelvalue == 0) delete senddata.orderSts;    
      let searchurl = "/api/search/orderlist"
      let getdata = await that.$request.post({url:searchurl,data:senddata});
      if(getdata.status){          
          pageInfo.totalItems=getdata.totalItems   
          pageInfo.pageTotal = Math.ceil(getdata.totalItems / getdata.pageSize);
          lists.data=getdata.list         
        } 
   }

   /**页面数据 */
   let pageInfo = reactive({currentPage:1,totalItems:10,pageSize:10,pageTotal:1,exchange:true})
   
   /**传给子组件的值 */
   const lists = reactive({data:[]});
  
   //const recordlist = [{ lists : data }];
   /*默认查询订单记录 */

   const getorderlist =async ()=>{    
        let searchorderurl = "/api/search/orderlist";
        let getdata = await that.$request.post({url:searchorderurl,data:pageInfo});
        if(getdata.status){          
          pageInfo.totalItems=getdata.totalItems   
          pageInfo.pageTotal = Math.ceil(getdata.totalItems / getdata.pageSize);
          lists.data=getdata.list         
        } 
   }
   getorderlist();
 
  const clickPageChange = async (event: number)=>{
    pageInfo.currentPage = event
    getorderlist()
  }
  
</script>

<template>
  <div> 
          <div class="margintop20">
             <div class="padding10 paddingbottom0 font14">
              <div class=" disflex align-items-center bgbasecolor7 charge-search-box">
                <div class="charge-search-input-icon font26 icon iconfont icon-sousuo1"></div>
                <div class="charge-search-input-wrap"> <input type="number"
                   v-model="searchdata.data.ordernum" class="search-input" 
                   placeholder="搜索编号" /></div>              </div>             
             </div>

            <div class="search-box-body bgwhite">
              <div class="select-area-charge "> 
                <div class="select-box ">
                  <select class="select-item2 fontdark font14"  
                     @change="(e)=>searchnet(e)" placeholder="请选择交换网络">
                    <option v-for="(it,idx) in searchdata.data.ordernet" :key="idx" :value="it.labelvalue"  @click="()=>searchnet(idx)">
                      {{it.labelname}}
                    </option> 
                  </select>
                </div>
                <div class="select-box margintop10">
                  <select class="select-item2 fontdark font14" @click="(e)=>searchordersts(e)" >
                    <option v-for="(its,idxs) in searchdata.data.ordersts" :key="idxs" :value="its.labelvalue"  >
                      {{its.labelname}}
                    </option>                                                                                                                                         
                  </select>
                </div>
              </div>              
              <div class="search-btn-area margintop10">
                <button @click="()=>clickSearch()" class="search-btn-box search-btn-box-transparent bgbasecolor4 basecolor font16">搜索</button>
              </div>
            </div>
          </div>
          <div class="recordlist-wrap">
              <exchangelist  :lists="lists.data" />
              <div class="margintop10">
                <van-pagination 
                  v-model="pageInfo.currentPage" 
                  :total-items="pageInfo.totalItems" 
                  :show-page-size="pageInfo.pageSize" 
                  @change="(e)=>clickPageChange(e)"                 >
                  <template #prev-text>
                    <van-icon name="arrow-left" />
                  </template>
                  <template #next-text>
                    <van-icon name="arrow" />
                  </template>
                  <template #page="{ text }">{{ text }}</template>
                </van-pagination>
                <div class="text-align font12 fontgrey margintop10">共{{pageInfo.totalItems}}条记录，每页显示10条，当前第{{pageInfo.currentPage}}/{{pageInfo.pageTotal}}页</div>
              </div>             
          </div>
          <div v-if="lists.data.length<=0" class="charge-no-content no-content fontgrey">暂无相关数据 </div>
  </div>
</template>

<style lang="scss" >
.select-item2{width: 100%;}
.charge-search-box{padding: 0 10px;border-radius: 0.42rem;}
.charge-search-input-icon{width: 26px;}
.charge-search-input-wrap{flex: 1;}
.charge-no-content{padding: 80px 0;}

</style>
