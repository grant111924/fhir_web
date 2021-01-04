import {apiDownload,apiImage} from './api'
import FileSaver from 'file-saver'
class table {
    constructor(div,headNameList){
        this.div = div
        this.thead = (arr) => {
            let th = ""
            arr.forEach(function(item,index){
                th += `<th>${item}</th>`
            })
            return `<thead class="thead-dark"><tr>${th}</tr></thead>` 
        }
        this.headNameList = headNameList
    }
}

class patientTable extends table {
    constructor(targetDiv,headNameList){
        super(targetDiv,headNameList)
    }
    render(data){
        this.div.innerHTML  = ""
        let tbody = ""
        this.data = data
        if(this.data.length > 0){
            this.data.forEach((item) => {
                tbody += `
                    <tr>
                        <td>${item.resource.id}</td>
                        <td>${item.resource.identifier[0].value}</td>
                        <td>${item.resource.name[0].text}</td>
                        <td>${(item.resource.gender == "male")?"男":"女"}</td>
                        <td>${item.resource.birthDate}</td>
                        <td>
                            <button class="btn btn-outline-success csv">
                                <i class="fa fa-file-excel-o"></i>
                            </button>
                            <button class="btn btn-outline-warning ai">
                                <i class="fa fa-file-photo-o"></i>
                            </button>
                        </td>
                    </tr>
                `
            })
        }
        this.div.innerHTML += this.thead(this.headNameList)
        this.div.innerHTML += `<tbody>${tbody}</tbody>`
        $('#loadingModal').modal('hide')
        this.watch()
    }
    watch(){
        this.div.querySelectorAll('.csv').forEach((btn) => {
            btn.addEventListener('click',function(e){
                let patientId = e.target.closest('tr').querySelectorAll('td:first-child')[0].innerHTML;
                console.log("病人流水號",patientId) 
                apiDownload(`/${patientId}`).then(res => {
                    if(res.status == 200){
                        console.log(res)
                        let blob = new Blob([res.data],{type:'vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
                        FileSaver.saveAs(blob,'download.xlsx')
                    }
                    
                }).catch(err => {
                    console.log(err)
                }) 
            })
        })
        this.div.querySelectorAll('.ai').forEach((btn) => {
            btn.addEventListener('click',function(e){
                let patientId = e.target.closest('tr').querySelectorAll('td:first-child')[0].innerHTML;
                console.log("病人流水號 ai",patientId) 
                $('#imageModal').modal('show')
                document.getElementById("imageModal").querySelector('.image').src = ""
                document.getElementById("imageModal").querySelector('.image').src = `http://localhost:4000/?id=${patientId}`
            })
        })
    }
}

class observationTable extends table {
    constructor(targetDiv,headNameList){
        super(targetDiv,headNameList)
    }
    render(data){
        this.div.innerHTML  = ""
        let tbody = ""
        this.data = data
    
        if(this.data.length > 0){
            this.data.forEach((item) => {
                // console.log(item.resource.valueString,item.resource.valueQuantity)
                let value = "", unit = "-"
                if(item.resource.valueString != undefined){
                    value = item.resource.valueString
                }
                if(item.resource.valueQuantity != undefined){
                    value = item.resource.valueQuantity.value
                    unit = item.resource.valueQuantity.unit
                }
                tbody += `
                    <tr>
                        <td>${item.resource.id}</td>
                        <td>${item.resource.subject.reference}</td>
                        <td>${item.resource.issued}</td>
                        <td>${item.resource.code.coding[0].display}</td>
                        <td>${value}</td>
                        <td>${unit}</td>
                    </tr>
                `
            })
        }
        this.div.innerHTML += this.thead(this.headNameList)
        this.div.innerHTML += `<tbody>${tbody}</tbody>`
        $('#loadingModal').modal('hide')

    }
}

class diagnosticReportTable extends table {
    constructor(targetDiv,headNameList){
        super(targetDiv,headNameList)
    }
    render(data){
        this.div.innerHTML  = ""
        let tbody = ""
        this.data = data
        if(this.data.length > 0){
            this.data.forEach((item) => {
                tbody += `
                    <tr>
                        <td>${item.resource.id}</td>
                        <td>${item.resource.subject.reference}</td>
                        <td>${item.resource.issued}</td>
                    </tr>
                `
            })
        }
        this.div.innerHTML += this.thead(this.headNameList)
        this.div.innerHTML += `<tbody>${tbody}</tbody>`
        $('#loadingModal').modal('hide')

    }
}
export {patientTable,observationTable,diagnosticReportTable}