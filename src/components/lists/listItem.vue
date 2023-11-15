<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref,ComponentInternalInstance,reactive, getCurrentInstance, toRefs } from "vue";
import { showToast } from 'vant';

let router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that : any = proxy;
const props = defineProps({itemData:{},collectFlg:Boolean || false})

const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
userinfo.data = that.$vcache.vget("meminfo")

const collectFlg = props.collectFlg

const itemData = reactive({data:props.itemData})
const toTransIn = ()=>{router.push("/transdetail")}
const toTransOut = () =>{router.push("/transdetal")}
const totranUrl = ref()
const toTrans = (item)=>{
  if(item.bidType == 2) totranUrl.value = 'transdetail'
  if(item.bidType == 1) totranUrl.value = 'transdetal'
  console.log(item,"item")
  if(item.userId == userinfo.data._id){
    showToast('您不能操作自己的出价')
  }else{
    router.push({name:totranUrl.value,params:{memory:item._id}})
  } 
}
const cancelCollect = async(item) =>{ 
  const collectUrl = "api/trade/collectDelete"
  let collectId = item.collectId
  if(!collectId) {
    showToast('操作失败');return ;
  }
  await that.$request.post({url:collectUrl,data:{collectId}})   
  showToast('取消收藏成功'); 
  item.show = false
}
</script>
<template>
  <div v-for="(item,index) in itemData.data" :key="index" >
    <template v-if="!collectFlg || (collectFlg && item.show)">
    <div :class='["list-box","margintop10","bgwhite",collectFlg?"collectItem":"" ]'>    
      <div class="left-area" @click="()=>toTrans(item)">
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
                  <div v-if="item.bidType === 2">
                    <div>限额 ¥{{item.bidRmbMin}} - ¥{{item.bidRmbMax}}</div> 
                    <div>最低单次售卖:{{item.sellCount}}U</div> 
                  </div>
                   
                  <div v-else>需求额度{{item.bidUsdtMin}}U - {{item.bidUsdtMax}}U</div>
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
                   <span v-if="item.bidType == 1" >{{item.bidMethod}}购买价格 ￥{{item.realPrice}}/U</span>
                   <span v-else>{{item.bidTitle}}</span>
                </div>
                
              </div>
              <div class="list-bottom-wrap">
                <div v-if="item.memberinfo.avatar" class="avatar-box">
                  <img class="image-box" :src="item.memberinfo.avatar" />
                </div>
                <div :class='["font18", "fontdot" ,item.memberinfo.active?"dot-active":""]' ></div>
                <div class="fontdark font14 fontbold">{{item.memberinfo.username}}</div>
                <div  class="diamonds-icon basecolor">
                  <div :class='["icon","iconfont","font14","icon-renzheng",item.memberinfo.creditLevel===0?"fontB5":""]' ></div>
                </div>
                <div v-if="item.memberinfo.bailNums>0" class="identyfy-box font12 fontcolortips">
                  <div class="identify-flg fontcolortips">
                    <div class="icon iconfont icon-yanzheng fontcolortips font12"></div>
                  </div>
                   
                  <div v-if="item.bidType == 2">已缴保证金{{item.bidUsdtMax}} USDT</div>
                  <div v-if="item.bidType == 1">要求保证金{{item.askNums}} USDT</div>
                </div>
              </div>
          </div>
          <div class="right-area">
            <div v-if="!collectFlg" :class='["list-btn-box",item.bidType === 2?"bgbasecolor3":""]'>
              <div :class='["icon","iconfont","font12","icon-U","uiconfixed2",item.bidType === 2?"uiconwhite fontbasecolor":"uiconbasecolor"]'></div>  
              <div :class='["font12",item.bidType === 2?"fontbasecolor":""]'><span v-if="item.bidType === 1">出售</span><span v-else>购买</span></div>
            </div>
            <div v-else  class="list-btn-box bgbasecolor3" @click="()=>cancelCollect(item)">
                <div class="font12 fontbasecolor">取消收藏</div>
            </div>
          <div v-if="!collectFlg" class="list-total-msg font12 colorlightgrey">成交{{item.totalUsdt}}额度</div>
      </div>
    </div>
  </template>
  </div>
 
</template>

<style lang="scss" scoped>
.marginleftp8{margin-left: -8px;}
.collectItem{
  .right-area {width: 78px;margin-top: 20px;}
  .list-btn-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 60px;
    padding: 10px 7px;
    padding-right: 5px;
    color: #8950FC;
    background-color: #EEE5FF;
    border-color: transparent;
    border-radius: 4px;
  }
}
</style>
