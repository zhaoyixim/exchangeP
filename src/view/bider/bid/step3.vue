<script lang="ts" setup>
import { reactive, ref } from "@vue/reactivity";
import { TimePickerColumnType, showToast } from 'vant';
const props = defineProps({
  stepData:{}
})
/**控制数据 */
const nowDate = new Date();
const nowYear = nowDate.getFullYear();
const nowMonth = nowDate.getMonth();
const nowDay = nowDate.getDate();
const nowHour = nowDate.getHours();
const nowMins = nowDate.getMinutes() + 1;
const nowSeconds = nowDate.getSeconds();
const currentDate = ref([nowYear.toString(), nowMonth.toString(), nowDay.toString()]);
const currentTime = ref([nowHour.toString(), nowMins.toString(), '00']);
const endDate = ref([nowYear.toString(), nowMonth.toString(), nowDay.toString()]);
const endTime = ref([nowHour.toString(), nowMins.toString(), '00']);
const minHour = ref(nowHour)
const minMinute = ref(nowMins)
const minSecond = ref(nowSeconds)

const columnsType :TimePickerColumnType[] = ['hour', 'minute', 'second'];
/* 提交数据*/
let formdata = reactive({data:{
        step:3,
        orderStartDate:"",
        orderStartTime:"",
        orderEndDate:"",
        orderEndTime:"",     
      }
}) 
//设置默认值
formdata.data.orderStartDate = currentDate.value.join("/");
formdata.data.orderStartTime = currentTime.value.join(":");
formdata.data.orderEndDate = currentDate.value.join("/");
formdata.data.orderEndTime =  currentTime.value.join(":");
const stepCon = reactive({
    startData:{
        showPikcer:false,
        minData: nowDate,
        maxDate: new Date(nowYear, nowMonth + 2 , nowDay),
    },
    startTime:{
        showPikcer:false,
        minData: nowDate,
        maxDate: new Date(nowYear, nowMonth + 2 , nowDay),
    },
    endData:{
        showPikcer:false,
        minData: nowDate,
    },
    endTime:{
        showPikcer:false,
        
    },

})

const setStartDate = (arrowkey2:string)=>{
    stepCon[arrowkey2].showPikcer = !stepCon[arrowkey2].showPikcer
}
const startDateConfirm = (event,arrowkey:string,arrowkey2:string) => {
    if(arrowkey == 'orderStartTime' || arrowkey == 'orderEndTime'){
        formdata.data[arrowkey] = event.selectedValues.join(":");
        if(arrowkey == 'orderStartTime') {
            minHour.value = event.selectedValues[0];
            minMinute.value = parseInt(event.selectedValues[1]);
            minSecond.value = parseInt(event.selectedValues[2]);
            formdata.data.orderEndTime = [minHour.value,minMinute.value,minSecond.value].join(":");
        }
    
    }else{
        formdata.data[arrowkey] = event.selectedValues.join("/");
        if(arrowkey == 'orderStartDate') {
            stepCon.endData.minData = new Date(parseInt(event.selectedValues[0]),parseInt(event.selectedValues[1]),parseInt(event.selectedValues[2]));
            formdata.data.orderEndDate = [event.selectedValues[0],event.selectedValues[1],event.selectedValues[2]].join("/");
        }
    } 
    setStartDate(arrowkey2)
}
const startDateCancel = (event,arrowkey:string,arrowkey2:string) => {
    stepCon[arrowkey].minData = nowDate
    setStartDate(arrowkey2)
}
const emit = defineEmits(["stepClick","stepBeforeClick"]);
/**
 *  第三步提交
 */
const stepClick = () =>{
    console.log("asdadsf")
   emit("stepClick",formdata)
}
const stepbeforeClick = () =>{
   emit("stepBeforeClick",formdata)
}
</script>
<template>
    <div>
        <div class="padding20 margintop30">
            <div class="fontdark font17">设置出价开放周期 <span class="fontB5 font14">(设置订单开放时间段)</span></div> 
            

            <div class="fontdark font14 margintop20">订单开始时间</div> 
            <div class="input-wrap disflex font12 align-items-center margintop10">
                <div class="paddingbox2  bgbasecolor7">日期</div>               
                <div class="flex">
                    <van-popup v-model:show="stepCon.startData.showPikcer" round position="bottom">                        
                        <van-date-picker
                        v-model="currentDate"
                        :min-date="stepCon.startData.minData"
                        :max-date="stepCon.startData.maxDate"
                        @confirm="(e)=>startDateConfirm(e,'orderStartDate','startData')"
                        @cancel="(e)=>startDateCancel(e,'startData','startData')"
                        />                    
                    </van-popup>
                    <input  type="text" @focus="()=>setStartDate('startData')" v-model="formdata.data.orderStartDate"  class="borderbox font14 input-item text-input bordergrey"/>                    
                </div>                    
            </div> 
            <div class="input-wrap disflex font12 align-items-center margintop10">
                <div class="paddingbox2  bgbasecolor7">时间</div>               
                <div class="flex">
                    <van-popup v-model:show="stepCon.startTime.showPikcer" round position="bottom">                         
                        <van-time-picker 
                        title="选择时间"
                        v-model="currentTime"
                        :columns-type="columnsType"
                        @confirm="(e)=>startDateConfirm(e,'orderStartTime','startTime')"
                        @cancel="(e)=>startDateCancel(e,'startTime','startTime')"
                        />        
                    </van-popup>
                    <input  type="text" @focus="()=>setStartDate('startTime')" v-model="formdata.data.orderStartTime"  class="borderbox font14 input-item text-input bordergrey"/>                    
                </div>                             
            </div>
            <div class="margintop10 font666 font14 margintop30">
              您的订单将于{{formdata.data.orderStartDate}}-{{formdata.data.orderStartTime}}开始发布至平台
            </div>

            <div class="fontdark font14 margintop20">订单结束时间</div> 
            <div class="input-wrap disflex font12 align-items-center margintop10">
                <div class="paddingbox2  bgbasecolor7">日期</div>               
                <div class="flex">
                    <van-popup v-model:show="stepCon.endData.showPikcer" round position="bottom">                        
                        <van-date-picker
                        v-model="endDate"
                        :min-date="stepCon.endData.minData"
                        @confirm="(e)=>startDateConfirm(e,'orderEndDate','endData')"
                        @cancel="(e)=>startDateCancel(e,'endData','endData')"
                        />                    
                    </van-popup>
                    <input  type="text" @focus="()=>setStartDate('endData')" v-model="formdata.data.orderEndDate"  class="borderbox font14 input-item text-input bordergrey"/>                    
                </div>                    
            </div> 
            <div class="input-wrap disflex font12 align-items-center margintop10">
                <div class="paddingbox2  bgbasecolor7">时间</div>               
                <div class="flex">
                    <van-popup v-model:show="stepCon.endTime.showPikcer" round position="bottom">                         
                        <van-time-picker 
                        title="选择时间"
                        :min-hour="minHour"
                        :min-minute="minMinute"
                        :min-second="minSecond"
                        v-model="endTime"
                        :columns-type="columnsType"
                        @confirm="(e)=>startDateConfirm(e,'orderEndTime','endTime')"
                        @cancel="(e)=>startDateCancel(e,'endTime','endTime')"
                        />        
                    </van-popup>
                    <input  type="text" @focus="()=>setStartDate('endTime')" v-model="formdata.data.orderEndTime"  class="borderbox font14 input-item text-input bordergrey"/>                    
                </div>                             
            </div>
            <div class="margintop10 font666 font14 margintop30">
              您的订单将于{{formdata.data.orderEndDate}}-{{formdata.data.orderEndTime}}结束发布平台
            </div>

            <div class="margintop10 fontB5 font12">
              此为设置订单开始结束的有效期，过期会自动关闭订单
            </div>        
        </div>

        <div class="padding20 disflex justify-spacebetween margintop30 paddingbottom100" >
            <button @click="()=>stepbeforeClick()" class="vbtn basecolor bgbasecolor4 font14">上一步</button>              
            <button @click="()=>stepClick()" class="vbtn basecolor bgbasecolor4 font14">下一步</button>                   
        </div>


    </div>

</template>
<style lang="scss" scoped>
.pickerWrap{position: absolute;}
</style>