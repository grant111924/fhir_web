
import '../node_modules/jquery-ui/themes/base/all.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/font-awesome/css/font-awesome.css'
import '../node_modules/daterangepicker/daterangepicker.css'
import '../node_modules/bootstrap4-toggle/css/bootstrap4-toggle.min.css'
import './css/style.css'

import $ from 'jquery';
import 'bootstrap4-toggle'
import 'bootstrap'
import 'daterangepicker'
import {patientPagination,observationPagination,diagnosticReportPagination} from './js/pagination_new'
import {patientTable,observationTable,diagnosticReportTable} from './js/table'
import {searchBox} from './js/searchBox'


//document element
const resourceTypeList = document.querySelector("#resourceTypeList")
const searchTable = document.querySelector("#searchTable")
const searchPagination = document.querySelector("#searchPagination")
const searchDiv = document.querySelector("#searchDiv")
const searchAddBtn = document.querySelector("#searchAddBtn")
const searchClearBtn = document.querySelector("#searchClearBtn")
const searchQueryBtn = document.querySelector("#searchQueryBtn")

const resourceTypeArray = ["Patient","Observation","DiagnosticReport"]
const resourceObject = {
    "Patient":{
        'searchType':{
            '_id':{
                'name':"病人ID",
                'use':false,
                'type':'string'
            },
            'gender':{
                'name':"性別",
                'use':false,
                'type':'radio'
            },
            'birthdate':{
                'name':"生日",
                'use':false,
                'type':'date'
            },
            'identifier':{
                'name':"病歷號",
                'use':false,
                'type':'string'
            }
        }
    },
    "Observation":{
        'searchType':{
            '_id':{
                'name':"檢驗ID",
                'use':false,
                'type':'string'
            },
            'Observation_patient':{
                'name':"病歷號",
                'use':false,
                'type':'string'
            },
            'patient':{
                'name':"病人ID",
                'use':false,
                'type':'string'
            },
            'code_text':{
                'name':"檢測項目名稱",
                'use':false,
                'type':'string'
            },
            'date':{
                'name':"檢驗日期",
                'use':false,
                'type':'date'
            },
        }
    },
    "DiagnosticReport":{
        'searchType':{
            '_id':{
                'name':"報告ID",
                'use':false,
                'type':'string'
            },
            'patient':{
                'name':"病人ID",
                'use':false,
                'type':'string'
            },
            'DiagnosticReport_patient':{
                'name':"病歷號",
                'use':false,
                'type':'string'
            },
            'date':{
                'name':"發報告日期",
                'use':false,
                'type':'date'
            },
        }
    }
}

const searchPatientTable = new patientTable(searchTable,["病患ID","病歷號","姓名","性別","出生日","下載"])
const searchPatientPagination = new patientPagination(searchPagination,searchTable,searchPatientTable,10)

const searchObservationTable = new observationTable(searchTable,["檢驗ID","病患ID","報告日期","檢測項目","檢測值","檢測單位"])
const searchObservationPagination = new observationPagination(searchPagination,searchTable,searchObservationTable,10)

const searchDiagnosticReportTable = new diagnosticReportTable(searchTable,["報告ID","病患ID","報告日期"])
const searchDiagnosticReportPagination = new diagnosticReportPagination(searchPagination,searchTable,searchDiagnosticReportTable,10)

const searchDivBox = new searchBox(searchDiv,searchAddBtn,searchClearBtn,searchQueryBtn,resourceTypeList)



$('#loadingModal').modal({
    keyboard:false,
    backdrop:'static',
    show:false
})
// $('#imageModal').modal({
//     // keyboard:false,
//     backdrop:'static',
//     show:false
// })

//SELECT 目標資源
resourceTypeArray.map((item) => {
    resourceTypeList.innerHTML += `<option>${item}</option>`
})

searchDivBox.render(resourceObject,searchPatientPagination,searchObservationPagination,searchDiagnosticReportPagination,resourceTypeArray)
searchDivBox.watch()



   

   