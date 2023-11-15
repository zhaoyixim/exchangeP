import { createRouter,createWebHashHistory } from "vue-router";
import  homeIndex from '@/view/home/index.vue';

const routes = [
  {
    path:'/',
    redirect:"/index"
  },
  {
    path:'/index',component:homeIndex
  },
  {
    name:"transaction",
    path:'/transaction',component:()=>import('../view/home/transaction.vue')
  },
  /**消息 */
  {
    name:"notice",
    path:'/notice',component:()=>import('../view/home/notice.vue')
  },
  {
    name:"vchat",
    path:'/vchat',component:()=>import('../view/vchat/kefu.vue')
  },
  /**购买交易 */
  {
    name:"transdetail",
    path:'/transdetail/:memory',component:()=>import('../view/home/transdetailbuy.vue')
  },
  {
    name:"transdetal",
    path:'/transdetal/:memory',component:()=>import('../view/home/transdetailsell.vue')
  },

  /*需求订单 */
  {
    name:"detail",
    path:'/detail/:memory',component:()=>import('../view/help/detail.vue')
  },

  /**收款码 */
  {
    name:"recieveqcode",
    path:'/recieveqcode/:memoryTransId',component:()=>import('../view/home/trans/recieveqcode.vue')
  },
  /**付款完成 */
  {
    name:"payover",
    path:'/payover/:memoryTransId',component:()=>import('../view/home/trans/payover.vue')
  },
  /**上传收款吗 */ 
  {
    name:"sendqcode",
    path:'/sendqcode/:memoryTransId',component:()=>import('../view/home/trans/sendqcode.vue')
  },
  /**上传收款吗 */ 
  {
    name:"sellover",
    path:'/sellover/:memoryTransId',component:()=>import('../view/home/trans/sellover.vue')
  },
  {
    name:"profile",
    path:'/profile',component:()=>import('../view/home/profile.vue')
  },
  {
    name:"recharge",
    path:'/recharge',component:()=>import('../view/trans/recharge.vue')
  },
  {
    name:"chargeusdt",
    path:'/chargeusdt',component:()=>import('../view/trans/chargeusdt.vue')
  },  
  {
    name:"chargetrx",
    path:'/chargetrx',component:()=>import('../view/trans/chargetrx.vue')
  },
  {
    name:"chargeing",
    path:'/chargeing/:id',component:()=>import('../view/trans/chargeing.vue')
  },
  {
    name:"withdraw",
    path:'/withdraw',component:()=>import('../view/withdraw/index.vue')
  },
  {
    name:"withdrawing",
    path:'/withdrawing/:id',component:()=>import('../view/withdraw/withdrawing.vue')
  },
  {
    name:"usdtout",
    path:'/usdtout',component:()=>import('../view/withdraw/usdtout.vue')
  },
  {
    name:"trxexchange",
    path:'/trxexchange',component:()=>import('../view/withdraw/trxexchange.vue')
  },
  {
    name:"exchangeing",
    path:'/exchangeing/:id',component:()=>import('../view/withdraw/exchangeing.vue')
  },  
  {
    name:"merchalexchange",
    path:'/merchalexchange',component:()=>import('../view/withdraw/merchalexchange.vue')
  },

  /*发布出价 */
  {
    name:"bidpublish",
    path:'/bidpublish',component:()=>import('../view/bider/bidpublish.vue')
  },
  /*出价管理 */
  {
    name:"bidmanager",
    path:'/bidmanager',component:()=>import('../view/bider/bidmanager.vue')
  },
   /*需求订单 */
  {
    name:"needorder",
    path:'/needorder',component:()=>import('../view/help/needorder.vue')
  }, 
  
  /*交易保障 */
  {
    name:"protection",
    path:'/protection',component:()=>import('../view/help/protection.vue')
  },
  /*账户验证 */  
  {
    name:"verifyaccunt",
    path:'/verifyaccunt',component:()=>import('../view/help/verifyaccunt.vue')
  },
   /*账户设置 */  
  {
    name:"setaccunt",
    path:'/setaccunt',component:()=>import('../view/help/setaccunt.vue')
  },
  /*收款设置 */  
  {
    name:"payment",
    path:'/payment',component:()=>import('../view/help/payment.vue')
  },
   /*收藏设置 */  
   {
    name:"collect",
    path:'/collect',component:()=>import('../view/help/collect.vue')
  },

  /*安全设置 */  
  {
    name:"safeset",
    path:'/safeset',component:()=>import('../view/help/safeset.vue')
  },
   /*安全设置 */  
   {
    name:"kefu",
    path:'/kefu',component:()=>import('../view/help/kefu.vue')
  },
  {
    name:"login",
    path:'/login',component:()=>import('../view/home/login.vue')
  },
  {
    name:"reg",
    path:'/reg',component:()=>import('../view/home/reg.vue')
  },
  {
    name:"forget",
    path:'/forget',component:()=>import('../view/home/forget.vue')
  },
  {
    name:"news",
    path:'/news',component:()=>import('../view/home/news.vue')
  }

]
const router = createRouter({
  history:createWebHashHistory(),
  routes
})
export default router