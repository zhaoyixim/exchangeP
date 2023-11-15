<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import { showToast } from "vant";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const toUsdtcharge = ()=>{router.push({path:"/chargeusdt"})}  
  const toTrxcharge = ()=>{ showToast('暂未开放');
    return ;router.push({path:"/chargetrx"})}  

  
</script>

<template>
  <div class="container ">
    <commonHeader ftitle="充值" />
   
    <div class="recharge-box-wrap bgbasecolor3">
        <div class="fontbasecolor">
            <h1>充值</h1>
            <h5>多种方式，快速充值</h5>
        </div>
    </div>

    <div class="charge-box-wrap padding30 bgwhite">
        <div class="charge-box">
            <div class="box-items bordercolor1 disflex" @click="()=>toUsdtcharge()">
                <div class="box-item1 ">
                    <div class="icon bgbasecolor3 fontbasecolor iconfont icon-U font34 fontbold uiconfixed3 uiconwhite"></div>  
                </div>
                <div class="box-item2 basecolor">
                    <div class="font16 fontbold">充币USDT</div>
                    <div class="font12 margintop3">使用USDT为您的易优账户充值</div>
                </div>
                <div class="box-item3">
                    <div class="box-item-btn bgbasecolor3 font12 fontbasecolor">开始</div>
                </div>
            </div>

            <div class="box-items bordercolor2 disflex margintop20" @click="()=>toTrxcharge()">

                <div class="box-item1 ">                    
                        <img  class="image=box uiconfixed3" src="../../assets/tron.png" />                   
                </div>
                <div class="box-item2 fontdanger">
                    <div class="font16 fontbold">TRX换汇</div>
                    <div class="font12 margintop3">充币TRX为您的易优账户换汇USDT</div>
                </div>
                <div class="box-item3">
                    <div class="box-item-btn bgbasecolor5 font12 fontbasecolor">开始</div>
                </div>

            </div>
        </div>
    </div>    
   


    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss">
@import './common.scss';
</style>
