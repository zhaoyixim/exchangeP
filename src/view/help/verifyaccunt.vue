<script setup lang="ts">
  import commonFooter from "@/components/common/commonFooter.vue";
  import commonHeader from "@/components/common/commonHeader.vue";
  import { ref,reactive,ComponentInternalInstance, getCurrentInstance } from "vue";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const toUsdtcharge = ()=>{router.push({path:"/chargeusdt"})}  
  const toTrxcharge = ()=>{router.push({path:"/chargetrx"})}  
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const that:any = proxy as object;
   /**获取账户余额 */
  const userinfo = reactive({data:{usdtAll:"",introduction:"",email:"",username:"",usdt:"",level:1,verifyLevel:1}});
  userinfo.data = that.$vcache.vget("meminfo")
  const phoneAreaCode = reactive({data:[ 
    {
        "cname": "请选择所属国家区号",
        "cvalue": "",
        "checked": true
    },
    {
        "cname": " +93 阿富汗 (Afghanistan)",
        "cvalue": "+93",
        "checked": true
    },
    {
        "cname": " +355 阿尔巴尼亚 (Albania)",
        "cvalue": "+355",
        "checked": true
    },
    {
        "cname": " +213 阿尔及利亚 (Algeria)",
        "cvalue": "+213",
        "checked": true
    },
    {
        "cname": " +376 安道尔 (Andorra)",
        "cvalue": "+376",
        "checked": true
    },
    {
        "cname": " +244 安哥拉 (Angola)",
        "cvalue": "+244",
        "checked": true
    },
    {
        "cname": " +1264 安圭拉 (Anguilla)",
        "cvalue": "+1264",
        "checked": true
    },
    {
        "cname": " +1268 安提瓜和巴布达 (Antigua and Barbuda)",
        "cvalue": "+1268",
        "checked": true
    },
    {
        "cname": " +54 阿根廷 (Argentina)",
        "cvalue": "+54",
        "checked": true
    },
    {
        "cname": " +374 亚美尼亚 (Armenia)",
        "cvalue": "+374",
        "checked": true
    },
    {
        "cname": " +61 澳大利亚 (Australia)",
        "cvalue": "+61",
        "checked": true
    },
    {
        "cname": " +43 奥地利 (Austria)",
        "cvalue": "+43",
        "checked": true
    },
    {
        "cname": " +994 阿塞拜疆 (Azerbaijan)",
        "cvalue": "+994",
        "checked": true
    },
    {
        "cname": " +880 孟加拉 (Bangladesh)",
        "cvalue": "+880",
        "checked": true
    },
    {
        "cname": " +973 巴林 (Bahrain)",
        "cvalue": "+973",
        "checked": true
    },
    {
        "cname": " +1242 巴哈马 (Bahamas)",
        "cvalue": "+1242",
        "checked": true
    },
    {
        "cname": " +1246 巴巴多斯 (Barbados)",
        "cvalue": "+1246",
        "checked": true
    },
    {
        "cname": " +375 白俄罗斯 (Belarus)",
        "cvalue": "+375",
        "checked": true
    },
    {
        "cname": " +32 比利时 (Belgium)",
        "cvalue": "+32",
        "checked": true
    },
    {
        "cname": " +501 伯利兹 (Belize)",
        "cvalue": "+501",
        "checked": true
    },
    {
        "cname": " +229 贝宁 (Benin)",
        "cvalue": "+229",
        "checked": true
    },
    {
        "cname": " +1441 百慕大 (Bermuda)",
        "cvalue": "+1441",
        "checked": true
    },
    {
        "cname": " +591 玻利维亚 (Bolivia)",
        "cvalue": "+591",
        "checked": true
    },
    {
        "cname": " +267 博茨瓦纳 (Botswana)",
        "cvalue": "+267",
        "checked": true
    },
    {
        "cname": " +55 巴西 (Brazil)",
        "cvalue": "+55",
        "checked": true
    },
    {
        "cname": " +673 文莱 (Brunei)",
        "cvalue": "+673",
        "checked": true
    },
    {
        "cname": " +359 保加利亚 (Bulgaria)",
        "cvalue": "+359",
        "checked": true
    },
    {
        "cname": " +226 布基纳法索 (Burkina Faso)",
        "cvalue": "+226",
        "checked": true
    },
    {
        "cname": " +257 布隆迪 (Burundi)",
        "cvalue": "+257",
        "checked": true
    },
    {
        "cname": " +855 柬埔寨 (Cambodia)",
        "cvalue": "+855",
        "checked": true
    },
    {
        "cname": " +237 喀麦隆 (Cameroon)",
        "cvalue": "+237",
        "checked": true
    },
    {
        "cname": " +1 加拿大 (Canada)",
        "cvalue": "+1",
        "checked": true
    },
    {
        "cname": " +236 中非 (Central African Republic)",
        "cvalue": "+236",
        "checked": true
    },
    {
        "cname": " +235 乍得 (Chad)",
        "cvalue": "+235",
        "checked": true
    },
    {
        "cname": " +56 智利 (Chile)",
        "cvalue": "+56",
        "checked": true
    },
    {
        "cname": " +57 哥伦比亚 (Colombia)",
        "cvalue": "+57",
        "checked": true
    },
    {
        "cname": " +242 刚果（金） (Congo (Congo-Kinshasa))",
        "cvalue": "+242",
        "checked": true
    },
    {
        "cname": " +242 刚果 (Congo)",
        "cvalue": "+242",
        "checked": true
    },
    {
        "cname": " +682 库克群岛 (Cook Islands)",
        "cvalue": "+682",
        "checked": true
    },
    {
        "cname": " +506 哥斯达黎加 (Costa Rica)",
        "cvalue": "+506",
        "checked": true
    },
    {
        "cname": " +225 科特迪瓦 (Cote D’Ivoire)",
        "cvalue": "+225",
        "checked": true
    },
    {
        "cname": " +86 中国 (China)",
        "cvalue": "+86",
        "checked": true
    },
    {
        "cname": " +53 古巴 (Cuba)",
        "cvalue": "+53",
        "checked": true
    },
    {
        "cname": " +420 捷克 (Czech)",
        "cvalue": "+420",
        "checked": true
    },
    {
        "cname": " +357 塞浦路斯 (Cyprus)",
        "cvalue": "+357",
        "checked": true
    },
    {
        "cname": " +45 丹麦 (Denmark)",
        "cvalue": "+45",
        "checked": true
    },
    {
        "cname": " +253 吉布提 (Djibouti)",
        "cvalue": "+253",
        "checked": true
    },
    {
        "cname": " +1890 多米尼加 (Dominica)",
        "cvalue": "+1890",
        "checked": true
    },
    {
        "cname": " +593 厄瓜多尔 (Ecuador)",
        "cvalue": "+593",
        "checked": true
    },
    {
        "cname": " +20 埃及 (Egypt)",
        "cvalue": "+20",
        "checked": true
    },
    {
        "cname": " +224 赤道几内亚 (Equatorial Guinea)",
        "cvalue": "+224",
        "checked": true
    },
    {
        "cname": " +372 爱沙尼亚 (Estonia)",
        "cvalue": "+372",
        "checked": true
    },
    {
        "cname": " +251 埃塞俄比亚 (Ethiopia)",
        "cvalue": "+251",
        "checked": true
    },
    {
        "cname": " +679 斐济 (Fiji)",
        "cvalue": "+679",
        "checked": true
    },
    {
        "cname": " +358 芬兰 (Finland)",
        "cvalue": "+358",
        "checked": true
    },
    {
        "cname": " +33 法国 (France)",
        "cvalue": "+33",
        "checked": true
    },
    {
        "cname": " +594 法属圭亚那 (Franch Guiana)",
        "cvalue": "+594",
        "checked": true
    },
    {
        "cname": " +241 加蓬 (Gabon)",
        "cvalue": "+241",
        "checked": true
    },
    {
        "cname": " +220 冈比亚 (Gambia)",
        "cvalue": "+220",
        "checked": true
    },
    {
        "cname": " +995 格鲁吉亚 (Georgia)",
        "cvalue": "+995",
        "checked": true
    },
    {
        "cname": " +49 德国 (Germany)",
        "cvalue": "+49",
        "checked": true
    },
    {
        "cname": " +233 加纳 (Ghana)",
        "cvalue": "+233",
        "checked": true
    },
    {
        "cname": " +350 直布罗陀 (Gibraltar)",
        "cvalue": "+350",
        "checked": true
    },
    {
        "cname": " +30 希腊 (Greece)",
        "cvalue": "+30",
        "checked": true
    },
    {
        "cname": " +1809 格林纳达 (Grenada)",
        "cvalue": "+1809",
        "checked": true
    },
    {
        "cname": " +1671 关岛 (Guam)",
        "cvalue": "+1671",
        "checked": true
    },
    {
        "cname": " +502 危地马拉 (Guatemala)",
        "cvalue": "+502",
        "checked": true
    },
    {
        "cname": " +224 几内亚 (Guinea)",
        "cvalue": "+224",
        "checked": true
    },
    {
        "cname": " +592 圭亚那 (Guyana)",
        "cvalue": "+592",
        "checked": true
    },
    {
        "cname": " +852 香港(中国) (Hong Kong)",
        "cvalue": "+852",
        "checked": true
    },
    {
        "cname": " +509 海地 (Haiti)",
        "cvalue": "+509",
        "checked": true
    },
    {
        "cname": " +504 洪都拉斯 (Honduras)",
        "cvalue": "+504",
        "checked": true
    },
    {
        "cname": " +36 匈牙利 (Hungary)",
        "cvalue": "+36",
        "checked": true
    },
    {
        "cname": " +354 冰岛 (Iceland)",
        "cvalue": "+354",
        "checked": true
    },
    {
        "cname": " +91 印度 (India)",
        "cvalue": "+91",
        "checked": true
    },
    {
        "cname": " +62 印度尼西亚 (Indonesia)",
        "cvalue": "+62",
        "checked": true
    },
    {
        "cname": " +98 伊朗 (Iran)",
        "cvalue": "+98",
        "checked": true
    },
    {
        "cname": " +964 伊拉克 (Iraq)",
        "cvalue": "+964",
        "checked": true
    },
    {
        "cname": " +353 爱尔兰 (Ireland)",
        "cvalue": "+353",
        "checked": true
    },
    {
        "cname": " +972 以色列 (Israel)",
        "cvalue": "+972",
        "checked": true
    },
    {
        "cname": " +39 意大利 (Italy)",
        "cvalue": "+39",
        "checked": true
    },
    {
        "cname": " +1876 牙买加 (Jamaica)",
        "cvalue": "+1876",
        "checked": true
    },
    {
        "cname": " +81 日本 (Japan)",
        "cvalue": "+81",
        "checked": true
    },
    {
        "cname": " +962 约旦 (Jordan)",
        "cvalue": "+962",
        "checked": true
    },
    {
        "cname": " +327 哈萨克斯坦 (Kazakhstan)",
        "cvalue": "+327",
        "checked": true
    },
    {
        "cname": " +254 肯尼亚 (Kenya)",
        "cvalue": "+254",
        "checked": true
    },
    {
        "cname": " +82 韩国 (Korea (South))",
        "cvalue": "+82",
        "checked": true
    },
    {
        "cname": " +850 朝鲜 (Korea (North))",
        "cvalue": "+850",
        "checked": true
    },
    {
        "cname": " +965 科威特 (Kuwait)",
        "cvalue": "+965",
        "checked": true
    },
    {
        "cname": " +331 吉尔吉斯斯坦 (Kyrgyzstan)",
        "cvalue": "+331",
        "checked": true
    },
    {
        "cname": " +856 老挝 (Laos)",
        "cvalue": "+856",
        "checked": true
    },
    {
        "cname": " +371 拉脱维亚 (Latvia)",
        "cvalue": "+371",
        "checked": true
    },
    {
        "cname": " +961 黎巴嫩 (Lebanon)",
        "cvalue": "+961",
        "checked": true
    },
    {
        "cname": " +266 莱索托 (Lesotho)",
        "cvalue": "+266",
        "checked": true
    },
    {
        "cname": " +231 利比里亚 (Liberia)",
        "cvalue": "+231",
        "checked": true
    },
    {
        "cname": " +218 利比亚 (Libya)",
        "cvalue": "+218",
        "checked": true
    },
    {
        "cname": " +423 列支敦士登 (Liechtenstein)",
        "cvalue": "+423",
        "checked": true
    },
    {
        "cname": " +370 立陶宛 (Lithuania)",
        "cvalue": "+370",
        "checked": true
    },
    {
        "cname": " +352 卢森堡 (Luxembourg)",
        "cvalue": "+352",
        "checked": true
    },
    {
        "cname": " +853 澳门(中国) (Macau)",
        "cvalue": "+853",
        "checked": true
    },
    {
        "cname": " +265 马拉维 (Malawi)",
        "cvalue": "+265",
        "checked": true
    },
    {
        "cname": " +60 马来西亚 (Malaysia)",
        "cvalue": "+60",
        "checked": true
    },
    {
        "cname": " +261 马达加斯加 (Madagascar)",
        "cvalue": "+261",
        "checked": true
    },
    {
        "cname": " +960 马尔代夫 (Maldives)",
        "cvalue": "+960",
        "checked": true
    },
    {
        "cname": " +223 马里 (Mali)",
        "cvalue": "+223",
        "checked": true
    },
    {
        "cname": " +356 马耳他 (Malta)",
        "cvalue": "+356",
        "checked": true
    },
    {
        "cname": " +596 马提尼克岛 (Martinique)",
        "cvalue": "+596",
        "checked": true
    },
    {
        "cname": " +230 毛里求斯 (Mauritius)",
        "cvalue": "+230",
        "checked": true
    },
    {
        "cname": " +52 墨西哥 (Mexico)",
        "cvalue": "+52",
        "checked": true
    },
    {
        "cname": " +373 摩尔多瓦 (Moldova)",
        "cvalue": "+373",
        "checked": true
    },
    {
        "cname": " +377 摩纳哥 (Monaco)",
        "cvalue": "+377",
        "checked": true
    },
    {
        "cname": " +976 蒙古 (Mongolia)",
        "cvalue": "+976",
        "checked": true
    },
    {
        "cname": " +1664 蒙特塞拉特 (Montserrat)",
        "cvalue": "+1664",
        "checked": true
    },
    {
        "cname": " +212 摩洛哥 (Morocco)",
        "cvalue": "+212",
        "checked": true
    },
    {
        "cname": " +258 莫桑比克 (Mozambique)",
        "cvalue": "+258",
        "checked": true
    },
    {
        "cname": " +95 缅甸 (Myanmar)",
        "cvalue": "+95",
        "checked": true
    },
    {
        "cname": " +264 纳米比亚 (Namibia)",
        "cvalue": "+264",
        "checked": true
    },
    {
        "cname": " +674 瑙鲁 (Nauru)",
        "cvalue": "+674",
        "checked": true
    },
    {
        "cname": " +977 尼泊尔 (Nepal)",
        "cvalue": "+977",
        "checked": true
    },
    {
        "cname": " +31 荷兰 (Netherlands)",
        "cvalue": "+31",
        "checked": true
    },
    {
        "cname": " +64 新西兰 (New Zealand)",
        "cvalue": "+64",
        "checked": true
    },
    {
        "cname": " +505 尼加拉瓜 (Nicaragua)",
        "cvalue": "+505",
        "checked": true
    },
    {
        "cname": " +227 尼日尔 (Niger)",
        "cvalue": "+227",
        "checked": true
    },
    {
        "cname": " +234 尼日利亚 (Nigeria)",
        "cvalue": "+234",
        "checked": true
    },
    {
        "cname": " +47 挪威 (Norway)",
        "cvalue": "+47",
        "checked": true
    },
    {
        "cname": " +968 阿曼 (Oman)",
        "cvalue": "+968",
        "checked": true
    },
    {
        "cname": " +92 巴基斯坦 (Pakistan)",
        "cvalue": "+92",
        "checked": true
    },
    {
        "cname": " +507 巴拿马 (Panama)",
        "cvalue": "+507",
        "checked": true
    },
    {
        "cname": " +675 巴布亚新几内亚 (Papua New Guinea)",
        "cvalue": "+675",
        "checked": true
    },
    {
        "cname": " +595 巴拉圭 (Paraguay)",
        "cvalue": "+595",
        "checked": true
    },
    {
        "cname": " +51 秘鲁 (Peru)",
        "cvalue": "+51",
        "checked": true
    },
    {
        "cname": " +63 菲律宾 (Philippines)",
        "cvalue": "+63",
        "checked": true
    },
    {
        "cname": " +48 波兰 (Poland)",
        "cvalue": "+48",
        "checked": true
    },
    {
        "cname": " +351 葡萄牙 (Portugal)",
        "cvalue": "+351",
        "checked": true
    },
    {
        "cname": " +1787 波多黎各 (Puerto Rico)",
        "cvalue": "+1787",
        "checked": true
    },
    {
        "cname": " +974 卡塔尔 (Qatar)",
        "cvalue": "+974",
        "checked": true
    },
    {
        "cname": " +262 留尼汪岛 (Reunion)",
        "cvalue": "+262",
        "checked": true
    },
    {
        "cname": " +40 罗马尼亚 (Romania)",
        "cvalue": "+40",
        "checked": true
    },
    {
        "cname": " +7 俄罗斯 (Russian Federation)",
        "cvalue": "+7",
        "checked": true
    },
    {
        "cname": " +1758 圣卢西亚 (Saint Lucia)",
        "cvalue": "+1758",
        "checked": true
    },
    {
        "cname": " +1784 圣文森特和格林纳丁斯 (Saint Vincent and the Grenadines)",
        "cvalue": "+1784",
        "checked": true
    },
    {
        "cname": " +503 萨尔瓦多 (El Salvador)",
        "cvalue": "+503",
        "checked": true
    },
    {
        "cname": " +684 萨摩亚 (Samoa)",
        "cvalue": "+684",
        "checked": true
    },
    {
        "cname": " +378 圣马力诺 (San Marino)",
        "cvalue": "+378",
        "checked": true
    },
    {
        "cname": " +239 圣多美和普林西比 (Sao Tome and Principe)",
        "cvalue": "+239",
        "checked": true
    },
    {
        "cname": " +966 沙特阿拉伯 (Saudi Arabia)",
        "cvalue": "+966",
        "checked": true
    },
    {
        "cname": " +221 塞内加尔 (Senegal)",
        "cvalue": "+221",
        "checked": true
    },
    {
        "cname": " +248 塞舌尔 (Seychelles)",
        "cvalue": "+248",
        "checked": true
    },
    {
        "cname": " +232 塞拉利昂 (Sierra Leone)",
        "cvalue": "+232",
        "checked": true
    },
    {
        "cname": " +65 新加坡 (Singapore)",
        "cvalue": "+65",
        "checked": true
    },
    {
        "cname": " +421 斯洛伐克 (Slovakia)",
        "cvalue": "+421",
        "checked": true
    },
    {
        "cname": " +386 斯洛文尼亚 (Slovenia)",
        "cvalue": "+386",
        "checked": true
    },
    {
        "cname": " +677 所罗门群岛 (Solomon Islands)",
        "cvalue": "+677",
        "checked": true
    },
    {
        "cname": " +252 索马里 (Somalia)",
        "cvalue": "+252",
        "checked": true
    },
    {
        "cname": " +27 南非 (South Africa)",
        "cvalue": "+27",
        "checked": true
    },
    {
        "cname": " +34 西班牙 (Spain)",
        "cvalue": "+34",
        "checked": true
    },
    {
        "cname": " +94 斯里兰卡 (Sri Lanka)",
        "cvalue": "+94",
        "checked": true
    },
    {
        "cname": " +249 苏丹 (Sudan)",
        "cvalue": "+249",
        "checked": true
    },
    {
        "cname": " +597 苏里南 (Suriname)",
        "cvalue": "+597",
        "checked": true
    },
    {
        "cname": " +268 斯威士兰 (Swaziland)",
        "cvalue": "+268",
        "checked": true
    },
    {
        "cname": " +46 瑞典 (Sweden)",
        "cvalue": "+46",
        "checked": true
    },
    {
        "cname": " +41 瑞士 (Switzerland)",
        "cvalue": "+41",
        "checked": true
    },
    {
        "cname": " +963 叙利亚 (Syria)",
        "cvalue": "+963",
        "checked": true
    },
    {
        "cname": " +992 塔吉克斯坦 (Tajikistan)",
        "cvalue": "+992",
        "checked": true
    },
    {
        "cname": " +255 坦桑尼亚 (Tanzania)",
        "cvalue": "+255",
        "checked": true
    },
    {
        "cname": " +886 台湾(中国) (Taiwan)",
        "cvalue": "+886",
        "checked": true
    },
    {
        "cname": " +66 泰国 (Thailand)",
        "cvalue": "+66",
        "checked": true
    },
    {
        "cname": " +1809 特立尼达和多巴哥 (Trinidad and Tobago)",
        "cvalue": "+1809",
        "checked": true
    },
    {
        "cname": " +228 多哥 (Togo)",
        "cvalue": "+228",
        "checked": true
    },
    {
        "cname": " +676 汤加 (Tonga)",
        "cvalue": "+676",
        "checked": true
    },
    {
        "cname": " +216 突尼斯 (Tunisia)",
        "cvalue": "+216",
        "checked": true
    },
    {
        "cname": " +90 土耳其 (Turkey)",
        "cvalue": "+90",
        "checked": true
    },
    {
        "cname": " +993 土库曼斯坦 (Turkmenistan)",
        "cvalue": "+993",
        "checked": true
    },
    {
        "cname": " +256 乌干达 (Uganda)",
        "cvalue": "+256",
        "checked": true
    },
    {
        "cname": " +380 乌克兰 (Ukraine)",
        "cvalue": "+380",
        "checked": true
    },
    {
        "cname": " +971 阿拉伯联合酋长国 (United Arab Emirates)",
        "cvalue": "+971",
        "checked": true
    },
    {
        "cname": " +44 英国 (United Kingdom)",
        "cvalue": "+44",
        "checked": true
    },
    {
        "cname": " +1 美国 (United States)",
        "cvalue": "+1",
        "checked": true
    },
    {
        "cname": " +598 乌拉圭 (Uruguay)",
        "cvalue": "+598",
        "checked": true
    },
    {
        "cname": " +233 乌兹别克斯坦 (Uzbekistan)",
        "cvalue": "+233",
        "checked": true
    },
    {
        "cname": " +58 委内瑞拉 (Venezuela)",
        "cvalue": "+58",
        "checked": true
    },
    {
        "cname": " +84 越南 (Vietnam)",
        "cvalue": "+84",
        "checked": true
    },
    {
        "cname": " +967 也门 (Yemen)",
        "cvalue": "+967",
        "checked": true
    },
    {
        "cname": " +381 南斯拉夫 (Yugoslavia)",
        "cvalue": "+381",
        "checked": true
    },
    {
        "cname": " +260 赞比亚 (Zambia)",
        "cvalue": "+260",
        "checked": true
    },
    {
        "cname": " +263 津巴布韦 (Zimbabwe)",
        "cvalue": "+263",
        "checked": true
    }
  ]})


  const clickMethod = (e)=>{
  let itemindex = e.target.value
  let items =phoneAreaCode.data;
  let item = items[itemindex];
  items.forEach(it=>{it.checked = false});
  item.checked = true
}
  const dataList = reactive({data:[
    {cname:"邮箱验证",labelLevel:"一级验证",inused:true,
    labelTips:"单笔限额 <b>500USDT</b>，日交易限额 <b>1000 USDT</b>",
    labeldesp:"请验证您的注册邮箱真实性，提升账户验证等级，增强账户安全性，信息验证后不可修改。",
    verified:false,clabel:"账户邮箱：",cvalue:userinfo.data.email, vicon:"icon-youxiang1",
    checked:false,visibal:false,cblabel:"请验证您注册的账户邮箱，点击获取验证码，我们将发送验证码到您的邮箱，发送成功请登录您的邮箱，找到我们的邮件查看验证码。"
  },
    {cname:"手机验证",labelLevel:" 二级验证",inused:false,
    labelTips:"单笔限额 <b>1000USDT</b>，日交易限额 <b>5000 USDT</b>",
    labeldesp:"请绑定您的常用手机号，提升账户验证等级，增强账户安全性，信息验证后不可修改。",
    verified:false,cvalue:"",vicon:"icon-shouji",
    checked:false,visibal:false,cblabel:"请绑定您的常用手机号，提升账户验证等级，增强账户安全性，信息验证后不可修改。"
 
  },
    {cname:"身份验证",labelLevel:" 三级验证",
    labelTips:"单笔限额 <b>10000USDT</b>，日交易限额 <b>50000 USDT</b>",
    labeldesp:"请验证您的身份信息，提升账户验证等级，增强账户安全性，信息验证后不可修改。",
    verified:false,cvalue:"",vicon:"icon-shenfenzheng",
    checked:false,visibal:false,cblabel:"请验证您注册的账户邮箱，点击获取验证码，我们将发送验证码到您的邮箱，发送成功请登录您的邮箱，找到我们的邮件查看验证码。"
  },
    {cname:"地址验证",labelLevel:" 四级验证",
    labelTips:"单笔限额 <b>50000USDT</b>，日交易限额 <b>100000 USDT</b>",
    labeldesp:"请验证您的地址信息，提升账户验证等级，增强账户安全性，信息验证后不可修改。",
    verified:false,cvalue:"",vicon:"icon-24gl-paperPlane",
    checked:false,visibal:false,cblabel:"请验证您注册的账户邮箱，点击获取验证码，我们将发送验证码到您的邮箱，发送成功请登录您的邮箱，找到我们的邮件查看验证码。"
  },
    {cname:"公司验证",labelLevel:" 五级验证",
    labelTips:"单笔限额 <b>100000USDT</b>，日交易限额 <b>1000000 USDT</b>",
    labeldesp:"请验证您的注册邮箱真实性，提升账户验证等级，增强账户安全性，信息验证后不可修改。",
    verified:false,cvalue:"",vicon:"icon-lv_zuanshi_fill",
    checked:false,visibal:false,cblabel:"请验证您注册的账户邮箱，点击获取验证码，我们将发送验证码到您的邮箱，发送成功请登录您的邮箱，找到我们的邮件查看验证码。"
  },
  ]})
  const listLength = dataList.data.length
  const btnClick = (item,itemindex)=>{
     item.visibal = true
  } 

  const bounceVisibal = ref(false)

</script>

<template>
  <div class="container ">
    <commonHeader ftitle="账户验证" />
   
    <div class="recharge-box-wrap bgbasecolor3">
        <div class="fontbasecolor">
            <h2>加入易优，和我们一起成长</h2>
            <h5>从这里开始，<br> 开启您的下一个数字货币交易巅峰。</h5>
        </div>
    </div>    
    <div class="deal-card-box bgwhite">
        <div  v-for="(it,index) in dataList.data" :key="index" class="timeline">
            <div v-if="it.inused&& index ==0">
              <van-popup v-model:show="it.visibal" position="top"  :closeable=true :style="{ padding: '30px' ,borderRadius:'8px'}">
                <div class="borderradius10 borderbox model-boxWrap">
                    <div class="model-title borderbottom fontdark font16">{{it.cname}}</div>
                    <div class="disflex padding20 content-box">
                      <div class="icon iconfont icon-shimingrenzheng font36 basecolor margintop10"></div>
                      <div class="font12 fontdark model-title-content">{{it.cblabel}}</div>
                    </div>  
                    <div  class="form-box">             
                      <div class="input-box">
                          <input  type="text" v-model="it.cvalue" class="borderbox  font14 input-item-fixed text-input" disabled />                    
                      </div>              
                      <div class="input-wrap borderbox  padding0  borderradius4 bordergrey  disflex font12 align-items-center margintop10">                        
                        <div class="input-box">
                            <input  type="number" class="borderbox  font14 input-item-fixed text-input" />                    
                        </div>
                        <div class="paddingbox2 bgbasecolor3 fontbasecolor fontbold">获取验证码</div>                
                      </div>
                      <button class="margintop20 vbtn fontbasecolor bgbasecolor3 font12">提交验证</button>                   
                    </div>      
                </div>
              </van-popup>
            </div>

            <div v-if="it.inused&& index ==1">
              <van-popup v-model:show="it.visibal" position="top"  :closeable=true :style="{ padding: '30px' ,borderRadius:'8px'}">
                <div class="borderradius10 borderbox model-boxWrap">
                    <div class="model-title borderbottom fontdark font16">{{it.cname}}</div>
                    <div class="disflex padding20 content-box">
                      <div class="icon iconfont icon-shimingrenzheng font36 basecolor margintop10"></div>
                      <div class="font12 fontdark model-title-content">{{it.cblabel}}</div>
                    </div>  
                    <div  class="form-box">   
                      
                      <div class="select-area disflex borderbox margintop10"> 
                          <div class="select-box borderbox">
                          <select  @change="(e)=>clickMethod(e)" class="select-item fontdark font16 borderbox input-focus">
                              <option v-for="(it,indexs) in phoneAreaCode.data" :key="it.cvalue" :value="indexs" :selected="it.checked">{{it.cname}}</option>               
                          </select>
                          </div>
                      </div>    

                      <div v-if="index === 1" class="input-box bordergrey margintop10">
                        <input  type="text" v-model="it.cvalue" class="borderbox  font14 input-item-fixed text-input" placeholder="亲输入手机号" />                    
                    
                      </div>
                      <div v-if="index == 0" class="input-box">
                          <input  type="text" v-model="it.cvalue" class="borderbox  font14 input-item-fixed text-input" disabled />                    
                      </div>              
                      <div class="input-wrap borderbox  padding0  borderradius4 bordergrey  disflex font12 align-items-center margintop10">                        
                        <div class="input-box">
                            <input  type="number" class="borderbox  font14 input-item-fixed text-input" placeholder="亲输入验证码"  />                    
                        </div>
                        <div class="paddingbox2 bgbasecolor3 fontbasecolor fontbold">获取验证码</div>                
                      </div>
                      <button class="margintop20 vbtn fontbasecolor bgbasecolor3 font12">提交验证</button>                   
                    </div>      
                </div>
              </van-popup>
            </div>



            <div v-if="it.inused" class="timeline-items boxborder">
              <div  :class='["timeline-item",index+1 === listLength ? "border-left-no":""]' >
                <div v-if="it.verified" class="ribbon-target bgbasecolor3 fontbasecolor disflex justify-spacecenter align-items-center font12">
					        <span class="ribbon-inner bgbasecolor3 fontbasecolor"></span>已验证
				        </div>
                <div class="timeline-media boxborder">
                  <b class="timeicon">
                    <div :class='["icon","iconfont",it.vicon,"font18"]'></div>
                  </b>
                </div>
                <div class="timeline-content boxborder">
                  <div class="timeblock disflex boxborder">
                    <div class="timeline-title boxborder">
                      <b class="font16 fontdark fontbold">{{it.cname}}</b>
                      <span  :class='["font12","label-inline",it.verified?"label-success":"label-light-danger"]'> {{it.labelLevel}}</span>
                    </div>
                  </div>
                  <div class="timeline-items boxborder font12 ">                    
                    <div class="basecolor" v-html="it.labelTips"></div>
                    <div class="fontdark margintop10">{{it.labeldesp}}</div> 
                    <button v-if="!it.verified" @click="()=>btnClick(it,index)" class="margintop20 vbtn-normal fontbasecolor bgbasecolor3 font12">开始验证</button>                   
                    <div v-else class="font12 fontgrey margintop10">
                        {{it.clabel}} {{it.cvalue}}
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
@import '../trans/common.scss';
@import '@/assets/css/transdtl.scss';
.bottomborder{
  border-bottom:1px solid #EBEDF3;
}
.timeline-item{
    margin-left: 20px !important;   
    padding: 0 0 15px 50px !important;
}
.timeline-media {left: -28px !important;}
.deal-card-box{padding-left: 1.4rem !important;padding-right: 1.4rem !important; }
.content-box{margin-top: 10px;}
.model-boxWrap{
  width: 322px; overflow: hidden;
  .model-title{padding-bottom:20px;}
 
  .model-title-content{padding-left: 20px;}
}

</style>
