
var pool = require("../config/pool-factory");


const getTask = async (data) => {

 // if(data.show == 'false') data.show = 'new'



  if(data.show == 'complete'){

    var rows = await pool.query(`Select
    *,
    tasks.created as created_task
    From tasks 
    INNER JOIN servidores ON servidores.id = tasks.id_servidor 
    WHERE status = ? AND (task_id LIKE ? OR servidores.name LIKE ?) ORDER BY tasks.created DESC`, 
    [data.show,`%${data.term}%`, `%${data.term}%`]);


  }else{
    var rows = await pool.query(`Select
    *,
    tasks.created as created_task
    From tasks 
    INNER JOIN servidores ON servidores.id = tasks.id_servidor 
    WHERE status = ? AND (task_id LIKE ? OR servidores.name LIKE ?) ORDER BY tasks.priority ASC, tasks.created DESC`, 
    [data.show, `%${data.term}%`, `%${data.term}%`]);

  }

  /*
  
      *,
    tasks.created as created_task
    From tasks 
    INNER JOIN servidores ON servidores.id = tasks.id_servidor 
    WHERE status = ? AND (task_id LIKE ? OR servidores.name LIKE ?) AND (tasks.created BETWEEN ? AND ?) ORDER BY tasks.priority ASC, tasks.created DESC`, 
    [data.show, `%${data.term}%`, `%${data.term}%`, data.start, data.end]);
  */

 
 
  if (rows.length > 0) {

    const tasks = [] 

    for (const row of rows) {
      var tecnico = await getTasktecnicos(row.task_id)
      row.tecnico = tecnico
      tasks.push(row)
    }

   
  
  return tasks

  }else return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};


const getTaskArchive222 = async (data) => {

  if(data.show == 'false') data.show = 'new'

  let rows = await pool.query(`Select
  *,
  tasks.created as created_task
  From
  tasks Inner Join
  servidores On servidores.id = tasks.id_servidor WHERE status = ? AND task_id LIKE ? AND (tasks.created BETWEEN ? AND ?) ORDER BY tasks.priority ASC, tasks.created DESC`, 
  [data.show, `%${data.term}%`, data.start, data.end]);
 
  if (rows.length > 0) {

    const tasks = [] 

    for (const row of rows) {
      var tecnico = await getTasktecnicos(row.task_id)
      row.tecnico = tecnico
      tasks.push(row)
    }
  
  return tasks

  }else return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};


const getTaskArchive = async (data) => {

  //console.log(data)
 


 
let rows = await pool.query(`Select
  *,
  tasks.updated as updated_task
  From
  tasks Inner Join
  servidores On servidores.id = tasks.id_servidor WHERE status = ? AND (task_id LIKE ? OR servidores.name LIKE ?) AND tasks.updated BETWEEN ? AND ? ORDER BY  tasks.updated DESC`, 
  ['archive', `%${data.term}%`,`%${data.term}%`, data.start, data.end]);
   if (rows.length > 0) {

    const tasks = [] 

    for (const row of rows) {
      var tecnico = await getTasktecnicos(row.task_id)
      row.tecnico = tecnico
      tasks.push(row)
    }

   const data = tasks


   // this gives an object with dates as keys
   const groups = data.reduce((groups, game) => {
   
     const date = game.updated_task.toLocaleDateString();
     if (!groups[date]) {
       groups[date] = [];
     }
     groups[date].push(game);
     return groups;
   }, {});
   
   // Edit: to add it in the array format instead
   const groupArrays = Object.keys(groups).map((date) => {
     return {
       date,
       tasks: groups[date]
     };
   });
   


   return groupArrays;

   }else{
     return false;
   }
  

 };


const getMyTask = async (data) => {


/*SELECT * FROM TB_ContratoCotista
INNER JOIN TB_Contrato ON TB_Contrato.id_contrato = TB_ContratoCotista.id_contrato
INNER JOIN TB_Cotista ON TB_Cotista = TB_ContratoCotista.id_cotista */


//console.log(data)
const tasks = [] 


  let rows = await pool.query(`SELECT  *,
  tasks.created as created_task From task_tecnico
  INNER JOIN tasks ON tasks.task_id = task_tecnico.task_id
  INNER JOIN servidores ON servidores.id = tasks.id_servidor
  WHERE task_tecnico.id_tecnico = ?
  AND tasks.status = ?
  AND (tasks.task_id LIKE ? OR servidores.name LIKE ?)
  ORDER BY tasks.priority ASC, tasks.created DESC`, 
  [data.tecnico_id, `pendding`,`%${data.term}%`, `%${data.term}%`]);
 
  if (rows.length > 0) {

    for (const row of rows) {
      var tecnico = await getTasktecnicos(row.task_id)
      row.tecnico = tecnico
      tasks.push(row)
    }
   
  }

  //pesquisar por item dentro da task
  if(data.term.length > 4){

  let itensOnTask = await pool.query(`SELECT  *
  FROM task_patrimonio
  WHERE task_patrimonio.registration LIKE ?
  ORDER BY created DESC`, 
  [`%${data.term}%`]);

  if(itensOnTask.length > 0){
    //getTaskData
    for (const iten of itensOnTask) {
      //console.log(iten.task_id)

      var task = await getTaskData(iten.task_id)
      if(task.length > 0){
      var tecnico = await getTasktecnicos(iten.task_id)
      task[0].tecnico = tecnico
      task[0].info = 'patrimonio'
    
      tasks.push(task[0])
    }
    }
    
  }
}

  if (tasks.length > 0) return tasks
  return false
   
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};

const getMyTaskCount = async (tecnico_id) => {
 
    // Primeiro SELECT para contar as tarefas que correspondem aos critérios
    let rows = await pool.query(`SELECT 
       tasks.status As status,
       COUNT(*) as count
        FROM task_tecnico
        INNER JOIN tasks ON tasks.task_id = task_tecnico.task_id
        INNER JOIN servidores ON servidores.id = tasks.id_servidor
        WHERE task_tecnico.id_tecnico = ?
        AND tasks.status = ?`, 
        [tecnico_id, `pendding`]
    );



    if (rows.length > 0) return rows;
    return false;
};

const getTaskCount = async () => {

  let rows = await pool.query(`Select
    tasks.status As status,
    Count(tasks.status) As count
From
    tasks
Group By
    tasks.status`);

  if (rows.length > 0) return rows;
  return false;

};




const getPatrimonioServicebyTask = async (task_id, registration) => {

  let rows = await pool.query(`Select
  *,
  created AS service_created
  From task_service
  tasks WHERE task_id = ? AND registration = ? ORDER BY created DESC`, [task_id, registration]);

  if (rows.length > 0) return rows;
  return false;

};



const getOficioPatrimonio = async (task_id, itens) => {

  let rows = await pool.query(`SELECT * FROM task_patrimonio WHERE task_id = ? AND FIND_IN_SET(id, ?)`, [task_id, itens]);

  if (rows.length > 0) return rows;
  return false;

};

const getOficio = async (id) => {

  let rows = await pool.query(`Select
  *,
  created AS oficio_created
  From oficios WHERE id = ? ORDER BY created DESC`, [id]);

  if (rows.length > 0) return rows;
  return false;

};




const getTaskData = async (task_id) => {

    let rows = await pool.query(`Select
    *,
    tasks.created as created_task
    From
    tasks Inner Join
    servidores On servidores.id = tasks.id_servidor WHERE task_id = ?`, [task_id]);

    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };

  const getCompleteTask = async (start, end) => {
    let rows = await pool.query(`Select
    *,
    tasks.created as created_task,
    tasks.updated as updated_task,
    tasks.whatsapp as wpp
    From
    tasks Inner Join
    servidores On servidores.id = tasks.id_servidor WHERE tasks.status = 'complete' AND notification ='on' AND (tasks.last_notification BETWEEN ? AND ?) `, [start, end]);
    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };

  const updateTaskDate = async (task_id, update) => {

    //console.log(update)

    await pool.query(
      "UPDATE tasks SET last_notification = ?  WHERE task_id = ?",
      [update, task_id]
    );

    };
  

  const getTaskPatrimonio = async (id) => {
    let rows = await pool.query(`SELECT * FROM task_patrimonio WHERE id = ?`, [id]);
    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };

  const getTaskPatrimoniobyIdTask = async (task_id) => {
    let rows = await pool.query(`SELECT * FROM task_patrimonio WHERE task_id = ?`, [task_id]);
    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };

  const getService = async (id) => {
    let rows = await pool.query(`SELECT * FROM task_service WHERE id = ?`, [id]);
    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };



  const getTaskHistory = async (task_id) => {

    let rows = await pool.query(`SELECT * FROM history WHERE task_id = ? ORDER BY created DESC`, [task_id]);
    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };

  const getTasktecnicos = async (task_id) => {

    let rows = await pool.query(`SELECT * FROM task_tecnico WHERE task_id = ? ORDER BY created DESC`, [task_id]);
    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };

  const getTasktecnicosInterval = async (strat, end) => {

    let rows = await pool.query(`SELECT * FROM task_tecnico WHERE task_id = ? ORDER BY created DESC`, [task_id]);
    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };

  const getTecnico = async (task_id) => {

    let rows = await pool.query(`SELECT * FROM task_tecnico WHERE task_id = ? ORDER BY created DESC`, [task_id]);
    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };




  
  const getTaskSign = async (task_id) => {

    let rows = await pool.query(`SELECT * FROM task_sign WHERE task_id = ? ORDER BY created DESC LIMIT 0,1`, [task_id]);
    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };

  


  const getNotesHistory = async (task_id) => {
 
   let rows = await pool.query(`Select * , task_notes.created as note_created
    From
    task_notes Inner Join
    tecnicos On tecnicos.id = task_notes.id_tecnicos WHERE task_notes.task_id = ? ORDER BY task_notes.created DESC`, [task_id]);
    if (rows.length > 0) {

    const data = rows

    //console.log
    // this gives an object with dates as keys
    const groups = data.reduce((groups, game) => {
    
      const date = game.note_created.toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});
    
    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        notes: groups[date]
      };
    });
    


    return groupArrays;

    }else{
      return false;
    }
   


   
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };

  
const getOficios = async (task_id) => {

  let rows = await pool.query("SELECT * FROM oficios WHERE task_id = ?", [task_id]);
  if (rows.length > 0) return rows;
  return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};
  

const getServidor = async (id_servidor) => {

    let rows = await pool.query("SELECT * FROM servidores WHERE id = ?", [id_servidor]);
    if (rows.length > 0) return rows;
    return false;
   
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };


  const getActiveTecnicos = async () => {

    let rows = await pool.query("SELECT * FROM tecnicos WHERE active = '1'");
    //if (rows.length > 0) return rows;
    
    var tecnicos = []
    
    if(rows.length > 0){
      //getTaskData

      rows.forEach(function(item) {
      
        tecnicos.push({
          value : item.name,
          uid: item.id,
          image: `/img/profile/${item.profile}`
        })
    

      
       // do something with `item`
      });
      
      return tecnicos
      
    }else return false;
   


    
    
   /* if (rows.length > 0) return   res.json(rows);
    return res.json({status: "Sorry! Not found."});*/
 
  };



  const insertHistory = async (type, title, description, id_tecnicos, task_id) => {

    var data = {
      task_id: task_id,
      id_tecnicos:id_tecnicos,
      type: type, 
      title: title, 
      description : description};
  
      await pool.query("INSERT INTO history SET ?", data, function (err, result) {
        if(err){
          console.log(err)
        }
  
      });

  }




  
const getSolicitationBySector = async (data) => {

  let rows = await pool.query(`
        Select
          servidores.location,
          Count(tasks.id) As count
      From
          tasks Inner Join
          servidores On servidores.id = tasks.id_servidor
      Where
          tasks.status = 'archive' And
          tasks.created Between ? And ?
      Group By
      servidores.location
      Order By
      count Desc`, 
  [data.start, data.end]);
 
  if (rows.length > 0) return rows
   return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};

const getTecnicoStats = async (data) => {

  let rows = await pool.query(`
  Select
    task_tecnico.id_tecnico,
    task_tecnico.name,
    Count(task_tecnico.id) As Atendimentos
From
    task_tecnico INNER JOIN
    tasks On tasks.task_id = task_tecnico.task_id
Where
    task_tecnico.created Between ? And ? And
       ( tasks.status = 'archive' Or
        tasks.status = 'complete')
Group By
    task_tecnico.id_tecnico
Order By
    Atendimentos Desc`, 
  [data.start, data.end]);
 
  return rows
   
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};


const getTecnicoStatsById = async (id, star, end) => {

  let rows = pool.query(`Select
  task_tecnico.id_tecnico,
  IFNULL(Count(task_tecnico.id),0) As Atendimentos,
  task_tecnico.name
From
  task_tecnico
Where
  task_tecnico.id_tecnico = ? And
  task_tecnico.created Between ? And ?
Group By
  task_tecnico.id_tecnico, task_tecnico.name`, 
  [id, star, end]);
 
  if (rows.length > 0) return rows
  return 0;
   
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};


const getTecnicoTimeConclusion = async (data) => {

  let rows = await pool.query(`
  Select
  task_tecnico.id_tecnico,
  task_tecnico.name,
  Count(task_tecnico.id) As Atendimentos,
  Avg(TimestampDiff(MINUTE, tasks.created, tasks.updated)) As time
From
  task_tecnico Inner Join
  tasks On tasks.task_id = task_tecnico.task_id
Where
  task_tecnico.created Between ? And ? And
  (tasks.status = 'archive' Or
      tasks.status = 'complete')
Group By
  task_tecnico.id_tecnico
Order By
  Atendimentos Desc`, 
  [data.start, data.end]);
 
  if (rows.length > 0) return rows
   return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};



const getServidoresSolicitations = async (data) => {

  let rows = await pool.query(`
  Select
    servidores.name As Count_name,
    servidores.location,
    servidores.ve,
    servidores.role,
    Count(servidores.id) As Count_id
From
    tasks Inner Join
    servidores On servidores.id = tasks.id_servidor
    and
    tasks.created Between ? And ?
Group By
    servidores.name,
    tasks.location,
    servidores.location,
    servidores.ve,
    servidores.role
Order By
    Count_id Desc`, 
  [data.start, data.end]);
 
  if (rows.length > 0) return rows
   return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};











const getTaskDurations = async (data) => {

  let rows = await pool.query(`
  Select
    avg(TimestampDiff(MINUTE, tasks.created, tasks.updated)) As time,
    tasks.task_id,
    tasks.type,
    tasks.created,
    tasks.updated
From
    tasks
Where
    tasks.status = 'archive' and
    tasks.created Between ? And ?
Group By
   tasks.task_id,
    tasks.created,
    tasks.updated,
    tasks.type`, 
  [data.start, data.end]);
 
  if (rows.length > 0) return rows
   return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};


const getTaskValueCost = async (data) => {

  let rows = await pool.query(`
  Select
    Sum(task_patrimonio.valor_atualizado) As Sum_valor_atualizado,
    Count(task_patrimonio.registration) As Count_registration
From
    task_patrimonio
    Where task_patrimonio.registration != '000001' and
    task_patrimonio.created Between ? And ?`, 
  [data.start, data.end]);
 
  if (rows.length > 0) return rows
   return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};




const getOficiosYear = async (year) => {

  var start = `${year}-01-01T00:00:00.000Z`, end = `${year}-12-31T23:59:59.000Z`

  let rows = await pool.query(`Select
  Count(oficios.id) As count
  From
  oficios WHERE
  oficios.created Between '${start}' And '${end}'
`)
 
  if (rows.length > 0) return rows
   return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};


const getTaskByHour = async (data) => {

  let rows = await pool.query(`
  Select
    Count(tasks.id) As count,
    hour( tasks.created) As hour
From
    tasks
Where  tasks.created Between ? And ?
Group By
hour(tasks.created)`, 
  [data.start, data.end]);
 
  if (rows.length > 0) return rows
   return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};


const getTaskByHourClosed = async (data) => {

  let rows = await pool.query(`
  Select
    Count(tasks.id) As count,
    hour( tasks.updated) As hour
From
    tasks
Where  tasks.updated Between ? And ? and
tasks.status = 'archive' or tasks.status = 'complete'
Group By
hour(tasks.updated)`, 
  [data.start, data.end]);
 
  if (rows.length > 0) return rows
   return false;
 
 /* if (rows.length > 0) return   res.json(rows);
  return res.json({status: "Sorry! Not found."});*/

};






  




  

  module.exports = {
    getOficios,
    getOficioPatrimonio,
    getOficio,
    getActiveTecnicos,
    getOficiosYear,
  getTaskSign,
  getService,
  getPatrimonioServicebyTask,
  getMyTask,
  getMyTaskCount,
  getTaskCount,
  getTasktecnicos,
  getTaskArchive,
  getTask,
  updateTaskDate, 
  getNotesHistory,
  getTecnico,
  getCompleteTask,
  getTaskPatrimonio,
  getTaskPatrimoniobyIdTask,
  getTaskData,
  getTaskHistory,
  getServidor,
  insertHistory,
  getSolicitationBySector,
  getTecnicoStats,
  getTecnicoStatsById,
  getTaskDurations,
  getTecnicoTimeConclusion,
  getTaskValueCost,
  getServidoresSolicitations,
  getTaskByHour,
  getTaskByHourClosed
  
  };