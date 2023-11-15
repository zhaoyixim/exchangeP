<script setup lang="ts">
import { ref,ComponentInternalInstance, getCurrentInstance, reactive } from "vue";
import { useRouter } from 'vue-router';
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that : any = proxy;
let router = useRouter()
const props = defineProps({itemData:{},needFlg:Boolean || false})
const needFlg = props.needFlg
const itemData = reactive({data:props.itemData})
const toTransIn = ()=>{router.push("/transdetail")}
const toTransOut = () =>{router.push("/transdetal")}
const totranUrl = ref()
const toTrans = async(item)=>{
  if(needFlg){
    await that.$vcache.vset('bidNeedItem',item)
    router.push({name:'detail',params:{memory:item._id}})
  }else{
    if(item.bidType == 2) totranUrl.value = 'transdetail'
    if(item.bidType == 1) totranUrl.value = 'transdetal'
    router.push({name:totranUrl.value,params:{memory:item._id},query:{f:1}})
  }
  
}
</script>
<template>
  <div>
    <div v-for="(item,index) in itemData.data" :key="index" >
      <van-swipe-cell>
          <div class="list-box margintop10 bgwhite" @click="()=>toTrans(item)">
              <div class="left-area">
                      <div class="title-box-wrap"> 
                        <div v-if="item.bidType === 1"  class="identify-flg">
                          <div class="icon iconfont icon-yanzheng fontcolortips"></div>
                        </div>
                        <div class="title-box width260 fontdark font15 lineellipsis">
                          <span v-if="item.bidType === 1"> {{item.bidTitle}}</span>
                          <span v-else class="marginleftp8">【{{item.bidMethod}}】￥{{item.realPrice}} 
                            <span v-if="item.bidPrice<0" class="fontnormal font12 fontcolortips">
                              <span class="limit-words-tips-icon icon font12 fontbold iconfont icon-jiantou_xiangxia"> </span>
                              {{item.bidPrice}}% </span> 
                            <span v-else class="fontnormal font12 fontdanger">
                              <span class="limit-words-tips-icon icon font12 fontbold iconfont icon-jiantou_xiangshang"> </span>
                              {{item.bidPrice}}% </span></span>
                            
                        </div>
                      </div>
                      <div class="limit-wrap font13">
                        <div class="limit-words font666 width260 lineellipsis"> 
                          <div v-if="item.bidType === 2">限额 ¥{{item.bidRmbMin}} - ¥{{item.bidRmbMax}}  </div> 
                          <div v-else>额度{{item.sellCountUsdt}}U起</div>
                          <div v-if="item.bidType === 1" class="limit-words-tips fontcolortips">
                            <span v-if="item.bidPrice<0" class="fontnormal font12 fontcolortips">
                              <span class="limit-words-tips-icon icon font12 fontbold iconfont icon-jiantou_xiangxia">
                              </span>{{item.bidPrice}}% </span> 
                            <span v-else class="fontnormal font12 fontdanger">
                              <span class="limit-words-tips-icon icon font12 fontbold iconfont icon-jiantou_xiangshang"> </span>
                              {{item.bidPrice}}% </span>
                          </div>
                        
                        </div>
                        <div class="limit-words-tips font12 fontgrey width280 lineellipsis">
                          <span v-if="item.bidType == 1" >{{item.bidMethod}} ￥{{item.realPrice}}</span>
                          <span v-else>{{item.bidTitle}}</span>
                        </div>
                        
                      </div>
                    
                  </div>
                  <div v-if="!needFlg" class="right-area text-center">
                    <div class="list-total-msg font12 fontdanger">进行中</div>
                    <div v-if="item.bidType == 2" class="list-total-msg font12 colorlightgrey">剩余额度:{{item.freezeTotal - item.freezeU}}</div>    
                    <div v-if="item.bidType == 1" class="list-total-msg font12 colorlightgrey">
                      累计额度:{{item.freezeU}}</div>    
                    
                    
                  </div>
                  <div v-else>
                    <div v-if="item.needData.staFlag == 1" class="list-total-msg font12 fontdanger">进行中</div>
                    <div v-else-if="item.needData.staFlag == 9" class="list-total-msg font12 fontdark margintop5">已完成</div>
                    
                    <div class="list-total-msg font12 colorlightgrey margintop5">交易数额{{item.needData.usdtNums}}U</div>
                    <div v-if="item.ctype == 1 && item.needData.buymodel == 1" class="list-total-msg font12 colorlightgrey">将支付￥{{item.needData.rmbNums}}</div>    
                    <div v-if="item.ctype == 1 &&item.needData.buymodel == 2" class="list-total-msg font12 colorlightgrey">将获得￥{{item.needData.rmbNums}}</div>    
                    <div v-if="item.ctype == 2 && item.needData.staFlag < 9" class="list-total-msg font12 fontdanger">
                      有待确认订单
                    </div>
                    
                  </div>
                 
            </div>  
            <template #right>
                <van-button square text="取消" type="danger" class="delete-button" />
                <van-button square text="已完成" type="primary" class="delete-button" />
            </template>
        </van-swipe-cell>
    </div>          
  </div>
 
</template>

<style scoped>
.right-area{width: 85px !important;}
.marginleftp8{margin-left: -8px;}
.delete-button{height: 100%;}
</style>
