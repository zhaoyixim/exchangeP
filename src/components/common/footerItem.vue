<script setup lang="ts">
   /**获取账户余额 */
import { ref,reactive,ComponentInternalInstance, getCurrentInstance } from "vue";
const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const that:any = proxy as object;

const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});

userinfo.data = that.$vcache.vget("meminfo")
</script>

<template>
   <div v-if="false" class="margintop20 deal-footer">
      <div class="font12">2021-2023 © {{userinfo.data.domain}}</div>
      <div class="disflex font14 footer-item-wrap">
        <div class="footer-item">{{userinfo.data.sysname}}</div>
        <div class="footer-item">服务条款</div>
        <div class="footer-item">联系我们</div>
      </div>
    </div>
</template>

<style lang="scss">
</style>
