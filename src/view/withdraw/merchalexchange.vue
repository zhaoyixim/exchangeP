<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import recordlist from "@/components/lists/recordlist.vue";
 
  import { ref } from "vue";
  let currentPage = ref(1);

</script>

<template>
  <div class="container ">
    <commonHeader ftitle="充值" />
   
    <div class="recharge-box-wrap bgbasecolor3">
        <div class="fontbasecolor">
            <h1>商户充值</h1>
            <h5>简单三步，快速兑换</h5>
        </div>
    </div>

    <div class="charge-box-wrap padding30 bgwhite">

        <div class="margintop20 fontdark">
          <div class="font12">  兑换地址</div>
          <div>
            <input type="number" class="text-input bgbasecolor7 fontdark font16 borderbox margintop10" placeholder="输入您的TRC-20钱包地址" />
          </div>           
        </div>

        <div class="margintop20 fontdark">
          <div class="font12"> 兑换数量</div>
          <div>
            <input type="number" class="text-input bgbasecolor7 fontdark font16 borderbox margintop10" placeholder="请输入充值USDT数量" />
          </div>
          <div class="font12 margintop5">账户余额：<b>0 USDT</b> </div>
          <div class="btn-box-wrap margintop20">
              <button class="btn-box font14 fontbasecolor fontnormal borderbox " disabled>下一步</button>
              <div class="btn-fixed right-tips-mute font12 borderbox margintop5">
                账户邮箱未验证，请验证后充币       
                <span class="basecolor">去验证</span>         
                <span class="icon font12 iconfont icon-jiantouyou basecolor"></span>
              </div>
            </div> 
        </div>

        <div class="margintop20 step-box-wrap font14 ">
          <div class="card-title basecolor font14">
            <span class="icon font12 iconfont icon-jiantouxia "></span>
            第一步 填写充值信息
          </div>
          <div class="step-item fontdark font12 margintop5">
           
            当前仅支持
            <span class="basecolor fontbold">易优签约商户</span>转账充值USDT，请输入要充值的
            <span class="basecolor fontbold">易优商户ID和充值USDT数量</span>，点击
            <button class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">下一步</button>。
          </div>

          <div class="card-title fontdark font14 margintop20">
            <span class="icon font12 iconfont icon-jiantouyou basecolor"></span>
            第二步  提交充值订单
          </div>
          <div class="step-item fontdark font12 margintop5">
           
            查看您的
            <span class="basecolor fontbold">商户转账充值</span>订单信息，确认无误后输入您的安全密码点击
            <span class="vbtn-noborder bgbasecolor3 fontbasecolor label-inline step-btn-padding">提交订单</span>
            ，订单发起成功将生成<span class="basecolor fontbold">卡密编码</span>

          </div>

          <div class="card-title fontdark font14 margintop20">
            <span class="icon font12 iconfont icon-jiantouyou basecolor"></span>
            第三步 商户核销充值
          </div>
          <div class="step-item fontdark font12 margintop5">            
            
           
            点击订单【详情】按钮查看<span class="basecolor fontbold">卡密编码</span>，联系您充值的
            <span class="basecolor fontbold">商户平台</span>客服，提供您的 <span class="basecolor fontbold">卡密编码</span>
            
            核销充值，或在商户平台充值页面选择
            <span class="basecolor fontbold">易优充值</span>，填写您的
            <span class="basecolor fontbold">卡密编码</span>提交订单自动核销充值。                             
                    
          </div>

        </div>        
    </div>
   
    <div class="margintop20 fontdark bgwhite padding20">
          <div class="font16"> 充值记录</div>
          <div class="margintop20">
             <div class="padding10 paddingbottom0 font14">
              <div class=" disflex align-items-center bgbasecolor7 charge-search-box">
                <div class="charge-search-input-icon font26 icon iconfont icon-sousuo1"></div>
                <div class="charge-search-input-wrap"> <input type="number" class="search-input" placeholder="搜索编号" /></div>
              </div>             
             </div>

            <div class="search-box-body bgwhite">
              <div class="select-area-charge "> 
                <div class="select-box ">
                  <select class="select-item2 fontdark font14" placeholder="全部类型">
                    <option>全部类型</option>   
                    <option>USDT → TRX</option> 
                    <option>充值</option>   
                    <option>提现</option> 
                  </select>
                </div>
                <div class="select-box margintop10">
                  <select class="select-item2 fontdark font14">
                    <option value="">全部状态</option>
                    <option value="1">已完成</option>
                    <option value="2">待支付</option>
                    <option value="3">已退回</option>
                    <option value="4">已取消</option>                                                                                                                                                                                                                                 
                  </select>
                </div>
              </div>
              
              <div class="search-btn-area margintop10">
              <button class="search-btn-box search-btn-box-transparent bgbasecolor4 basecolor font16">搜索</button>
              </div>

            </div>

          </div>
          <div class="recordlist-wrap">
              <recordlist />
              <div class="margintop10">
                <van-pagination v-model="currentPage" :total-items="50" :show-page-size="5">
                  <template #prev-text>
                    <van-icon name="arrow-left" />
                  </template>
                  <template #next-text>
                    <van-icon name="arrow" />
                  </template>
                  <template #page="{ text }">{{ text }}</template>
                </van-pagination>
                <div class="text-align font12 fontgrey margintop10">共1条记录，每页显示10条，当前第1/1页</div>
              </div>
             
          </div>
          <div class="charge-no-content no-content fontgrey">暂无相关数据 </div>
    </div>
    
    <div class="margintop20 deal-footer">
      <div class="font12">2021-2023 © otc-u.com</div>
      <div class="disflex font14 footer-item-wrap">
        <div class="footer-item">关于易优</div>
        <div class="footer-item">服务条款</div>
        <div class="footer-item">联系我们</div>
      </div>
    </div>


    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss">
@import '../trans/common.scss';
</style>
