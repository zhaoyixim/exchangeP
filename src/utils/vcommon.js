import md5 from 'js-md5'
import request from './request';
import vcache from './vcache.js';
import { showToast  } from 'vant';
import { useRouter } from "vue-router";
/*token 存储有效时间--单位秒*/
const expiretime = 3600
const router = useRouter()
const commonFunc = {
	getRandomString:(code=10)=>{
	      let len = code
	      let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789' 
	      let maxLen = $chars.length
	      let pwd = ''
	      for (let i = 0; i < len; i++) {
	        pwd += $chars.charAt(Math.floor(Math.random() * maxLen ))
	      }
	      return pwd.toUpperCase()
	},
	setToken:async(authdata = {})=>{
		let timestamp=new Date().getTime()/*毫秒级*/
		let appid = commonFunc.getRandomString(10);
		let secrect = commonFunc.getRandomString(16);
		let mphone = commonFunc.getRandomString(11);
		let senddata = {
			appId : appid.toUpperCase(),
			secrect : secrect,
			imel : md5(appid+secrect+mphone),
			timeId : timestamp,
			mphone : mphone,
			randStr : commonFunc.getRandomString()
		}
		let json1 =  "";
		for(let key in senddata){
			json1 += senddata[key]
		}
		let json2 = md5(json1)
		senddata.authId = md5(md5(json1) + json2)	
		let authurl = '/api/auth/token'
		let postdata = {authcode:senddata,...authdata}
		let accesscode = await request.post({url:authurl,data:postdata});
		console.log('accesscode',accesscode);
		if(accesscode){
			await vcache.vset("token",accesscode.access_token,expiretime);
			return true
		}else{
			showToast("token获取失败");
			return false
		}
	},
	tokenCheck:async(flag = false)=>{
		/*flag == true 强制刷新token*/
		let gettoken = await vcache.vget("token")
		let meminfo = await vcache.vget("meminfo")
		if(!meminfo){
			showToast({title:"未登录!"})
			setTimeout(function(){
				router.push('/login')
			},1000)
			return ;
		}
		 if(flag || null == gettoken || undefined ==gettoken){
			 console.log("token过期")
			 let senddata = {}
			 senddata.username = meminfo.username
			 senddata.password = meminfo.password
			 return  await commonFunc.setToken(senddata);
		 }
		 return true
	},
	updatememinfo:async()=>{
		let getmeminfo = await vcache.vget("meminfo")
		let memurl = '/api/member/info'		
		let meminfo = await request.get({url:memurl})
		if(meminfo) {
			await vcache.vset("meminfo",meminfo)
			return meminfo;
		}else{
			showToast({title:"用户数据获取失败"});			
			setTimeout(function(){
				router.push('/login')
			},1000)
			return ;
		}
	}
};
export default commonFunc;