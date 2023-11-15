<script lang="ts" setup>
import { reactive } from "@vue/reactivity";
import { ComponentInternalInstance, getCurrentInstance,ref } from "vue";
import { useRouter } from "vue-router";
import { showDialog,showToast } from 'vant';
import { toRefs } from "vue";
const router = useRouter()
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const that:any = proxy as object;
const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
userinfo.data = that.$vcache.vget("meminfo")


let fileList =ref([]);
const commissionRate = reactive({data:[
  {cname:"手续费无返利",selected:true,labelvalue:0},
  {cname:"手续费返利5%",selected:false,labelvalue:1},
  {cname:"手续费返利10%",selected:false,labelvalue:2},
  {cname:"手续费返利15%",selected:false,labelvalue:3},  
]})
let imageLists = userinfo.data.avatar.indexOf('base64')
if(imageLists > 0){
  //fileList.value[0].url = ""
}
 console.log(imageLists)
const formdata = reactive({
   nickname:userinfo.data.nickname,
   introduction:userinfo.data.introduction,
   imageFiles:[]
})
const deleAvatar = async() =>{
  userinfo.data.avatar = ""
  //userinfo.data.avatar = '/src/assets/avatar.jpg'
  let postData = {
    userId:userinfo.data._id,    
  }
  await that.$request.post({url:'/api/member/deleteavatar',data:postData})
  that.$commonFunc.updatememinfo()
}
const textareaFous = () =>{
  formdata.introduction = ""
}
const submitBtn = async() =>{
   const updateUrl = "/api/member/changeProfile"
   let postData = {
    nickname:formdata.nickname,
    introduction:formdata.introduction,
    imageFiles:formdata.imageFiles
   }
   let rturnjson = await that.$request.post({url:updateUrl,data:postData});
   if(rturnjson){
    showToast('修改成功')
    that.$commonFunc.updatememinfo()
    router.push('/profile')
   }
   
}
const beforeRead = (file: { type: string; }) =>{
  if (file.type !== 'image/jpeg' && file.type !== 'image/png'  ) {
        showToast('请上传 jpg 格式图片');
        return false;
      }
      return true;
}
const afterRead = (file:any)=>{
  /**上传后 */
  userinfo.data.avatar = file.content
  formdata.imageFiles = file.content
}
</script>
<template>
  <div class="container vh100">
    <commonHeader ftitle="账户设置" /> 

    <div class="fontdark bgwhite padding20 font16 borderbox borderbottom ">
          账户信息
    </div>
    <div class="padding30 bgwhite borderbottom"> 
        <div class="pro-body margintop10">          
            <div class="margintop10">
              <div class="font12"> 用户头像</div>             
                  <div class="input-wrap font12 align-items-center margintop10"> 
                    
                    <div  class="margintop20">
                      <van-image width="80" height="80" :src="userinfo.data.avatar" />
                      <div class="fontB5 font12">当前头像</div>
                      <div @click="()=>deleAvatar()" class="bgbasecolor4  margintop10 basecolor ad-vbtn ad-vbtn-fixed"> 删除</div>
                    </div>

                   <div class="margintop10">
                      <van-uploader v-model="fileList"  :after-read="afterRead" 
                      :max-count="1" :show-upload="true"	 
                      :deletable="true" 
                      :before-read="beforeRead"/>
                      <div class="fontB5 font12">上传图像</div>
                   </div>
                   
                   
                  </div>
                
                  <div class="margintop10 fontB5 font12">
                     用户图像
                  </div> 
            </div>
            
            <div class="margintop30">
              <div class="font12"> 用户昵称</div>
              <input v-model="formdata.nickname" type="text" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
              placeholder="用户昵称"/>
              <div class="font12 fontgrey">昵称仅可修改一次 </div>
            </div>

            <div class="margintop30">
              <div class="font12"> 个人简介</div>
              <van-field 
                rows="4"              
                autosize             
                type="textarea"
                maxlength="100"
                placeholder="请输入个人简介"
                v-model = "formdata.introduction"
                show-word-limit
                @focus="()=>textareaFous()"
              />
              <div class="font12 fontgrey">请勿填写外部广告内容 </div>
            </div>
        </div>  
        
        <div class="margintop30 disflex vbtn-fiexd justify-spacebetween">
          <div></div>
             <button  @click="()=>submitBtn()" class="vbtn fontbasecolor bgbasecolor3 font12">保存更改</button>                   
          </div>
    </div>
      <div  v-if="false" class="fontdark bgwhite padding20 font16 borderbox borderbottom ">推荐用户手续费返利</div>
      <div v-if="false" class="padding30 bgwhite  ">       
            <div class="font12"> 用户等级</div>
             <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
              placeholder="一级会员"/>
            <div class="font12 fontgrey">您所推荐的用户产生交易手续费时奖励给您的比例 </div>
      
            <div class="font12 margintop30"> 佣金比例</div> 
            <div class="select-area disflex borderbox margintop10"> 
                <div class="select-box borderbox">
                <select class="select-item font16 bgbasecolor7 ">
                  <option v-for="(it,index) in commissionRate.data" :key="index"  :selected="it.selected">{{it.cname}}</option>               
                </select>
                </div>              
            </div>
            <div class="font12 fontgrey ">您所推荐的用户产生交易手续费时奖励给您的比例 </div>
      
            <div class="font12 margintop30"> 返利比例</div>
             <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
              placeholder="交易手续费 × 20%"/>
            <div class="font12 fontgrey">您可设置将交易手续费返还给您推荐用户的比例 </div>
      
      </div>


      <div  v-if="false" class="padding30 bgwhite">       
       <div class="fontdark  padding20 font14 borderbox borderbottom ">
         以下信息仅平台可见
       </div>
       <div class="pro-body margintop10">          
           <div class="margintop30">
             <div class="font12"> 邮箱地址</div>
             <input type="text" disabled v-model="userinfo.data.email" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
             placeholder=""/>
           </div>
           
           <div class="margintop30">
             <div class="font12"> 手机号码</div>
             <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
             placeholder="你的手机号码"/>
           </div>

           <div class="margintop30">
             <div class="font12"> Telegram</div>
             <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
             placeholder="你的Telegram号码"/>
           </div>

           <div class="margintop30">
             <div class="font12"> 微信号</div>
             <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
             placeholder="你的微信号(选填)"/>
           </div>

           <div class="margintop30">
             <div class="font12"> QQ号</div>
             <input type="number" class="text-input bgbasecolor7 fontdark font14 borderbox margintop10" 
             placeholder="你的QQ号(选填)"/>
           </div>         
       </div>        
   </div>
           
  </div>
</template>
<style lang="scss" scoped>

.ad-vbtn{ padding: 6.6px 9px; border-radius: 8px; width: 27px; margin-left: 30px; }
      .ad-vbtn-fixed{margin-right: 16px;}
 
.pro-bottom{line-height: 1.8;}
.borderGrey{border: 2px #EBEDF3  solid; border-radius: 6px; }
.vbtn-fiexd{padding-bottom: 20px;}
.marginright20{margin-right: 20px;}
.van-cell{
  margin-top: 20px;
  background-color: #F3F6F9;
    border-color: #F3F6F9;
    color: #3F4254;
}


</style>