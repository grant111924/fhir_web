import {apiSearch, apiSearchDiagnosticReport, apiSearchObservation, apiSearchPatient,apiSearchObservation2,apiSearchDiagnosticReport2} from './api'

class pagination{
    constructor(div,targetDiv,table,limit=10){
        this.html = ` 
                    <nav  aria-label="Page navigation" id="nav">
                        <ul class="pagination">
                            <li class="page-item" id="preStart">
                                <a class="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">
                                    <i class="fa fa-angle-double-left"></i>
                                </span>
                                <span class="sr-only">Previous</span>
                                </a>
                            </li>
                            <li class="page-item disabled" id="pre">
                                <a class="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">
                                    <i class="fa fa-angle-left"></i>
                                </span>
                                <span class="sr-only">Previous</span>
                                </a>
                            </li>
                            <li class="page-item" id="next">
                                <a class="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">
                                    <i class="fa fa-angle-right"></i>
                                </span>
                                <span class="sr-only">Next</span>
                                </a>
                            </li>
                            <li class="page-item" id="nextEnd">
                                <a class="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">
                                    <i class="fa fa-angle-double-right"></i>
                                </span>
                                <span class="sr-only">Next</span>
                                </a>
                            </li>
                        </ul>
                    </nav>`
        
        this.templateHtml = ""
        this.initRender = true
        this.linkId = ""
        this.pageLength =  0
        this.currentCount = 0
        this.limit =limit
        this.div = div
        this.targetDiv = targetDiv
        this.table = table
        this.div.innerHTML = this.html
    }

    htmlTemplating(){
        console.log('pageLength',this.pageLength)
        console.log('dataCount',this.dataCount)
        console.log("div",this.div)

        // console.log('currentPage',this.currentPage)
        let html = ''
        let currentPageCss = `<strong>${this.currentPage}</strong>`
        if(this.currentPage >= this.pageLength-5 || this.pageLength < 5){
            let start = (this.pageLength <= 5)?1:this.pageLength-5
            for(let i = start; i <= this.pageLength; i++ ){
                html += `<li class="page-item page-number"><a class="page-link" href="#">${(i==this.currentPage)?currentPageCss:i}</a></li>`
            }
        }else{
            
            for(let i = 0; i < 6; i++){
                if(i <= 1){
                    html += `<li class="page-item page-number"><a class="page-link " href="#">${(i==0)?currentPageCss:this.currentPage+i}</a></li>`
                }else if(i == 3){
                    html += `<li class="page-item page-number"><a class="page-link" href="#">...</a></li>`
                }else if(i >= 4){
                    html += `<li class="page-item page-number"><a class="page-link" href="#">${this.pageLength-5+i}</a></li>`
                }
            }
        }
        
        this.templateHtml = html
        // return html
    }

    watch(){
        let self = this
        this.div.querySelectorAll(".page-number").forEach(function(element){
            element.addEventListener("click",function(){
                if(!isNaN(parseInt(element.querySelector('a').text))){
                    if(parseInt(element.querySelector('a').text) <= self.pageLength){
                        self.currentPage = parseInt(element.querySelector('a').text);
                        self.rendering();
                    }
                }
            })
        })
        if(this.initRender){
            this.div.querySelector("#pre").addEventListener('click',function(){
                console.log("pre")
                if(self.currentPage-1 >= 1){
                    self.currentPage -= 1
                    self.rendering();
                }
            })
            this.div.querySelector("#next").addEventListener('click',function(){
                console.log("next")
                if(self.currentPage+1 <= self.pageLength){
                    self.currentPage += 1
                    self.rendering();
                }
            })
            this.div.querySelector("#preStart").addEventListener('click',function(){
                console.log("preStart")
                if(self.currentPage-1 >= 1){
                    self.currentPage = 1
                    self.rendering();
                }
            })
            this.div.querySelector("#nextEnd").addEventListener('click',function(){
                console.log("nextEnd")
                if(self.currentPage+1 <= self.pageLength){
                    self.currentPage = self.pageLength
                    self.rendering();
                }
            })
            this.initRender = false
        }
    }

    rendering(){
        if(this.initRender){
            if(this.dataCount > 0){
                this.div.classList.remove("d-none");
                this.pageLength = (this.dataCount%this.limit == 0)?parseInt(this.dataCount/this.limit)-1:parseInt(this.dataCount/this.limit)+1
                console.log("this.pageLength",this.pageLength)
            }else{
                this.div.classList.add("d-none");
            }
            this.currentPage = 1
        }

        if(this.currentPage == this.pageLength){
            this.div.querySelector("li#next").classList.add("disabled")
            this.div.querySelector("li#nextEnd").classList.add("disabled")
        }else{
            this.div.querySelector("li#next").classList.remove("disabled")
            this.div.querySelector("li#nextEnd").classList.remove("disabled")
        }
        if(this.currentPage == 1){
            this.div.querySelector("li#pre").classList.add("disabled")
            this.div.querySelector("li#preStart").classList.add("disabled")
        }else{
            this.div.querySelector("li#pre").classList.remove("disabled")
            this.div.querySelector("li#preStart").classList.remove("disabled")
        }

        //pagination render
        this.div.querySelectorAll(".page-number").forEach(function(item) {
            item.remove();
         });
        this.htmlTemplating()
        this.div.querySelector("li#pre").insertAdjacentHTML('afterend',this.templateHtml);
        this.watch()

    }

    
}

class patientPagination extends pagination{
    constructor(div,targetDiv,table,limit=10){
        super(div,targetDiv,table,limit=10)
    }
    send(strData){
        $('#loadingModal').modal('show')
        console.log("strData", strData)
        let str = ''
        if(strData == ""){
            this.url =  '/_history'
            str = `${this.url}?_count=0`
        }else{
            this.url = ''
            str =  '?'+strData+'&_count=0'
        }
        this.strData = strData
        apiSearchPatient(str).then(res => {
            if(res.status == 200){
                this.initRender = true
                this.linkId_p = res.data.id
                this.dataCount = res.data.total
                this.type = res.data.type
                this.rendering()
            }
        }).catch(err => {
            console.log(err) 
        }) 
    }
    send_feature(str){

    }
    htmlTemplating(){
        super.htmlTemplating()
    }
    watch(){
        super.watch()
    }
    rendering(){
        super.rendering()
        console.log(this.initRender,this.linkId_p)
        // this.tableRender()
        if(!this.initRender){
            this.tableRender()
        }
    }
    tableRender(){
        let self = this
        let str = ""
        this.currentCount = this.currentPage*this.limit

        if (this.strData == ""){
            str = `${this.url}?_getpages=${this.linkId_p}&_getpagesoffset=${this.currentCount}&_count=${this.limit}`
        }else{
            str = `${this.url}?${this.strData}&_getpagesoffset=${this.currentCount}&_count=${this.limit}`
        }
        console.log(str)
        apiSearchPatient(str).then(res => {
            if(res.status == 200){
                console.log(res,this.currentCount)
                if(res.data.total == 0){
                    self.table.render([])
                }else{
                    self.table.render(res.data.entry)
                }
            }
        }).catch(err => {
            console.log(err)
        }) 
    }
}

class observationPagination extends pagination{
    constructor(div,targetDiv,table,limit=10){
        super(div,targetDiv,table,limit=10)
    }
    send(strData){
        $('#loadingModal').modal('show')
        console.log("strData", strData)
        this.strData = strData
        console.log(this.strData)
        apiSearchObservation2(`?${strData}`).then(res => {
            if(res.status == 200){
                console.log(res.data.id)
                this.initRender = true
                this.linkId_o = res.data.id
                this.dataCount = res.data.total
                this.type = res.data.type
                this.rendering()
            }
        }).catch(err => {
            console.log(err)
        }) 
    }
    htmlTemplating(){
        super.htmlTemplating()
    }
    watch(){
        super.watch()
    }
    rendering(){
        super.rendering()
        console.log(this.initRender,this.linkId_o)
        if(!this.initRender){
            this.tableRender()
        }
    }
    tableRender(){
        let self = this
        let str = ""
        this.currentCount = (this.currentPage-1)*this.limit
        str = `?_getpages=${this.linkId_o}&_getpagesoffset=${this.currentCount}&_count=${this.limit}&_pretty=true&_bundletype=searchset`
        console.log(str)
        apiSearch(str).then(res => {
            if(res.status == 200){
                console.log(res,this.currentCount)
                if(res.data.total == 0){
                    self.table.render([])
                }else{
                    self.table.render(res.data.entry)
                }
            }
        }).catch(err => {
            console.log(err)
        }) 
    }
}
 
class diagnosticReportPagination extends pagination{
    constructor(div,targetDiv,table,limit=10){
        super(div,targetDiv,table,limit=10)
    }
    send(strData){
        $('#loadingModal').modal('show')
        this.strData = strData
        console.log(this.strData)
        apiSearchDiagnosticReport2(`?${this.strData}`).then(res => {
            if(res.status == 200){
                this.initRender = true
                this.linkId_d = res.data.id
                this.dataCount = res.data.total
                this.type = res.data.type
                this.rendering()
            }
        }).catch(err => {
            console.log(err)
        }) 
    }
    htmlTemplating(){
        super.htmlTemplating()
    }
    watch(){
        super.watch()
    }
    rendering(){
        super.rendering()
        console.log(this.initRender,this.linkId_d)
        if(!this.initRender){
            console.log(this.initRender,"table render")
            this.tableRender()
        }
    }
    tableRender(){
        let self = this
        let str = ''
        this.currentCount = (this.currentPage-1)*this.limit
        str = `?_getpages=${this.linkId_d}&_getpagesoffset=${this.currentCount}&_count=${this.limit}&_pretty=true&_bundletype=searchset`
        console.log(str)
        apiSearch(str).then(res => {
            if(res.status == 200){
                console.log(res,this.currentCount)
                if(res.data.total == 0){
                    self.table.render([])
                }else{
                    self.table.render(res.data.entry)
                }
            }
        }).catch(err => {
            console.log(err)
        }) 
    }
}
export {pagination,patientPagination,observationPagination,diagnosticReportPagination}