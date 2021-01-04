import logMessage from './js/logger'
import {pagination} from './js/pagination'


import '../node_modules/jquery-ui/themes/base/all.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import $ from 'jquery';
import '../node_modules/bootstrap4-toggle/css/bootstrap4-toggle.min.css'
import 'bootstrap4-toggle'
import moment from 'moment'
import FileSaver from 'file-saver'
import datepickerFactory from 'jquery-datepicker';
import datepickerJAFactory from 'jquery-datepicker/i18n/jquery.ui.datepicker-zh-CN';
import './css/style.css'
var echarts = require('echarts');

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('chart'),{width:'auto'});
window.onresize = function() {
  myChart.resize();
};

datepickerFactory($);
datepickerJAFactory($);
$.datepicker.regional['zh-CH'];
$("#datetimepicker4").datepicker({
  dateFormat: "yy-mm-dd"
}).datepicker("setDate", new Date());

// Log message to console
logMessage('about page!!')
const serverAddr ='/'
const config = { 
  proxy:{
    host: '127.0.0.1',
    port: 8080
  }
}
const selectElement = document.querySelector('#deviceList')
const eventTable = document.querySelector("#eventTable")
const infoTable = document.querySelector("#infoTable")
const bindBtn  = document.querySelector("#bedBtn")
const excelBtn  = document.querySelector("#excelBtn")
pagination.init(document.querySelector("#pagination"),eventTable)

function findEvent(value,date){
  axios.post(serverAddr+'event',{
    type: value,
    date: date
  },config).then(res => {
    let data = res.data
    console.log(data)
    // eventTable.innerHTML=''
    pagination.setData(data)
    // dashboard.setData(data)
    // if(data.length >0){
    //   pagination.pageLength
    //   data.map((item,index) =>{
    //     eventTable.innerHTML+=`
    //       <tr>
    //         <th scope="row">${index}</th>
    //         <td>${item.timestamp}</td>
    //         <td>${item.timesLength} sec</td>
    //       </tr>
    //     `
    //   })
    // }
  }).catch(err => {
    console.log(err);
  });
}
//TODO EXCEL Download
excelBtn.addEventListener('click', (event) => {
  event.target.disabled = true
  $.ajax({
    type: "GET",
    url: serverAddr+'excel',
    xhrFields: { responseType: "blob" },
    data: {},
    success: function(data){
                let blob = new Blob([data], {type: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
                FileSaver.saveAs(blob, 'download.xlsx');
                event.target.disabled = false
              }
 })


  // axios.get(serverAddr+'excel',config).then(res => {
  //   alert("bed number bind success  bedNumber:"+res.data)
  //   event.target.disabled = false
  // }).catch(err => {
  //   console.log(err);
  //   alert("bed number bind failed")
  //   event.target.disabled = false
  // });
}); 

//TODO switch
$('#switch').change(function() {
  console.log($(this).prop('checked'));
  axios.post(serverAddr+'switch',{
    type: $(this).prop('checked')
  },config).then(res => {
    if(!$(this).prop('checked')){
      $('#switchRecord').bootstrapToggle('off')
    }
     console.log(res.data)
  }).catch(err => {
    console.log(err);
    alert("NN switch failed")
  });
})
$('#switchRecord').change(function() {
  console.log($(this).prop('checked'));
  axios.post(serverAddr+'switchRecord',{
    type: $(this).prop('checked')
  },config).then(res => {
    // alert(`record ${res.data.}`)
    console.log(res.data)
  }).catch(err => {
    console.log(err);
    alert("record switch failed")
  });
})

//TODO select
selectElement.addEventListener('change', (event) => {
   findEvent(event.target.value,$('#datetimepicker4').val())
}); 
$("#datetimepicker4").change(function(){
   console.log(selectElement.value,$(this).val())
   findEvent(selectElement.value,$(this).val()) 

})

//TODO bind 
bindBtn.addEventListener('click',(event)=>{
  let bedNumber = document.querySelector("#badNumber")
  console.log(bedNumber.value)
  if (bedNumber.value != ""){
    axios.post(serverAddr+'bindBed',{
      "bedNumber": bedNumber.value
    },config).then(res => {
      alert("bed number bind success  bedNumber:"+res.data)
    }).catch(err => {
      console.log(err);
      alert("bed number bind failed")
    });
  }else{
    alert("bed number is empty")
  }
})

//TODO info table
axios.get(serverAddr+'data',config)
.then(res =>{
    console.log("res",res)
    let data =res.data
    infoTable.innerHTML = ''
    deviceList.innerHTML =''
    data.map((item) =>{
      infoTable.innerHTML+=`
        <tr>
          <th scope="row">${item.type}</th>
          <td>${item.timesPerDay}</td>
          <td>${item.timesTotal}</td>
          <td>${item.timesAvgLength}</td>
        </tr>
      `
      deviceList.innerHTML+=`
          <option>${item.type}</option>
      `
    })
    findEvent(selectElement.querySelector("option:first-child").value,$('#datetimepicker4').val())
}).catch(err => {
    console.log(err);
})

axios.get(serverAddr+'chart',config)
.then(res =>{
    let data = res.data
    let showData = {}
    data.forEach(element => {
      let elementArr = []
      elementArr.length = 24
      elementArr.fill(0,0)
      element.event.filter(item => {
          elementArr[moment(item.timestamp).hour()] += 1
       })
      console.log(element.type,"elementArr",elementArr)
      showData[element.type]=elementArr
    });
    myChart.setOption(
      {
        title: {
            text: '當日各時段警報次數'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['NK_ALARM_HIGH', 'NK_ALARM_MED', 'NK2_ALARM_HIGH', 'NK2_ALARM_MED', 'Breather Alarm','Nurse Bell']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['零點', '一點', '兩點', '三點', '四點', '五點',
          '六點', '七點', '八點', '九點', '十點', '十一點',
          '十二點', '十三點', '十四點', '十五點', '十六點', '十七點',
          '十八點', '十九點', '二十點', '二十一點', '二十二點', '二十三點',]
        },
        yAxis: {
          type: 'value'
        },
        series: 
          [
            {
                name: 'NK_ALARM_HIGH',
                type: 'line',
                data : showData['NK_ALARM_HIGH']
            },
            {
                name: 'NK_ALARM_MED',
                type: 'line',
                data : showData['NK_ALARM_MED']
            },
            {
                name: 'NK2_ALARM_HIGH',
                type: 'line',
                data : showData['NK2_ALARM_HIGH']
            },
            {
                name: 'NK2_ALARM_MED',
                type: 'line',
                data : showData['NK2_ALARM_MED']
            },
            {
                name: 'Breather Alarm',
                type: 'line',
                data : showData['Breather Alarm']
            },
            {
                name: 'Nurse Bell',
                type: 'line',
                data : showData['Nurse Bell']
            }
        ]
        
      });

    myChart.getZr().on('mouseover', function (params) {
      var pointInPixel= [params.offsetX, params.offsetY];
	    if (myChart.containPixel('grid',pointInPixel) && params.target != undefined) {
            /*此处添加具体执行代码*/
              
            var pointInGrid=myChart.convertFromPixel({seriesIndex:params.target.seriesIndex},pointInPixel);
            //X轴序号
            var xIndex=pointInGrid[0];
  
              //获取当前图表的option
            var op=myChart.getOption();
  
            //   //获得图表中我们想要的数据
            var month = op.xAxis[0].data[xIndex];
            var value = op.series[params.target.seriesIndex].data[xIndex];
            var name = op.series[params.target.seriesIndex].name;
     
            // console.log(pointInGrid,xIndex)
            // console.log(op);
            // console.log(name,month+"："+value+"%");
            // console.log(data[params.target.seriesIndex],xIndex)

            // 該時段次數
            // console.log("該時段次數",value)
            // 該時段最長時長 和 最短時長 該時段平均緊報時長 該時段未有警報時長
            let maxInterval = 0
            let minInterval = Infinity
            let totalInterval = 0
            let noAlarmInterval = 3600 
            data[params.target.seriesIndex].event.filter(item => {
              if(moment(item.timestamp).hour() == xIndex){
                totalInterval += Number(item.timesLength)
                noAlarmInterval -= Number(item.timesLength)
                if(Number(item.timesLength) > maxInterval){
                   maxInterval = Number(item.timesLength )
                }
                if(Number(item.timesLength) < minInterval){
                  minInterval = Number(item.timesLength)
                }
              }
            })
            document.querySelector("#alarmType").innerHTML = name;
            document.querySelector("#alarmCount").innerHTML = `${data[params.target.seriesIndex].event.length}次`;
            document.querySelector("#alarmAvgCount").innerHTML = `${(data[params.target.seriesIndex].event.length!=0)?(data[params.target.seriesIndex].event.length/24).toFixed(2):0}次`;
            document.querySelector("#alarmIntervalCount").innerHTML = `${value}次`;

            document.querySelector("#maxInterval").innerHTML = `${maxInterval}秒`;
            document.querySelector("#minInterval").innerHTML = `${(minInterval != Infinity)?minInterval:0}秒`;
            document.querySelector("#avgInterval").innerHTML = `${(value != 0)?totalInterval/value:0}秒`;
            document.querySelector("#noAlarmInterval").innerHTML = `${(noAlarmInterval/3600).toFixed(2)}小時`;

            // console.log("該時段最長時長",maxInterval,"該時段最短時長",minInterval,"該時段平均緊報時長",totalInterval/value,"該時段未有警報時長",noAlarmInterval/3600)
            
        }

    });
}).catch(err => {
    console.log(err);
})

axios.get(serverAddr+'bedInfo',config)
.then(res =>{
  let bedNumber = document.querySelector("#badNumber");
  (res.data.number == "")?alert("bed is not bound yet"):bedNumber.value=res.data.number;
  (res.data.NN == "open")?$('#switch').bootstrapToggle('on'):$('#switch').bootstrapToggle('off');
  (res.data.record == "open")?$('#switchRecord').bootstrapToggle('on'):$('#switchRecord').bootstrapToggle('off');
}).catch(err => {
    console.log(err);
})


if (module.hot)       // eslint-disable-line no-undef
  module.hot.accept() // eslint-disable-line no-undef