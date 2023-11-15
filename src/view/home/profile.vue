<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import { useRouter } from "vue-router";
  import { ref,reactive,ComponentInternalInstance, getCurrentInstance } from "vue";
  import { showDialog } from 'vant';
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that:any = proxy as object;
   /**获取账户余额 */
  const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
  userinfo.data = that.$vcache.vget("meminfo")
  const router = useRouter();
  const recharge = ()=>{router.push({path:"/recharge"})}
  const towithdraw = ()=>{router.push({path:"/withdraw"})}

  const tobidpublish = ()=>{router.push({path:"/bidpublish"})}
  const tobidmanager = ()=>{router.push({path:"/bidmanager"})}


  const memlevel = userinfo.data.level === 1 ? "一":"一";
  const checklevel = userinfo.data.verifyLevel === 1 ? "一":"一";  
  const menuList = reactive({
    list:{},
    listlength:0,
  })

  const getMenuList = async()=>{
    menuList.list = await that.$request.get({url:"/api/member/menuList"});
    menuList.listlength = menuList.list.length;
   }
   getMenuList()
  const clickHref = (items:any)=>{
      if(items.chref) {
        router.push({path:items.chref})
      }
  }
</script>

<template>
  <div class="container ">
    <div> <commonHeader ftitle="个人中心" /> </div>
    <div  class="profile-title-wrap bgwhite"> 
       <div class="profile-title-bg"></div>
       <div class="title-box bgwhite font13 "> 
            <div class="float-box  fontbasecolor bgbasecolor3 ">
              <div class="float-icon font18 icon iconfont icon-homepage_fill"></div>
              <div> 主页</div>
            </div>

        <div class="top-box disflex">
          <div class="left-box">
            <div class="avatar-box">
              <img class="image-box avatarBox" :src="userinfo.data.avatar"  />
            </div>
          </div>
          <div class="right-box">
            <div class="text-area"> 
              <div class="text-name fontbold fontdark font16">
                 <span v-if="userinfo.data.nickname">{{userinfo.data.nickname}}</span> 
                 <span v-else>{{userinfo.data.username }} </span>
              </div>
              <div v-if="false" class="text-identify disflex fontgrey">
                <div class="text-level-box disflex">
                  <div class="text-level-icon icon iconfont icon-31huiyuan"></div>
                  <div class="">
                    {{memlevel}}
                    级会员</div>
                </div>
                <div class="text-identify-level-box disflex">
                  <div class="font12 text-idenfify-level-icon icon iconfont icon-yanzheng"></div>
                  <div class="">  {{checklevel}}级验证</div>
                </div>
              </div>
              <div class="email-box disflex font12 fontgrey margintop5">
                <div class="email-icon fontdanger icon iconfont icon-youxiang1"> </div>
                <div>
                  {{userinfo.data.email }}
                </div>
              </div>

              <div class="desp-box disflex font12 fontgrey">
                <div>{{userinfo.data.introduction}}</div>
              </div>

            </div>
          </div>
        </div>
        <div class="bottom-box disflex">
          <div class="wallet-box disflex">
            <div class="wallet-icon icon iconfont icon-wodeqianbao-m basefontcolor font30"> </div>
            <div class="wallet-coins fontbold font16">
              {{userinfo.data.usdt}} USDT              
            </div>
          </div>
          <div class="wallet-btn-box disflex">
            <div class="wallet-btn wallet-input" @click="()=>recharge()">充值</div>
            <div class="wallet-btn"   @click="()=>towithdraw()">提现</div>
          </div>
        </div>
       </div>
       <div v-if="false" class="kefu-box-wrap bgbasecolor4 margintop20 disflex"> 
          <div class="kefu-icon icon iconfont icon-kefufill basefontcolor font35"></div>
          <div class="kefucontent font14 basefontcolor autobreakwords"> 
            亲爱的用户 
            <b> {{userinfo.data.username }} </b> 
            <span v-if="userinfo.data.checkemail">
                您好，欢迎您注册使用易优，
                请尽快 
                <a href="my_renz.html" class="fontbold basecolor">验证注册邮箱&gt;</a> 
                后开始交易，
            </span>
            您可阅读 
            <a href="news_show.html" class="fontbold basecolor">新用户购买提币指南&gt;</a> 
            和 
            <a href="news_show.html" class="fontbold basecolor">商家入驻发布指南&gt;</a>，
            更多使用帮助请查看 
            <a href="help.html" class="fontbold basecolor">帮助中心&gt;</a>
          </div>
        </div>

        <div class="bgf1 list-menu-wrap">
           <div class="list-ad-box bgwhite disflex">
              <div class="ad-left-fixed">
                <div class="icon iconfont icon-jiaoyidui basecolor font42"></div>
              </div>
              <div class="ad-right-fixed">
                 <div class="font16 fontdark">交易赚钱</div>
                 <div class="middel-text font12 fontgrey">发布交易出价，开始买卖USDT赚钱</div>
                 <div class="font12 disflex">
                    <div @click="tobidpublish" class="bgbasecolor3 fontbasecolor ad-vbtn ad-vbtn-fixed">发布出价</div>
                    <div @click="tobidmanager"  class="bgbasecolor3 fontbasecolor ad-vbtn">出价管理</div>
                 </div>
              </div>
           </div>
           <div class="menu-list-box margintop20 fontdark bgwhite">
              <div v-for="(item,index) in  menuList.list"  :key="index">
                  <div v-if="item.inused" :class='["list-item","disflex",index+1>= menuList.listlength?"":"menu-border-bottom"]'>
                      <div :class='["menu-icon","font21","icon","iconfont",item.iconLabel]'> </div>
                      <div  @click="()=>clickHref(item)" class="right-list-wrap disflex">
                        <div class="menu-text">{{item.cname}}</div>
                        <div v-if="item.rightArrow"  class="menu-icon-right icon iconfont icon-jiantouyou"></div>
                        <div v-else class="menu-icon-right font12">
                          <span :class="item.vclass">{{item.vlabel}} </span>
                        </div>
                      </div>
                  </div>
              </div>
           </div>
        </div>
    </div>
    <commonFooter factive='2' />
  </div>
</template>
<style lang="scss" scoped>
.avatarBox{border-radius: 50px;}
.disblock{display: block;}
.profile-title-wrap{position: relative;z-index: 2;
.profile-title-bg{box-sizing: border-box; width: 100%; position: absolute;
  height: 175px; background-image:linear-gradient(-45deg,#9256E4,#8950FC);
}

}
.title-box{position: relative; padding:2px 1.5rem; padding-top: 0; min-height: 200px; box-sizing:border-box; width: 90%; margin: auto; box-shadow:2px 2px 5px rgba(0,0,0,0.2);}
.float-box{position: absolute; right: 0; margin-right:25px; display: flex; padding: 6px; border-bottom-left-radius: .42rem;  border-bottom-right-radius: .42rem;
  .float-icon{margin-right: 2px;}
}
.top-box{
  
  .left-box{
    .avatar-box{height: 62px; width: 62px; border-radius: .42rem; margin-right: 1.55rem; margin-top: 1.75rem;}
  }
  .right-box{
    padding-top: 33px;
    .text-name{}
    .text-identify{
      box-sizing: border-box;
      padding: 4px 0;
      .text-level-box{margin-right: 6px;}
      .text-level-icon{margin-right: 3px;}
      .text-idenfify-level-icon {position: relative; top:2px; margin: 0 3px;}
    }
    .email-box{padding-bottom: 4px;
      .email-icon{margin-right: 4px;}
    }
  }
}
.bottom-box{
  border-top: 1px #EBEDF3 solid;margin-top: 20px;padding: 22px 0; justify-content: space-between;
  .wallet-box{align-items: center;
    .wallet-icon{position: relative; top:-2px;}
    .wallet-coins{padding-left: 10px;}
  }
  .wallet-btn-box{
    align-items: center;
    .wallet-btn{
      color: #8950FC; background-color: transparent; border:1px #8950FC solid;
      padding: .25rem .45rem; border-radius: .42rem;
    }
    .wallet-input{margin-right: 5px;}
  }
}
.kefu-box-wrap{
  align-items: center;
  box-sizing: border-box; width: 100%;
  padding: 10px; min-height: 110px;
 .kefu-icon{padding: 0 10px;}
 .kefucontent{padding-right: 10px;}
}
.list-menu-wrap{
  padding: 18px; border-radius: 4px;
  .list-ad-box{border-radius: 4px;padding: 15px; align-items: center;
    .ad-left-fixed{padding:0 16px;}
    .ad-right-fixed{
      padding-left: 10px;
      .middel-text{margin: 16px 0;}
      .ad-vbtn{ padding: 6.6px 9px; border-radius: 8px;}
      .ad-vbtn-fixed{margin-right: 16px;}
    }
  }
  .menu-list-box{border-radius: 4px; padding: 6px 12px;
    .list-item{padding: 12px 3px; align-items: center;
      .menu-icon{padding-right: 13px;}
      
      .right-list-wrap{justify-content: space-between; box-sizing: border-box; width: 100%;
        .menu-text{text-align: left;}
      }
    }
    .menu-border-bottom{border-bottom: 1px solid rgba(0, 0, 0, 0.1);}
    
  }
 
}

</style>
