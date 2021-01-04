import {apiSearchDiagnosticReport, apiSearchObservation, apiSearchPatient,apiTest} from './api'

class searchBtn{
    constructor(element,targetDiv){
        this.element = element
        this.cardGroup = targetDiv
    }
}

class searchBox {
    constructor(cardGroup,searchAddBtn,searchClearBtn,searchQueryBtn,resourceSelect){
        this.cardGroup = cardGroup
        this.addBtn = new addBtn(searchAddBtn,this.cardGroup)
        this.clearBtn = new clearBtn(searchClearBtn,this.cardGroup)
        this.queryBtn = new queryBtn(searchQueryBtn,this.cardGroup)
        this.resourceSelect = resourceSelect
        this.resourceType = ""
        this.sendData = {}
    }
    render(obj,searchPatientPagination,searchObservationPagination,searchDiagnosticReportPagination,resourceTypeArray){
        this.obj = obj
        this.searchPatientPagination = searchPatientPagination
        this.searchObservationPagination = searchObservationPagination
        this.searchDiagnosticReportPagination = searchDiagnosticReportPagination
        this.resourceTypeArray =resourceTypeArray
        this.searchPatientPagination.send("") 
    }

    watch(){
        let self = this 
        // first time
        this.addBtn.watch(self.obj[this.resourceTypeArray[0]])
        self.resourceType = this.resourceTypeArray[0]

        this.resourceSelect.addEventListener("change",(event) => {
            $('#loadingModal').modal('show')
            if(event.target.value == this.resourceTypeArray[0]){
                this.searchPatientPagination.send("")
            }else if(event.target.value == this.resourceTypeArray[1]){
                this.searchObservationPagination.send("")
            }else if(event.target.value == this.resourceTypeArray[2]){
                this.searchDiagnosticReportPagination.send("")
            }
            //listen use different condation

            self.resourceType = event.target.value
            self.addBtn.watch(self.obj[event.target.value])
        })

        this.clearBtn.watch(this)

        this.queryBtn.watch(this)

    }

    send(){
        let strData = ""
        this.sendData.list.forEach((item,index) => {
            if(item.value != ""){
                // if(item.type.indexOf("_") > 0){
                //     item.type = `_include=${item.type.split("_")[0]}:${item.type.split("_")[1]}`
                // }
                if(index == 0){
                    if(item.type == 'date'|| item.type == 'birthdate' ){
                      strData += `${item.type}=ge${item.value.split(' - ')[0]}&${item.type}=le${item.value.split(' - ')[1]}`
                    }else{
                      strData += `${item.type}=${item.value}`
                    }
                  }else{
                      if(item.type == 'date' || item.type == 'birthdate'){
                          strData += `&${item.type}=ge${item.value.split(' - ')[0]}&${item.type}=le${item.value.split(' - ')[1]}`
                      }else{
                          strData += `&${item.type}=${item.value}`
                      }
                  }
            }
        })
        console.log(strData,this.searchDiagnosticReportPagination.linkId)
        console.log(this.sendData,this.resourceTypeArray,this.sendData.url)
        if(this.sendData.url == this.resourceTypeArray[0]){
            this.searchPatientPagination.send(strData)
        }else if(this.sendData.url == this.resourceTypeArray[1]){
            this.searchObservationPagination.send(strData)
        }else if(this.sendData.url == this.resourceTypeArray[2]){
            this.searchDiagnosticReportPagination.send(strData)
        }
    }

   

    
}

class clearBtn extends searchBtn {
    constructor(element,targetDiv){
        super(element,targetDiv)
    }
    watch(parent){
        let self = this
        this.element.addEventListener('click',function(e){
            self.cardGroup.querySelectorAll('.card').forEach((cardItem,index) => {
                let attr =  cardItem.getAttribute('value')
                parent.addBtn.cardVarGroup[attr].use = false
                cardItem.remove()
            })
        })
    }
}

class addBtn extends searchBtn {
    constructor(element,targetDiv){
        super(element,targetDiv)
    }
    render(obj){
        this.obj = obj
        this.meau = this.element.nextElementSibling
        emtpyHtml(this.meau)
        emtpyHtml(this.cardGroup)
        this.cardVarGroup = {}
        Object.values(obj.searchType).map((item,index) => {
            this.meau.innerHTML += `<a class="dropdown-item" href="#"  value=${Object.keys(obj.searchType)[index]} > ${item.name}</a>`
            if(item.type == "date"){
                console.log(Object.keys(obj.searchType)[index])
                this.cardVarGroup[Object.keys(obj.searchType)[index]] = new dateRangeCard(this.cardGroup,item,Object.keys(obj.searchType)[index])
            }else if(item.type == "string"){
                this.cardVarGroup[Object.keys(obj.searchType)[index]] = new stringCard(this.cardGroup,item,Object.keys(obj.searchType)[index])
            }else if(item.type == "radio"){
                this.cardVarGroup[Object.keys(obj.searchType)[index]]= new radioCard(this.cardGroup,item,Object.keys(obj.searchType)[index])
            }
        })
        
    }
    watch(obj){
        this.render(obj)
        let self = this

        //create card
        this.meau.querySelectorAll(".dropdown-item").forEach((element,index) => {
            element.addEventListener('click',function(e){
                let attr = e.target.getAttribute('value')
                if(!self.cardVarGroup[attr].use){ 
                    self.cardVarGroup[attr].use = true
                    self.cardVarGroup[attr].render()
                    
                    //watch delete
                    self.cardGroup.querySelectorAll('.card').forEach((cardItem,index) => {
                        cardItem.querySelector('.fa-minus-circle').addEventListener('click',function(e){
                            e.target.closest('.card').remove()
                            let attr =  e.target.closest('.card').getAttribute('value')
                            self.cardVarGroup[attr].use = false
                        })
                    })
                    
                }else{
                    console.log("已使用")
                }
            })  
        });
        
        
    }
}

class queryBtn extends searchBtn {
    constructor(element,targetDiv){
        super(element,targetDiv)
    }
    watch(parent){
        let self = this
        this.element.addEventListener('click',function(e){
            console.log("uery click")
            parent.sendData.url = parent.resourceType
            parent.sendData.list =[]
            self.element.closest('.border').querySelectorAll('.card').forEach(cardItem => {
                console.log(cardItem.getAttribute('value'))
                console.log(cardItem.querySelector('input').type)
                let value = cardItem.querySelector('input').value
                if(cardItem.querySelector('input').type == "radio"){
                    value = cardItem.querySelector('input:checked').value
                }

                parent.sendData.list.push({
                    'type':cardItem.getAttribute('value'),
                    'value':value
                })
            })
            parent.send()
        })
    }
}

class card {
    constructor(parentDiv,obj,index){
        this.parentDiv = parentDiv
        this.obj = obj
        this.index = index
        this.value = ""
        this.html = `
            <div class="card bg-light border-dark" value="${this.index}" name="card${this.index}">
                <div class="card-header">
                    <i class="fa fa-minus-circle mr-2" aria-hidden="true"></i>
                </div>
                <div class="card-body">
                    <h5 class="card-title ">${obj.name}</h5>
                </div>
            </div>
        `
        this.use = false
    }
    render(){
        // this.parentDiv.innerHTML += this.html
        this.parentDiv.insertAdjacentHTML('beforeend',this.html);

    }
}

class dateRangeCard extends card {
    constructor(parentDiv,obj,index){
        super(parentDiv,obj,index)
    }
    render(){
        super.render()
        let functionHtml = `
             <input type="text" class="mx-auto mb-2daterangepicker" name="daterangepicker${this.index}"></input>
        `
        // input[name="datetimes"]
        this.element = this.parentDiv.querySelector(`[name=card${this.index}]`)
        this.element.querySelector('.card-body').insertAdjacentHTML('beforeend',functionHtml);
        $(`[name=daterangepicker${this.index}]`).daterangepicker({
            // timePicker: true,
            locale:{
                format: 'YYYY-MM-DD'
            }
        })

        $(`[name=daterangepicker${this.index}]`).on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
        });
      
        $(`[name=daterangepicker${this.index}]`).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
    }
}

class radioCard extends card{
    constructor(parentDiv,obj,index){
        super(parentDiv,obj,index)
    }
    render(){
        super.render()
        let functionHtml = `
        <div class="row mx-5">
            <div class="form-check form-check-inline">
                <input type="radio" class="form-check-input " name="gender" value="male" id="male" checked></input>
                <label class="form-check-label" for="male">男</label>
            </div>
            
            <div class="form-check form-check-inline">
                <input type="radio" class="form-check-input " name="gender" value="female" id="female" ></input>
                <label class="form-check-label" for="female">女</label>
            </div>
        </div>
        `
        this.element = this.parentDiv.querySelector(`[name=card${this.index}]`)
        this.element.querySelector('.card-body').insertAdjacentHTML('beforeend',functionHtml);
        // $(`.datepicker`).datepicker()
    }
}

class stringCard extends card{
    constructor(parentDiv,obj,index){
        super(parentDiv,obj,index)
    }
    render(){
        super.render()
        let functionHtml = `
            <input type="text" class="mx-auto mb-2"></input>
        `
        this.element = this.parentDiv.querySelector(`[name=card${this.index}]`)
        this.element.querySelector('.card-body').insertAdjacentHTML('beforeend',functionHtml);
        // $(`.datepicker`).datepicker()
    }
}

function emtpyHtml(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}
export {searchBtn,addBtn,searchBox}