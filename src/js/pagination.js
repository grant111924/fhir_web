class pagination {
    constructor(){
        this.html = ` 
                    <nav  aria-label="Page navigation" id="nav">
                        <ul class="pagination">
                            <li class="page-item disabled" id="pre">
                                <a class="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span class="sr-only">Previous</span>
                                </a>
                            </li>
                            <li class="page-item" id="next">
                                <a class="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span class="sr-only">Next</span>
                                </a>
                            </li>
                        </ul>
                    </nav>`
    }
    init(div,targetDiv,limit=10){
        this.initRender = true
        this.pageLength =  0
        this.limit =limit
        this.data = []
        this.div = div
        this.targetDiv = targetDiv
        this.div.innerHTML = this.html
        console.log(this.div)
    }
    htmlTemplating(){
        console.log('pageLength',this.pageLength)
        console.log('currentPage',this.currentPage)
        let html = ''
        let currentPageCss = `<strong>${this.currentPage}</strong>`
        if(this.currentPage >= this.pageLength-5 || this.pageLength < 5){
            let start = (this.pageLength < 5)?1:this.pageLength-5
            for(let i = start; i <= this.pageLength; i++ ){
                
                html += `<li class="page-item page-number"><a class="page-link" href="#">${(i==this.currentPage)?currentPageCss:i}</a></li>`
            }
        }else{
            for(let i = 0; i <= 5; i++){
                if(i <= 2){
                    html += `<li class="page-item page-number"><a class="page-link " href="#">${(i==0)?currentPageCss:this.currentPage+i}</a></li>`
                }else if(i==3){
                    html += `<li class="page-item page-number"><a class="page-link" href="#">...</a></li>`
                }else if(i >= 4){
                    html += `<li class="page-item page-number"><a class="page-link" href="#">${this.currentPage+i}</a></li>`
                }
            }
        }
        
       return html
    }
    setData(data){
        this.data = data
        if(this.data.length > 0){
            this.div.classList.remove("d-none");
            this.pageLength = (this.data.length%this.limit == 0)?parseInt(this.data.length/this.limit):parseInt(this.data.length/this.limit)+1
        }else{
            this.div.classList.add("d-none");
        }
        this.currentPage = 1
        this.rendering()
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
            this.initRender = false
        }
    }
    rendering(){
        if(this.currentPage == this.pageLength){
            this.div.querySelector("li#next").classList.add("disabled")
        }else{
            this.div.querySelector("li#next").classList.remove("disabled")
        }
        if(this.currentPage == 1){
            this.div.querySelector("li#pre").classList.add("disabled")
        }else{
            this.div.querySelector("li#pre").classList.remove("disabled")
        }

        //pagination render
        this.div.querySelectorAll(".page-number").forEach(function(item) {
            item.remove();
         });
        this.div.querySelector("li#pre").insertAdjacentHTML('afterend',this.htmlTemplating());
        this.watch()
        

        //table render
        let start = (this.currentPage-1)*this.limit
        let end = this.currentPage*this.limit
        let html = ''
        for(let i=start; i<end; i++){
            if(this.data[i] != undefined){
                let item = this.data[i]
                html += `
                    <tr>
                        <th scope="row">${i+1}</th>
                        <td>${item.timestamp}</td>
                        <td>${item.timesLength} sec</td>
                    </tr>
                    `
            }
        }
        this.targetDiv.innerHTML = ""
        this.targetDiv.innerHTML = html
        
    }
}
// exports.pagination = new pagination()
export {pagination}