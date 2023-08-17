

/*

!function($) {
    "use strict";

    var ChatApp = function() {
        this.$body = $("body"),
        this.$chatInput = $('.chat-input'),
        this.$chatList = $('.conversation-list'),
        this.$chatSendBtn = $('.chat-send'),
        this.$chatForm = $("#chat-form")
    };

    ChatApp.prototype.save = function() {
        var chatText = this.$chatInput.val();
        var chatTime = moment().format("h:mm");
        if (chatText == "") {
            this.$chatInput.focus();
            return false;
        } else {
            $('<li class="clearfix odd"><div class="chat-avatar"><img src="assets/images/users/avatar-1.jpg" alt="male"><i>' + chatTime + '</i></div><div class="conversation-text"><div class="ctext-wrap"><i>Dominic</i><p>' + chatText + '</p></div></div></li>').appendTo('.conversation-list');
            this.$chatInput.focus();
            this.$chatList.animate({ scrollTop: this.$chatList.prop("scrollHeight") + 100 }, 1000);
            return true;
        }
    }

    // init
    ChatApp.prototype.init = function () {
        var $this = this;
        //binding keypress event on chat input box - on enter we are adding the chat into chat list - 
        $this.$chatInput.keypress(function (ev) {
            var p = ev.which;
            if (p == 13) {
                $this.save();
                return false;
            }
        });


        //binding send button click
        $this.$chatForm.on('submit', function (ev) {
            ev.preventDefault();
            $this.save();
            $this.$chatInput.val('');

            setTimeout(function() {
                $this.$chatForm.removeClass('was-validated');
            });
            
            return false;
        });
    },
    //init ChatApp
    $.ChatApp = new ChatApp, $.ChatApp.Constructor = ChatApp
    
}(window.jQuery),

function ($) {
    "use strict";

    var Dashboard = function () { };

    Dashboard.prototype.initCharts = function() {
        window.Apex = {
            chart: {
                parentHeightOffset: 0,
                toolbar: {
                    show: false
                }
            },
            grid: {
                padding: {
                    left: 20,
                    right: 0
                }
            },
            colors: ["#5369f8", "#43d39e", "#f77e53", "#ffbe0b"],
            tooltip: {
                theme: 'dark',
                x: { show: false }
            }
        };


        // 
        // Stats
        //

        var options2 = {
            chart: {
                type: 'area',
                height: 45,
                width: 90,
                sparkline: {
                    enabled: true
                }
            },
            series: [{
                data: [25, 66, 41, 85, 63, 25, 44, 12, 36, 9, 54]
            }],
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            markers: {
                size: 0
            },
            colors: ["#727cf5"],
            tooltip: {
                fixed: {
                    enabled: false
                },
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function (seriesName) {
                            return ''
                        }
                    }
                },
                marker: {
                    show: false
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    type: "vertical",
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.45,
                    opacityTo: 0.05,
                    stops: [45, 100]
                  },
            }
        }

        new ApexCharts(document.querySelector("#today-revenue-chart"), options2).render();
        new ApexCharts(document.querySelector("#today-product-sold-chart"), $.extend({}, options2, {colors: ['#f77e53']})).render();
        new ApexCharts(document.querySelector("#today-new-customer-chart"), $.extend({}, options2, {colors: ['#43d39e']})).render();
        new ApexCharts(document.querySelector("#today-new-visitors-chart"), $.extend({}, options2, {colors: ['#ffbe0b']})).render();

        // ------------------- revenue chart

        function getDaysInMonth(month, year) {
            var date = new Date(year, month, 1);
            var days = [];
            var idx = 0;
            while (date.getMonth() === month && idx < 15) {
                var d = new Date(date);
               days.push(d.getDate() + " " +  d.toLocaleString('en-us', { month: 'short' }));
               date.setDate(date.getDate() + 1);
               idx += 1;
            }
            return days;
       }

       var now = new Date();
       var labels = getDaysInMonth(now.getMonth(), now.getFullYear());
       
       var options = {
            chart: {
                height: 329,
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 4
            },
            series: [{
                name: 'Revenue',
                data: [10, 20, 5, 15, 10, 20, 15, 25, 20, 30, 25, 40, 30, 50, 35]
            }],
            zoom: {
                enabled: false
            },
            legend: {
                show: false
            },
            colors: ['#43d39e'],
            xaxis: {
                type: 'string',
                categories: labels,
                tooltip: {
                    enabled: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    
                }
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return val + "k"
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    type: "vertical",
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.45,
                    opacityTo: 0.05,
                    stops: [45, 100]
                  },
            },
        }

        var chart = new ApexCharts(
            document.querySelector("#revenue-chart"),
            options
        );

        chart.render();


        var options = {
            chart: {
                height: 349,
                type: 'bar',
                stacked: true,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '45%',
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            series: [{
                name: 'Net Profit',
                data: [35, 44, 55, 57, 56, 61]
            }, {
                name: 'Revenue',
                data: [52, 76, 85, 101, 98, 87]
            }],
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                axisBorder: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            grid: {
                row: {
                    colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.2
                },
                borderColor: '#f3f4f7'
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "$ " + val + " thousands"
                    }
                }
            }
        }

        var chart = new ApexCharts(
            document.querySelector("#targets-chart"),
            options
        );

        chart.render();

        // sales by category --------------------------------------------------
        var options = {
            plotOptions: {
                pie: {
                    donut: {
                        size: '70%',
                    },
                    expandOnClick: false
                }
            },
            chart: {
                height: 291,
                type: 'donut',
            },
            legend: {
                show: true,
                position: 'right',
                horizontalAlign: 'left',
                itemMargin: {
                    horizontal: 6,
                    vertical: 3
                }
            },
            series: [44, 55, 41, 17],
            labels: ['Clothes 44k', 'Smartphons 55k', 'Electronics 41k', 'Other 17k'],
            responsive: [{
                breakpoint: 480,
                options: {
                    
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            tooltip: {
                y: {
                    formatter: function(value) { return value + "k" }
                },
            }
        }

        var chart = new ApexCharts(
            document.querySelector("#sales-by-category-chart"),
            options
        );

        chart.render();

        
    },

    //initializing
    Dashboard.prototype.init = function () {
        // date picker
        $('#dash-daterange').flatpickr({
            mode: "range",
            defaultDate: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
        });

        // calendar
        $('#calendar-widget').flatpickr({
            inline: true,
            shorthandCurrentMonth: true,
        });

        // chat
        $.ChatApp.init();

        // charts
        this.initCharts();
    },

    
    $.Dashboard = new Dashboard, $.Dashboard.Constructor = Dashboard

}(window.jQuery),
//initializing main application module
function ($) {
    "use strict";
    $.Dashboard.init();
}(window.jQuery);
*/


$(document).ready(function() {
   // $('.parsley-examples').parsley();
});







        $(document).on('select2:open', () => {
            document.querySelector('.select2-search__field').focus();
        });


  var select = $('[data-plugin="select_servidores"]').select2({
    ajax: {
      url: '/api/servidores/search?',
      dataType: 'json',
      data: function (params) {
        var query = {
          term: params.term
        }

        // Query parameters will be ?search=[term]&type=public
        return query;
      },
      type: "GET",
      placeholder: "Buscar ...",
      minimumInputLength: 3,
 
      processResults: function (data) {
        return {
          results: data
        };
      },
    },
    templateResult: formatRepo,
    templateSelection: function (data) {
        if (!data.id) {
          return data.text;
        }
        return $(`<span>${data.registration} - ${data.name}</span>`);
      },
  })

  .on('select2:open', function (e) {
    document.querySelector('.select2-search__field').focus();
  })


  .on('select2:select', function (e) {
      var data = e.params.data;
    
      $("#destiny").text(data.location)
       $("#contato").val(data.phone)
  });

  


 





  function formatRepo(data) {

    //console.log(data)
    if (data.loading) {
      return data.text;
    }



    var $tpl = $(`
                <div class="p-1">
                    <span class="location"><i class="uil uil-map-pin-alt text-dark"></i><span class="badge badge-soft-primary" style="margin-left:5px;">${data.location}</span></span>
                    <h5 class="mt-1 mb-1"><span class="text-dark bold repository__name">${data.registration} ${data.name}</span>
                    <br><span class="badge badge-soft-secondary mt-1">${data.role}</span> </h5>                                   
                </div>
        `)



    return $tpl;
  }



  

function priority(priority) {

    if (priority == "1") {
        text = ['danger', 'Alta']
    } else if (priority == "2") {
        text = ['success', 'Normal']

    } else {
        text = ['primary', 'Baixa']
    }
    var tpl = `<div class="badge bg-${text[0]} float-end">Prioridade ${text[1]}</div>`
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



var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;

};


function tplte(row) {

    return `<div class="col-xl-4 col-lg-6">
    <div class="card">
        <a href="/tasks/view/${row.task_id}" >
        <div class="card-body">
            
            ${priority(row.priority)}
        
            <p class="text-success text-uppercase  mb-2"><i class="uil uil-map-pin-alt text-dark"></i><span class="badge badge-soft-primary" style="margin-left:5px;">${row.location}</span></p>
            <h5 class="mt-1 mb-1"><span class="text-dark fs-17 dots">${row.registration} - ${row.name}</span></h5>
            <span class="badge badge-soft-secondary mt-1">${row.role}</span> </h5>
            <p class="text-muted mb-1 mt-2  ">${row.description}</p>
             
            ${tecnicos(row.tecnico)}
             
         
        </div>
        <div class="card-body border-top">
            <div class="row align-items-center">
                <div class="col-sm-auto">
                    <ul class="list-inline mb-0">
                        <li class="list-inline-item pe-2">
                            <span class="text-muted d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" title="Due date">
                                <i class="uil uil-calender me-1"></i> ${moment(row.created_task).fromNow()}
                            </span>
                        </li>
                       
                        <li class="list-inline-item">
                            <span class="text-muted d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" title="Comments">
                                <i class="uil uil-clipboard-alt"></i> #${row.task_id} 
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="col offset-sm-1">
                    
                </div>
            </div>
        </div>
        </a>
    </div>
    <!-- end card -->
</div>`

}

function showTasks(data){

    $('.load').hide()

        if(data){

            var tpl = ""
            data.forEach(function (row, index) {
                tpl += tplte(row)
            })
        
            $(".tarefas").empty().append(tpl)

        }else{

            $(".tarefas").empty().append(`
            
            <div class="col-12 text-center">
                                
                                        <h4 class="header-title mt-3 pt-3 mb-3" style="font-size:50px !important">😅</h4>
                                        <p class="sub-header">
                                           Não há nenhuma tarefa.
                                        </p>

                                 
                            </div>
            `)
        }

   
 

}





$('#busca').on("input", function() {
   
    var dInput = this.value;
  

    initTasks(flatpickr.selectedDates)
    //$(".dDimension:contains('" + dInput + "')").css("display","block");

});

    const flatpickr = $('#range-datepicker').flatpickr({
        locale: "pt",
        mode: "range",
        dateFormat: "d/m/Y",
        defaultDate : [moment(new Date()).subtract(30, 'days').format("DD/MM/YYYY"), moment(new Date()).format("DD/MM/YYYY")],
        onChange: function(selectedDates, dateStr, instance) {
            initTasks(selectedDates)
        },
        onReady: function(selectedDates, dateStr, instance) {
        // console.log(selectedDates[0],selectedDates[1])

        initTasks(selectedDates)
        },
         
    });


    


// basic bar chats

  

    var cartTopOccurence = new ApexCharts(
        document.querySelector("#apex-bar-1"),
        {
            chart: {
                height: 500,
                type: 'bar',
              },
        
           
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
           enabled: true,
          formatter: function (val) {
            return val;
          },
          offsetY: 0,
          style: {
            fontSize: '14px',
            colors: ["#000"]
          }
            },
            series: [{
                data: []
            }],
            xaxis: {
                categories: []
            }
        }
    );
    
    cartTopOccurence.render();



    
    var options = {
        chart: {
            height: 380,
            type: 'line',
            shadow: {
                enabled: false,
                color: '#bbb',
                top: 3,
                left: 2,
                blur: 3,
                opacity: 1
            },
        },
        stroke: {
            width: 5,
            curve: 'smooth'
        },
        series: [{
            name: 'Likes',
            data: [40, 3,65]
        }],
        xaxis: {
            type: 'time',
            categories: ["10:00", "11:00", "12:00"],
        },
        title: {
            text: 'Social Media',
            align: 'left',
            style: {
                fontSize: "14px",
                color: '#666'
            }
        },
       
        markers: {
            size: 4,
            opacity: 0.9,
            colors: ["#50a5f1"],
            strokeColor: "#fff",
            strokeWidth: 2,
            style: 'inverted', // full, hollow, inverted
            hover: {
                size: 7,
            }
            
        },
        yaxis: {
            min: -10,
            max: 40,
            title: {
                text: 'Engagement',
            },
        },

        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2
            },
            borderColor: '#185a9d'
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    show: false
                },
            }
        }]
    }

    var options2 = {
        series: [],
        title: {
            text: 'Abertura vs Fechamento de Tarefas',
            align: 'left',
            style: {
                fontSize: "14px",
                color: '#666'
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#ff0000', '#01754e'],
                shadeIntensity: 1,
                type: 'vertical',
                opacityFrom: 1,
                opacityTo: 1,
          
            },
        },
        stroke: {
            width: 6,
            curve: 'smooth'
        },
        chart: {
          height: 350,
          type: 'line',
        },
        dataLabels: {
          enabled: true
        },
        noData: {
          text: 'Carregando...'
        },
        xaxis: {
          type: 'category',
          tickPlacement: 'on',
          labels: {
            rotate: -45,
            rotateAlways: true
          }
        }
      }

    var chart = new ApexCharts(
        document.querySelector("#apex-line-2"),
        options2
    );

    chart.render();



  


     




    function numberToReal(numero) {
        var numero = numero.toFixed(2).split('.');
        numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }


    function minutes_to_hhmm (numberOfMinutes) {
        //create duration object from moment.duration  
        var duration = moment.duration(numberOfMinutes, 'minutes');
        
        //calculate hours
        var hh = (duration.years()*(365*24)) + (duration.months()*(30*24)) + (duration.days()*24) + (duration.hours());
        
        //get minutes
        var mm = duration.minutes();
        
        //return total time in hh:mm format
        if(hh == 0){
            return `${mm} minutos`
        }else{
            return `${hh} horas e ${mm} minutos`
        }


    }
    

function initTasks(date){
    $(".tarefas").empty()

    var data = {
        start: date[0],
        end:date[1],
        term: $('#busca').val()
      }

    $.ajax({
        type: "POST",
        url: `/api/report`,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (data) {
           // showTasks(data)

           $('.taskperiod').html(data.total_tasks)
           $('.totalsectors').html(data.occurence_sector.length)

           $('.manutent').html(data.valuecost[0].Count_registration)
           $('.totavalue').html(numberToReal(parseFloat(data.valuecost[0].Sum_valor_atualizado)))


           $('.start').html(data.period.start)
           $('.end').html(data.period.end)

          

            var conclusionTime = ''
           data.tecnicos_stats.forEach(function (item, index) {
          
            conclusionTime += `<tr>
            <td>${item.name}</td>
            <td>${minutes_to_hhmm(Math.round((item.time/item.Atendimentos)))}.</td>
            <td>${item.Atendimentos}</td>
        </tr>`
            
            
      });
      $('.conslusionTime tbody').empty();
      $('.conslusionTime').append(conclusionTime)

      var tasks_in = []
      var tasks_out = []

    data.task_durations_minutes.forEach(function (item, index) {
          
       if(item.type == 'in') tasks_in.push(item)
       if(item.type == 'out') tasks_out.push(item) 
        
  });
           
  $('.in').html(tasks_in.length)
  $('.out').html(tasks_out.length)

  var TotalOcuurenceServidorTemplate = ''

  data.taskServidores.forEach(function (item, index) {

    TotalOcuurenceServidorTemplate += `<tr>
    <td>${item.Count_name}<br>
    <small>${item.role} - ${item.location}</small></td>
    <td>${item.Count_id}</td>
</tr>`
        
});

$('.totaloccurencedetalhedServidor tbody').empty();
$('.totaloccurencedetalhedServidor').append(TotalOcuurenceServidorTemplate);



        
           var TotalOcuurenceTemplate = ''

        var topOccurence = []
var top5 = ''
var totaltaskTop5 = 0

           data.occurence_sector.forEach(function (item, index) {
                if(index < 10) topOccurence.push(item)
                if(index < 5) {
                    top5 += `<br><b>- ${item.name} (${item.data[0].y} tarefas)</b>`
                    totaltaskTop5 = totaltaskTop5 + item.data[0].y
                }
                TotalOcuurenceTemplate += `<tr>
                <th scope="row">${index+1}</th>
                <td>${item.name}</td>
                <td>${item.data[0].y}</td>
            </tr>`

          
                
                
          });

          $('.top5').html(top5)

          var percentage = (data.total_tasks/totaltaskTop5)*10

          $('.percent').html(Math.round(percentage))

          $('.totaloccurencedetalhed tbody').empty();

          $('.totaloccurencedetalhed').append(TotalOcuurenceTemplate);

           cartTopOccurence.updateSeries(topOccurence)


           chart.updateSeries([{
            "name": "Abertura das Tarefas",
            "data": data.taskhours
        },{
            "name": "Fechamento das Tarefas",
            "data": data.taskhoursClosed
        }])


           // tecnicos
            var tecnicoSeries = []
            var tecnicoLabel = []


        data.tecnicos_stats.forEach(function (item, index) {
          
            tecnicoSeries.push(item.Atendimentos)
            tecnicoLabel.push(`${item.name} (${item.Atendimentos})`)
            
      });
           
 
      $('#tecnicos div').empty();
    
    var charttecnicos = new ApexCharts(document.querySelector("#tecnicos"), {
        series: tecnicoSeries,
        labels: tecnicoLabel,
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 7
        },
        chart: {
        type: 'pie',
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: true,
          offsetX: 0,
          offsetY: 50,
          customScale: 1,
          dataLabels: {
          
            offset: -20,
            position: 'bottom', // top, center, bottom
          },
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        }
    },
      responsive: [{
        breakpoint: 300,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'left'
          }
        }
      }]
      });
     
      charttecnicos.render();

   


        },
        error: function (errMsg) {
            error
            alert(errMsg);
        }
    
    })


}