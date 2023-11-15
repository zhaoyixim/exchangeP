<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

let router = useRouter()
const props = defineProps({itemData:{}})
const itemData = props.itemData;



const toTransIn = ()=>{router.push("/transdetail")}
const toTransOut = () =>{router.push("/transdetal")}
</script>

<template>
  <div>
    <div class="list-box margintop10 bgwhite" @click="()=>toTransOut()">
      <div class="left-area">
              <div class="title-box-wrap"> 
                <div class="identify-flg">
                  <div class="icon iconfont icon-yanzheng fontcolortips"></div>
                </div>
                <div class="title-box width260 fontdark font15 lineellipsis">
                  千万白资可验流水 司法双赔 千万白资可验流水 司法双赔
                </div>
              </div>
              <div  class="limit-wrap font13">
                <div class="limit-words font666 width260 lineellipsis"> 
                  <div>  限额 ¥200 - ¥30000  </div> 
                  <div class="limit-words-tips fontcolortips">
                    <div class="limit-words-tips-icon icon font12 fontbold iconfont icon-jiantou_xiangxia"> </div>
                    <div>低于市价 -2.11% </div> 
                  </div>
                 
                </div>
                <div class="limit-words-tips font12 fontgrey width280 lineellipsis">微信支付￥6.75，支付宝￥6.75，银行转账￥6.75</div>
              </div>
              <div class="list-bottom-wrap">
                <div class="avatar-box">
                  <img class="image-box" :src="`/src/assets/avatar.jpg`" />
                </div>
                <div class="font18 fontdot"></div>
                <div class="fontdark font14 fontbold">大发商行</div>
                <div class="diamonds-icon  basecolor">
                  <div class="icon iconfont  font14 icon-renzheng"></div>
                </div>
                <div class="identyfy-box font12 fontcolortips">
                  <div class="identify-flg fontcolortips"><div class="icon iconfont icon-yanzheng fontcolortips font12 "></div></div>
                  <div>5000 USDT</div>
                </div>
              </div>
          </div>
          <div class="right-area">
            <div class="list-btn-box">
              <div class="icon iconfont font12  icon-U uiconfixed2 uiconbasecolor"></div>  
              <div class="font12"> 出售</div>
          </div>
          <div class="list-total-msg font12 colorlightgrey">成交4000笔</div>
      </div>
    </div>



    <div class="list-box margintop10 bgwhite" @click="()=>toTransIn()">
      <div class="left-area">
              <div class="title-box-wrap"> 
                <div class="identify-flg">
                 
                </div>
                <div class="title-box width260 fontdark font15 lineellipsis">
                  [微信支付] ￥7.55元 <span class="limit-words-tips-icon fontdanger icon font12 fontbold iconfont icon-jiantou_xiangshang"> 9.26%</span>
                </div>
              </div>
              <div  class="limit-wrap font13">
                <div class="limit-words font666 width260 lineellipsis"> 
                  <div>  限额 ¥200 - ¥30000  </div> 
                </div>
                <div class="limit-words-tips fontgrey width280 lineellipsis">需要同屏截图！ 大额需要流水！</div>
              </div>
              <div class="list-bottom-wrap">
                <div class="avatar-box">
                  <img class="image-box" :src="`/src/assets/avatar.jpg`" />
                </div>
                <div class="font18 fontdot"></div>
                <div class="fontdark font14 fontbold">大发商行</div>
                <div class="diamonds-icon  basecolor">
                  <div class="icon iconfont  font14 icon-renzheng"></div>
                </div>
                <div class="identyfy-box font12 fontcolortips">
                  <div class="identify-flg fontcolortips"><div class="icon iconfont icon-yanzheng fontcolortips font12 "></div></div>
                  <div>保证金 5000 USDT</div>
                </div>
              </div>
          </div>
          <div class="right-area">
            <div class="list-btn-box  bgbasecolor3">
              <div class="icon iconfont font12  icon-U uiconfixed2 uiconwhite fontbasecolor"></div>  
              <div class="font12 fontbasecolor"> 购买</div>
          </div>
          <div class="list-total-msg font12 colorlightgrey">成交4000笔</div>
      </div>
    </div>


  </div>
 
</template>

<style scoped>
</style>
