$(document).ready(function() {
   // $('.parsley-examples').parsley();
});



function services (services) {
    tpl = '';
    if(services.length > 0){
        tpl = '<div class="card-body border-top">'
        tpl += `<div class="left-timeline  pl-4">`
        tpl += `<ul class="list-unstyled events mb-0">`

    }

services.forEach(function (service, index) {
       /* tpl += `<div class="row mt-2">
        <div class="col-md-2 text-center">
        
        <a href="/tasks/view/${service.task_id}">
        <div class="icon-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span>Acesar</span>
        </div> </a>

        </div>
        <div class="col-md-10">
            
              
                <label class="form-check-label" for="task2">
                    ${service.service}
                    <br><small> ${service.description}</small>
                </label>
                <p class="fs-13 text-muted">${moment(service.created).fromNow()} em ${moment(service.created).format("DD/MM/YYYY HH:mm:ss")}</p>
         
        </div>
            </div>`*/
            tpl += `    <li class="event-list">
                                                       
                                                            <div class="media">
                                                                <div class="event-date text-center mr-4">
                                                                    <div class="bg-soft-primary p-1 rounded text-primary font-size-14">
                                                                        ${moment(service.created).fromNow()}</div>
                                                                        
                                                                </div>
                                                                <div class="media-body ml-2">
                                                                
                                                                    <h6 class="font-size-15 mt-0 mb-1">${service.service} <a href="/tasks/view/${service.task_id}"> <svg style="float:right" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> </a></h6>
                                                                    <p class="text-muted font-size-14">${service.description}. <br><small><strong>Em ${moment(service.created).format("DD/MM/YYYY HH:mm")}.</strong></small></p>
                                                                
                                                                    </div>
                                                            </div>
                                                      
                                                    </li>
                                                    
                                               `
    })

    tpl += ` </ul> </div></div>`
    
return tpl


}


    

function tecnicos(tecnicos) {
    var tpl = ''
    
    if(tecnicos != false){
        tpl = `<hr class="mt-2 mb-2"><span class="fs-12 mt-2 mb-1 bold text-dark">${(tecnicos.length> 1) ? `Técnicos atendendo:`:`Técnico atendendo:` } </span>`
        tecnicos.forEach(function (tecnico, index) {
            tpl += `<span class="badge badge-soft-secondary fs-13">${tecnico.name}</span>`
        })
        
    }

    return tpl
}



function waranty(start){
  
    

    if( moment().diff(start, 'days') >= 365){
         return `<label class="badge badge-soft-danger">Sem Garantia</label>`
    }else{
         return `<label class="badge badge-soft-success">Equipamento em Garantia</label>`
    }

}

function tplte(row) {

    return `<div class="col-xl-6 col-lg-6">
    <div class="card">
        
        <div class="card-body">
            
           
        
            <p class="text-success text-uppercase  mb-2"><i class="uil uil-map-pin-alt text-dark"></i><span class="badge badge-soft-primary" style="margin-left:5px;">${row.centro_custo}</span></p>
            <h5 class="mt-1 mb-1"><span class="text-dark fs-17 dots">${row.registration} - ${row.name}</span></h5>
            <span class="badge badge-soft-secondary mt-1">${row.orgao}</span> </h5>
            <p class="text-muted mb-1 mt-2  ">
           Responsável: <b>${row.responsavel}</b>
            </p>
            <p class="text-muted mb-1 mt-1  ">
           Situação: <b>${row.situacao}</b>
            </p>


            
                 
         
        </div>
        <div class="card-body border-top">
            <div class="row align-items-center">
                <div class="col-sm-auto">
                    <ul class="list-inline mb-0">
                        <li class="list-inline-item pe-2">
                            <span class="text-muted d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" title="Due date">
                                <i class="uil uil-calender me-1"></i>Adquirido ${moment(row.data_aquisicao).fromNow()}
                            </span>
                        </li>
                       
                        <li class="list-inline-item">
                            <span class="text-muted d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" title="Comments">
                                <i class="uil uil-eye"></i> R$ ${row.valor_atualizado}
                            </span>
                        </li>

                        <li class="list-inline-item">
                            <span class="text-muted d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" title="Comments">
                                <i class="uil uil-shield-question"></i> ${waranty(row.data_aquisicao)}
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="col offset-sm-1">
                    
                </div>
            </div>
        </div>
 
        ${services(row.services)}
     
        
    </div>
    <!-- end card -->
</div>`

}

function showPatrimonio(data){

    console.log(data)

    $('.load').hide()

        if(data){

            var tpl = ""
            data.forEach(function (row, index) {
                tpl += tplte(row)
            })
        
            $(".patrimonio").empty().append(tpl)

        }else{

            $(".patrimonio").empty().append(`
            
            <div class="col-12 text-center">
                                
                                        <h4 class="header-title mt-3 pt-3 mb-3" style="font-size:50px !important">😅</h4>
                                        <p class="sub-header">
                                           Busque pela Plaqueta
                                        </p>

                                 
                            </div>
            `)
        }

   
 

}


initPatrimonio('')
function initPatrimonio(term){
    $(".tarefas").empty()

    var data = {
        term: $('#busca').val()
      }
//http://localhost:3000/api/patrimonio/search?&term=00&_type=query&q=00
    $.ajax({
        type: "GET",
        url: `/api/patrimonio/search?&term=${term}`,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (data) {
            showPatrimonio(data)
        },
        error: function (errMsg) {
            alert(errMsg);
        }
    
    })


}



$('#busca').on("input", function() {
   
    var dInput = this.value;
    console.log(dInput);
    initPatrimonio(dInput)
    //$(".dDimension:contains('" + dInput + "')").css("display","block");

});


