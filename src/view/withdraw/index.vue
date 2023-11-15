<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import { showToast } from "vant";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const toUsdtout = ()=>{router.push({path:"/usdtout"})}  

  const toTrxexchange = ()=>{
    showToast('暂未开放');
    return ;
    router.push({path:"/trxexchange"})} 

  const toMerchalexchange= ()=>{
    showToast('暂未开放');
    return ;
    router.push({path:"/merchalexchange"})} 
</script>

<template>
  <div class="container ">
    <commonHeader ftitle="提现" />
   
    <div class="recharge-box-wrap bgbasecolor3">
        <div class="fontbasecolor">
            <h1>提现</h1>
            <h5>多种方式，快速使用</h5>
        </div>
    </div>

    <div class="charge-box-wrap padding30 bgwhite">
        <div class="charge-box">
            <div class="box-items bordercolor1 disflex" @click="()=>toUsdtout()">
                <div class="box-item1 ">
                    <div class="icon bgbasecolor3 fontbasecolor iconfont icon-U font34 fontbold uiconfixed3 uiconwhite"></div>  
                </div>
                <div class="box-item2 basecolor">
                    <div class="font16 fontbold">提币USDT</div>
                    <div class="font12 margintop3">将账户USDT提币到钱包地址</div>
                </div>
                <div class="box-item3">
                    <div class="box-item-btn bgbasecolor3 font12 fontbasecolor">开始</div>
                </div>
            </div>

            <div class="box-items bordercolor2 disflex margintop20" @click="()=>toTrxexchange()">

                <div class="box-item1 ">                    
                        <img  class="image=box uiconfixed3" src="../../assets/tron.png" />                   
                </div>
                <div class="box-item2 fontdanger">
                    <div class="font16 fontbold">兑换TRX</div>
                    <div class="font12 margintop3">使用账户USDT兑换TRX到钱包地址</div>
                </div>
                <div class="box-item3">
                    <div class="box-item-btn bgbasecolor5 font12 fontbasecolor">开始</div>
                </div>

            </div>


            <div v-if="false" class="box-items bordercolor3 disflex margintop20" @click="()=>toMerchalexchange()">
                <div class="box-item1 ">
                    <div class="icon bgbasecolor8 fontbasecolor iconfont icon-paper-full font28 fontbold uiconfixed3 uiconwhite"></div>  
                </div>
                <div class="box-item2 fontcolortips">
                    <div class="font16 fontbold">商户充值</div>
                    <div class="font12 margintop3">使用账户USDT向商户账户转账充值</div>
                </div>
                <div class="box-item3">
                    <div class="box-item-btn bgbasecolor8 font12 fontbasecolor">开始</div>
                </div>
            </div>
        </div>
    </div>

    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss">
@import '../trans/common.scss';
</style>
