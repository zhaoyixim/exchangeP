<script lang="ts" setup>
import { reactive } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance, inject, onBeforeMount, onMounted, ref, toRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showDialog,showImagePreview,showToast } from 'vant';
import { Socket } from 'socket.io-client';
import { useScrollParent, useEventListener } from '@vant/use';
import bidItem from "@/components/lists/bidItem.vue";

const socket = inject('socket') as Socket;
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that:any = proxy as object;
const userinfo = reactive({data:{usdtAll:"",usdt:""}});userinfo.data = that.$vcache.vget("meminfo");
const  context=ref(""); 
const   contentBody = ref("")
const  messages=ref([]); 
const { query } = useRoute();
const {userId,touserId,fromBidId,fromTradeId} = query,ctype=ref(1);

const onClickLeft = () => {
  history.go(-1);
  socket.emit('offline', {userId: userinfo.data._id})
}
if(!userId || !touserId || !fromTradeId){
  showToast('参数错误');
  setTimeout(()=>{
    //history.go(-1);
  },500)
}
if(userId != userinfo.data._id){
  showToast('非法用户');
  setTimeout(()=>{
   // history.go(-1);
  },500)  
}
const showTradeOrder = ref(false)
const tradeOrder = ref([])
const getNeedOrder =async ()=>{
  const tradeUrl = "api/trade/sigleNeedList"
  const findOrder = await that.$request.post({url:tradeUrl,data:{fromTradeId}})
 
  if(findOrder) {
    showTradeOrder.value = true
    tradeOrder.value.push(findOrder)
  }
}
if(fromTradeId) getNeedOrder();

const srollBody = ref()
const scrollParent = useScrollParent(srollBody);

socket.emit('online', {userId: userinfo.data._id}); 
socket.on('send', (data:any) => {
  //messages.value.push(data)
  console.log("send返回",data)
  if(data && data.touserId == userinfo.data._id) messages.value.push(data)
  scrollParent.value?.scrollTo({ top: srollBody.value.scrollHeight, behavior: 'smooth' });
});
/**页面数据设置 */
const pageSize = ref(10),page = ref(1);

const loading = ref(false);
const onRefresh = () =>{
  page.value ++ ;
  initPageData(false);
  loading.value=false
}
const initScroll = ref(true)
useEventListener('scroll',() => {if(initScroll.value) scrollParent.value?.scrollTo({ top: srollBody.value.scrollHeight});initScroll.value = false;},{ target: scrollParent });
const pageLimitZero = ref(0)
const initPageData = (init:boolean | true) => {
/**获取数据 */
  socket.emit('getMessageLists',{userId,touserId,fromBidId,fromTradeId,pageSize:pageSize.value,page:page.value},(data:any)=>{
    let returnData = data.returnJson
    if(data.current == 0){
      if(pageLimitZero.value>0){
        //不是第一次到0 页，第二次就到顶了
        showToast('已经到顶了');
        return '';
      }else pageLimitZero.value ++;      
    }
    if(returnData.length >0){
      returnData.map(it => {
       if(it.userId == userinfo.data._id) {
        it.isActive = true;
        it.avatar = userinfo.data.avatar
       }
      });
      if(init)
        messages.value=returnData
      else{
        let s = messages.value;
        messages.value=returnData
        messages.value.push(...s)
      }       
    }else{
      if(page.value>1) page.value --;
    }
  // console.log(messages.value,"messages.value")
   // scrollParent.value?.scrollTo({ top: returnData.length *174 , behavior: 'smooth' });
  })
 
}
onMounted(() => {
  socket.connect(); //连接socket服务器
  initPageData(true);
  scroll()
});
const inputfocus = () => {
  scrollParent.value?.scrollTo({ top: srollBody.value.scrollHeight+30, behavior: 'smooth' });
  ctype.value = 1;
}

const onclickbtn = async() =>{
  if(!context.value) {showToast('请输入内容');return ;}

  if((/^1(3|4|5|6|7|8|9)\d{9}$/.test(context.value))){showToast('请勿输入手机号码');return ;} 
  if((/^[1-9][0-9]{4,10}$/.test(context.value))){showToast('请勿输入QQ号码');return ;} 
  if((/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(context.value))){showToast('请勿输入微信号');return ;} 



  scrollParent.value?.scrollTo({ top: srollBody.value.scrollHeight+30, behavior: 'smooth' });
  let contextTxt = context.value
  if(ctype.value==2) contextTxt = "" ;//减少上传流
  let saveitem = {
    username:userinfo.data.username,
    context:context.value,
    contentBody:contentBody.value,
    ctype:ctype.value,    
    isActive:true,
    avatar:userinfo.data.avatar
  } 
   if(ctype.value < 3){
    socket.emit('send', {userId: userId,touserId:touserId,context:contextTxt,contentBody:contentBody.value,
    fromBidId,fromTradeId,ctype:ctype.value },(data:any) => {
        console.log("上传成功",data)
    });
    messages.value.push(saveitem);
   }else{
    const uploadUrl = "api/vchat/uploadvideo";
    const uploadData ={userId: userId,touserId:touserId,context:contextTxt,contentBody:contentBody.value,fromBidId,fromTradeId,ctype:ctype.value }

    await that.$request.post({url:uploadUrl,data:uploadData}).then(res=>{      
      messages.value.push(saveitem);      
    })
   }  
   context.value = "";
}


const handleSend=()=> {
      // 进行验证
      // 判断是否登录
     
        // 如果当前没有登录，则跳转到登录界面
       
      // 发送消息
      /* eslint-disable */
      //socket.emit("msg_send", this.context);
  }

/**上传图片 */
const filePhontoLists = ref([])
const beforeReadPhoto =  (file: { type: string; }) =>{
     if(file.type !== 'image/jpeg' && file.type !== 'image/png') {showToast('请上传 jpg 格式图片');return false;}
      return true;
}
const afterReadPhoto = (file:any) =>{
  contentBody.value = file.content;
  context.value = '<img class="image-box" src='+file.content+' />' ;ctype.value = 2;
  onclickbtn();
}
const showoverlay = ref(false)
const videoUrl = ref("")
const videoRef = ref()
const clickOverLay = () => {
  videoRef.value.pause();
  showoverlay.value = !showoverlay.value
  videoUrl.value = ""
}
const showPreview = (item:any) =>{
  if(item.ctype == 2){
    showImagePreview({images:[item.contentBody]});
  }
  if(item.ctype == 3){
    showoverlay.value = true
    videoUrl.value=item.contentBody
  }
}
/**上传视频 */
const fileVideoLists = ref([])
const beforeReadVideo = (file:any) => {
  return true;
}
const afterReadVideo = async(file:any) => { 
   contentBody.value = file.content;
   ctype.value = 3;
   context.value = '<video style=\"width:120px;height:120px;object-fit:cover;\"  src=\"' +file.content + '\"></video>';
   onclickbtn();   
}
</script>
<template>
  <div class="container vh100">
    <div class="home">
      <van-nav-bar title="聊天室" left-text="返回" left-arrow @click-left="onClickLeft"/>
         
      <van-pull-refresh v-model="loading" @refresh="onRefresh">
        <div class="home-body" ref="srollBody">
          <div class="showTips font14">
            为保证您的信息安全,请勿发送电话号码微信号等私密信息
          </div>


          <div v-if="showTradeOrder" class="trade-wrap">
            <bidItem :itemData="tradeOrder" :needFlg="true"/>       
          </div>

          <div v-for="(message, index) of messages" 
          :key="index" :class='{ "active": message.isActive ,"home-body-item":true}'>
            <img class="home-body-avator" :src="message.avatar" />
            <div class="home-body-content">
              <span class="username">{{ message.username }}</span>
              <span class="content" @click="()=>showPreview(message)"  v-html="message.context"></span>
            </div>
          </div>
        </div> 
        <div class="home-bottom">
          <div class="home-bottom-container">
            <van-cell-group inset>
              <van-field
                v-model="context"
                center
                clearable
                @focus="inputfocus"
                placeholder="请输入"
              >
                <template #button>                  
                  <van-uploader v-model="filePhontoLists" :preview-image="false" :before-read="beforeReadPhoto" :after-read="afterReadPhoto" >
                      <van-icon  name="photo-o" size="28" />   
                  </van-uploader>

                  <van-uploader accept="video/*"                   
                    :before-read="beforeReadVideo" 
                    :after-read="afterReadVideo"
                   >
                    <van-icon  name="video-o" size="28" />
                  </van-uploader>

                  <van-button size="small" @click="onclickbtn" type="primary">发送</van-button>
                </template>
              </van-field>
            </van-cell-group>
          </div>
        </div>       
      </van-pull-refresh>
    
  </div>

  <van-overlay :show="showoverlay" >
    <div class="wrapper" @click="clickOverLay">
       <video ref="videoRef" v-if="videoUrl" controls autoplay :src="videoUrl"  style="width:360px;height:300px;object-fit:cover;" ></video>
    </div>
  </van-overlay>


  </div>
</template>
<style lang="scss" scoped>
 .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

 .van-pull-refresh{  height:calc(100vh - 47px); }
.van-button--small{  padding: 18px 0 !important;width: 85px !important;}
.van-cell-group--inset{width: 100% !important; margin: 0 !important;}
.van-icon{position: relative; top: 8px;margin-right: 16px}
.van-icon-video-o{}
@import './kefu.scss';
</style>