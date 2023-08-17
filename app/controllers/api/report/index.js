const express = require('express');
const router = express.Router();
const moment = require('moment')
var db = require('../../../config/db')



var pool = require("../../../config/pool-factory");


// Estrutura /API/Tasks


router.post('/all', async function (req, res) {


  const dados = req.body
  var data = {
    show: req.body.show,
    start: moment(req.body.start).format("YYYY-MM-DD 00:00:00"),
    end: moment(req.body.end).format("YYYY-MM-DD 23:59:59"),
    term: req.body.term
  };

 var rows = await db.getTask((data))
 res.json(rows);

})


router.post('/', async function (req, res) {
  const dados = req.body
  var data = {
    start: moment(req.body.start).format("YYYY-MM-DD 00:00:01"),
    end: moment(req.body.end).format("YYYY-MM-DD 23:59:59"),
  };

  /*var data = {
    start: '2022-05-23 00:00:01', end: '2022-12-23 23:59:59'
  };*/

var taskDurations = await db.getTaskDurations(data)
var totalTasks = taskDurations.length

var  occurence_sector = await db.getSolicitationBySector(data)
var data_occurence_sector = []

occurence_sector.forEach(function (item, index) {


  data_occurence_sector.push({
    name:item.location,
    data: 
     [{
       "x": 'Solicitações',
       "y": item.count
     }]
   
})


});

var taskfoursData = []
var taskhour = await db.getTaskByHour(data)

taskhour.forEach(function (item, index) {

  taskfoursData.push({
    "x": item.hour  + ' hrs',
    "y": item.count
})

});

var taskfoursDataClosed = []
var taskhourClosed = await db.getTaskByHourClosed(data)

taskhourClosed.forEach(function (item, index) {

  taskfoursDataClosed.push({
    "x": item.hour + ' hrs',
    "y": item.count
})

});
//Solicitações por setor





 res.json({
  occurence_sector :  data_occurence_sector,
  //tecnicos_stats : await db.getTecnicoStats(data),
  tecnicos_stats : await db.getTecnicoTimeConclusion(data),
  task_durations_minutes : taskDurations,
  valuecost: await db.getTaskValueCost(data),
  total_tasks : totalTasks,
  period : {
    start: moment(req.body.start).format("DD/MM/YYYY"),
    end: moment(req.body.end).format("DD/MM/YYYY")
  },
  taskhours: taskfoursData,
  taskhoursClosed: taskfoursDataClosed,
  taskServidores : await db.getServidoresSolicitations(data)



 });

})



module.exports = router;