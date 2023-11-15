<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
</script>

<template>
  <div class="container ">
    <commonHeader ftitle="交易信息" />

    <div class="disflex tap-box bgwhite">
      <div class="disflex tap-center fontdark font14">
        <div class="tap-item item-active">全部</div>
        <div class="tap-item tap-item2">购买</div>
        <div class="tap-item">出售</div>
      </div>
    </div>


    <div class="news-box bgwhite">
      <div class="news-content font12 fontdark">
          您当前为
          <b class="basefontcolor">一级会员</b> ，
          出售交易手续费为<b class="basefontcolor">1%</b>，
          已累计完成交易<b class="basefontcolor">0</b>
          笔，交易总量<b class="basefontcolor">0</b>
          USDT，交易总额<b class="basefontcolor">￥0</b>元 
      </div>
      <div class="tips-box font12">
        <span class="tips-border label-light-success">已完成 0 笔</span>
        <span class="tips-border label-light-warning">争议中 0 笔</span>
        <span class="tips-border label-light-info">待放行 0 笔</span>
        <span class="tips-border label-light-danger ">待支付 0 笔</span>
        <span class="tips-border label-light-secondary ">已取消 0 笔</span>
      </div>
    </div>
    <div class="no-order fontgrey">暂无交易订单 </div>
    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss" scoped>
.container{height: 100vh;}
.news-box{
  padding: 2rem 2.25rem;
  margin: 10px;
  .news-content{}
  .tips-box{
    display: inline-block; box-sizing: border-box; width: 100%;
    .tips-border{display: inline-block;  margin: 4px 0; margin-right: 6px;   width: 64px; text-align: center; border:1px transparent solid;padding: 0.15rem 0.65rem;border-radius: 0.42rem; }
  }
}

.tap-center{align-items: center; justify-content: center;}
.tap-item{ border: 1px transparent solid; padding: 8px 0; width: 46px;text-align: center;}
.tap-item2{margin: 0 30px;}
.item-active{border-bottom: 2px #8950FC solid;}

</style>