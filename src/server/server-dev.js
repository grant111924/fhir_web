import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.client.config.js'
import bodyParser, { raw } from 'body-parser'
import {apiSearchDiagnosticReport,apiSearchObservation,apiSearchPatient} from './api'
import axios from 'axios';
import moment from 'moment'
import Excel from 'exceljs/dist/es5/exceljs.browser'
import { createSecretKey } from 'crypto'
import { send } from 'process'


// eslint-disable-next-line no-unused-vars
const app = express(),
      DIST_DIR = __dirname,
      HTML_FILE = path.join(DIST_DIR, 'index.html'),
      compiler = webpack(config)

const PORT = process.env.PORT || 8765
const jsonParser = bodyParser.json();
const urlencoded = bodyParser.urlencoded({extended:true});
const queryParser = (Obj) => {
  let str = ''
  Object.keys(Obj).forEach((key,index)=> {
    if(index == 0) {
      str += `?${key}=${Obj[key]}`
    }else{
      str += `&${key}=${Obj[key]}`
    }
  })
  str = str.replace(',',"&date=")
  return str
}

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.use(urlencoded)
app.use(jsonParser)

app.get('/history/Patient', (req,res) => {
  let sendStr = ''
  Object.keys(req.query).forEach((key,index)=> {
    if(index == 0) {
      sendStr += `?${key}=${req.query[key]}`
    }else{
      sendStr += `&${key}=${req.query[key]}`
    }
  })
  res.send(sendStr)
})


app.get('/history/Observation', async (req,res) => {
  let reqData = req.query
  let sendStr = ''
  if (reqData.Observation_patient != undefined){
      let patientId = await apiSearchPatient(`?identifier=${reqData.Observation_patient }`).then(res => {
         return res.data.entry[0].resource.id
      }).catch(err => {
         console.log(err)
      })
      delete reqData.Observation_patient
      reqData.patient = patientId
  }

  if (reqData.code_text != undefined){
    console.log("reqData.code_text",reqData.code_text)
    reqData['code:text'] = encodeURI(reqData.code_text)
    delete reqData.code_text
  }

  sendStr = queryParser(reqData)
  console.log(sendStr)
  let data = await apiSearchObservation(sendStr).then(res => {
      return res.data
  }).catch(err => {
      return err
  })
  reqData._summary = "count"
  sendStr = queryParser(reqData)
  let total = await apiSearchObservation(sendStr).then(res => {
    return res.data.total
  }).catch(err => {
      return err
  }) 

  data.total = total
  res.json(data)
})

app.get('/history/DiagnosticReport', async (req,res) => {
  let reqData = req.query
  let sendStr = ''
  if (reqData.DiagnosticReport_patient != undefined){
      let patientId = await apiSearchPatient(`?identifier=${reqData.DiagnosticReport_patient }`).then(res => {
         return res.data.entry[0].resource.id
      }).catch(err => {
         console.log(err)
      })
      delete reqData.DiagnosticReport_patient
      reqData.patient = patientId
  }

  sendStr = queryParser(reqData)
  console.log(sendStr)
  let data = await apiSearchDiagnosticReport(sendStr).then(res => {
      return res.data
  }).catch(err => {
      return err
  })

  reqData._summary = "count"
  sendStr = queryParser(reqData)
  let total = await apiSearchDiagnosticReport(sendStr).then(res => {
    return res.data.total
  }).catch(err => {
      return err
  }) 

  data.total = total
  res.json(data)
})

app.post('/Patient/:id', async (req,res) => {
  let data = {'data': req.params.id} 
  let patient = await apiSearchPatient(`/${req.params.id}`).then(res =>{
    return res.data
  }).catch(err =>{
    console.log(err)
  })
  let responesCount= await apiSearchObservation(`?patient=${req.params.id}&_count=0`).then(res =>{
      return res.data.total
  }).catch(err =>{
    console.log(err)
  })
  let result = await apiSearchObservation(`?patient=${req.params.id}&_count=${responesCount}`).then(res => {
      return res.data.entry
  }).catch(err =>{
    console.log(err)
  })
  var workBook = new Excel.Workbook();
  let sheet = workBook.addWorksheet("total");
  // // Case	EpisodeDate	Code	Name	Value	Range	Units	Description
  sheet.columns =[
    {header:"Case",key:'case',width:10},
    {header:"EpisodeDate",key:'date',width:30},
    {header:"Code",key:'code',width:30},
    {header:"Name",key:'name',width:30},
    {header:"Value",key:'value',width:30},
    {header:"Range",key:'range',width:10},
    {header:"Units",key:'units',width:10},
    {header:"Description",key:'description',width:30},
  ]
  result.sort((x,y) => {
      let a = new Date(x.resource.issued.split('T')[0]),
          b = new Date(y.resource.issued.split('T')[0]);
      return a-b ;
  })
  result.forEach(item => {
     let Obj = {
       case: patient.identifier[0].value,
       date: item.resource.issued.split('T')[0],
       code: item.resource.code.coding[0].display.split('_')[0],
       name: item.resource.code.coding[0].display,
       value: item.resource.valueString,
       range: '-',
       units: '-',
       description:''
     }
     sheet.addRow(Obj)
  });

  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition','attachment; filename=download.xlsx')

  workBook.xlsx.write(res).then(function(){
    console.log("res end")
    res.end()
  })
})

app.use(function(req, res, next){
  res.status(404);
  res.json({
    error:'Not found'
  })
})

app.use(function(err,req,res,next){
  res.status(err.status || 500);
  res.json({
    error:err.message
  })
  return;
})

app.get('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    console.log(err,result)
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})





app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})
