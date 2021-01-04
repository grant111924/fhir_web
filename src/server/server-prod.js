import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import {exec} from 'child_process'
import moment from 'moment'
import Excel from 'exceljs/dist/es5/exceljs.browser'
import {apiSearchDiagnosticReport,apiSearchObservation,apiSearchPatient} from './api'

const app = express(),
        DIST_DIR = __dirname,
        HTML_FILE = path.join(DIST_DIR, 'index.html');

const PORT = process.env.PORT || 8818;
const jsonParser = bodyParser.json();
const urlencoded = bodyParser.urlencoded({extended:true});
            
app.use(express.static(DIST_DIR))            
app.use(urlencoded)
app.use(jsonParser)

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
app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})