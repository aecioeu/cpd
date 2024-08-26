const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const config = require('../../../config.json')
const { createPDF } = require('../../config/pdf')
var request = require('request');
var pool = require("../../config/pool-factory");
var {
  makeid,
  rand,
  delay,
  capitalizeFirstLetter,
} = require("../../config/functions");
var db = require("../../config/db");
var moment = require("moment"); // require
const { isLoggedIn } = require("../../config/functions");
const { sendMsg } = require("../../config/senderHelper");
const schedule = require("node-schedule");


var request = require('request');
require('dotenv').config()


async function lembrete() {
  console.log("INICIANDO ENVIO DE MSG DE LEMBRETES")
  //subtract(15, "days")
  var start = moment().subtract(28, "days").startOf('day').format("YYYY-MM-DD HH:mm:ss"),
      end = moment().endOf('day').format("YYYY-MM-DD HH:mm:ss");

  var completeTasks = await db.getCompleteTask(start, end);

  console.log("Tarefas completas nos últimos 28 dias", completeTasks);

  //console.log(start, end)
  //console.log("Total: ", completeTasks.length)
  //console.log('completed' , completeTasks)
  if (completeTasks) {

    for (const task of completeTasks) {

      if(task.whatsapp){


      const task_patrimonio = await db.getTaskPatrimoniobyIdTask(task.task_id);
      console.log(`Jobs para executar ${task.task_id}`);
   
      //console.log('task Patrimono', task_patrimonio)

      if (task_patrimonio) {

        try {

          let tpl = "";
          task_patrimonio.forEach(function (patrimonio, index) {
            tpl += `${index+1} - *${patrimonio.registration} - ${patrimonio.name}*\n`;
          });

          //date.setSeconds(date.getSeconds() + 5);
          date = moment().add(15, "seconds").format("YYYY-MM-DD HH:mm:ss")

         // console.log(tpl , task.whatsapp)
          //console.log('-------------------------------')

          schedule.scheduleJob(`${task.task_id}`, date, async function () {
            console.log(`Executando o Job da task ${task.task_id} para ${task.wpp}`);

            var message = `*Este é um Lembrete automático do CPD!*, *${capitalizeFirstLetter(
              task.name.split(" ")[0].toLowerCase()
            )}*, você ainda não buscou seus itens que estão aqui 😅.
                \n${tpl}
                \nJá estão prontos 🥳, aguardando sua retirada.
                \n*Providencie a retirada o mais breve possivel.*
                \n\n_👉Mensagem automática, não é necessario responder._
                `
       
            console.log("MENSAGEM EM FILA NA API")
     
            sendMsg({
              type: "text",
              message: message,
              from: task.whatsapp,
            })

            db.insertHistory("task", `Notificação via Whatsapp` , `Notificação enviada as ${moment().format(
              "DD/MM/YYYY"
            )} às ${moment().format("HH:mm")} lembrete para retirada de patrimonios do CPD.`, ``, task.task_id)
                               

            await db.updateTaskDate(
              task.task_id,
              `${moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss")}`
            );
         

          });
        
       
      } catch (error) {
        console.log("Não possuui patrimonio para ser enviado", error);
      }
    } // end if patrimonio
    
      // console.log(task.task_id)
    } // fim do for
  }
  }
}

/*

“At minute 0 past hour 8, 10, and 14 on Monday, Tuesday, Wednesday, Thursday, and Friday.”
*/

var cron = require("node-cron");

   
      console.log('ENVIANDO MSNGENS')
      lembrete()
         
              cron.schedule("0 8,10,12,14 * * 1,2,3,4,5", async () => {
                lembrete();
              });

    

// Estrutura /TASKS

let { addUser, getUsersInRoom, getUser, removeUser} =  require('../../config/ioFunctions');
//const { config } = require("process");

global.io.on("connection", async function (socket) {
 // console.log("👾 New socket connected! >>", socket.id);



  socket.on('join', ({ name, tecnico_id }, callback) => {

 
    const { error, user } = addUser(
        { id: socket.id, 
          name, 
          tecnico_id 
        });

    if (error) return callback(error);

    // Emit will send message to the user
    // who had joined
    socket.emit('alert', { user: 'admin', text:
        `${user.name},
        welcome to room ${user.room}.` });

    // Broadcast will send message to everyone
    // in the room except the joined user
    socket.broadcast.emit('alert', { user: "admin",
        text: `${user.name}, has joined` });

    io.to(user.id).emit('alert', {
        room: user
    });
    callback();
})





socket.on('disconnect', () => {
 // console.log('remover')
  const user = removeUser(socket.id);
  if (user) {
      io.to(user.room).emit('message',
      { user: 'admin', text:
      `${user.name} had left` });
  }
})


  const data = await db.getTaskCount();
  socket.emit("getCountTasks", data);


});

router.get("/test", function (req, res) {
  res.send("Service home page");

  io.sockets.emit("getCountTasks", [
    {
      status: "archive",
      count: 99,
    },
    {
      status: "complete",
      count: 99,
    },
  ]);
});

router.get("/count", isLoggedIn, async function (req, res) {
  //res.send('Service home page');
  const data = await db.getTaskCount();
  res.json(data);
});

router.get("/create", isLoggedIn, async function (req, res) {

  var tecAtendimentos = []
const tecnicos = await db.getActiveTecnicos()
//var totalPeriod = tecs.reduce((n, {Atendimentos}) => n + Atendimentos, 0)

for (const tecnico of tecnicos) {
  var atendimentos = await db.getTecnicoStatsById(tecnico.uid, "2023-05-01T03:00:00.000Z", "2023-05-03T03:00:00.000Z")
  tecAtendimentos.push({
    "id": tecnico.uid,
    "name": tecnico.value,
    "Atendimentos" : ( atendimentos ) ? atendimentos[0].Atendimentos :0
})
 /* const contents = await fs.readFile(file, 'utf8');
  console.log(contents);*/
}



//20: 40*100 =
/*
const expanded = sorteio.flatMap(tec => Array(tec.chance).fill(tec));
console.log(expanded, expanded.length)
const winner = expanded[Math.floor(Math.random() * expanded.length)];
console.log("winner: " + winner.name);
*/

var min = tecAtendimentos.reduce(function(res, obj) {
  return (obj.Atendimentos < res.Atendimentos) ? obj : res;
});

console.log(min)




  
  //res.send('Service home page');
  res.render("admin/tasks/create.ejs", { user: req.user });







});

router.post("/create", isLoggedIn, async function (req, res) {
  const dados = req.body;
  const task_id = makeid(5);

  console.log(dados);

  let user = req.user.id;

  var data = {
    task_id: task_id,
    id_servidor: dados.servidor,
    location: dados.destiny,
    contato: dados.contato,
    whatsapp: "55" + dados.whatsapp,
    notification: dados.notify ? dados.notify : "off",
    description: dados.problem,
    priority: dados.priority,
    id_tecnicos: user.id,
    status: "new",
    type: dados.tipo,
  };

  await pool.query(
    "UPDATE servidores SET phone = ? , whatsapp = ? WHERE id = ?",
    [dados.contato, dados.whatsapp, dados.servidor]
  );

  await pool.query(
    "INSERT INTO tasks SET ?",
    data,
    async function (err, result) {
      //atualizar o servidor como o telefone

      if (err) console.log(err);

      const data = await db.getTaskData(task_id);
      var solicitante = data[0].name.toString().split(" ");
     
      // CASO SEJA SELECIONADA PARA NOTIFICAR OS USUARIOS
      if (dados.notify == 'on') {
        try {

          let message =  `Oi 👋 *${capitalizeFirstLetter(
            solicitante[0].toLowerCase()
          )}* tudo bem ? \nAqui é do CPD da Prefeitura.
          \nFoi gerada uma nova tarefa *#${task_id}* para ${(dados.tipo == 'in') ? `*Manutenção de Equipamentos*` :` *Auxilio ao Usuário*`}.
          \nProblema relatado:
          \n_${dados.problem}_
          \n☝️ Fique atento pois as notificações desta tarefa vão chegar por aqui.
          \n_👉Mensagem automática, não é necessario responder._
          `
          

          sendMsg({
            type: "text",
            message: message,
            from: data[0].whatsapp,
          }
        )

        } catch (error) {console.log("ERRO AO ENVIAR MENSSAGEM PARA USUARIO.")}
      }


      if(config.TaskAutoSitribuitionBalace == true){
        //vai realizar a distribuição automatica de O.S caso apenas seja feito o cadastramento
        




      }



      if(dados.action == 'invite'){
        //tecnico ja invitou na O.S


      }

      db.insertHistory(
        "task",
        `Tarefa Criada por ${req.user.name} em ${moment().format(
          "DD/MM/YYYY"
        )} às ${moment().format("HH:mm")}.`,
        ``,
        req.user.id,
        task_id
      );

      let tasksCount = await db.getTaskCount();
      io.sockets.emit("getCountTasks", tasksCount);

      res.redirect("/tasks/view/" + task_id);
    }
  );
});

router.get("/create", isLoggedIn, function (req, res) {
  //res.send('Service home page');
  res.render("admin/tasks/create.ejs", { user: req.user });
});

router.post("/edit", isLoggedIn, async function (req, res) {
  const dados = req.body;

  let user = req.user.id;
  let task_id = dados.task_id;

  var data = {
    task_id: task_id,
    id_servidor: dados.servidor,
    location: dados.destiny,
    contato: dados.contato,
    whatsapp: dados.whatsapp,
    notification: dados.notify ? dados.notify : "off",
    description: dados.problem,
    priority: dados.priority,
    type: dados.tipo,
  };

 

  if (dados.arquived == "on") {
    data.status = "pendding";
  }

  await pool.query(
    "UPDATE servidores SET phone = ? , whatsapp = ? WHERE id = ?",
    [dados.contato, dados.whatsapp, dados.servidor]
  );
  await pool.query(
    "UPDATE tasks SET ? WHERE task_id = ?",
    [data, task_id],
    function (err, result) {
      //atualizar o servidor como o telefone

      if (err) console.log(err);

      if (dados.arquived == "on") {
        db.insertHistory(
          "task",
          `Tarefa Desarquivada`,
          `${req.user.name} desarquivou esta tarefa em ${moment().format(
            "DD/MM/YYYY"
          )} às ${moment().format("HH:mm")}.`,
          req.user.id,
          task_id
        );
        db.insertHistory(
          "task",
          `Edição na tarefa`,
          `${req.user.name} editou informações desta tarefa ${moment().format(
            "DD/MM/YYYY"
          )} às ${moment().format("HH:mm")}.`,
          req.user.id,
          task_id
        );
      } else {
        db.insertHistory(
          "task",
          `Edição na tarefa`,
          `${req.user.name} editou informações desta tarefa ${moment().format(
            "DD/MM/YYYY"
          )} às ${moment().format("HH:mm")}.`,
          req.user.id,
          task_id
        );
      }

      res.redirect("/tasks/view/" + task_id);
    }
  );
});

router.post("/note", isLoggedIn, async function (req, res) {
  const dados = req.body;
  let name = req.user.name

  var data = {
    task_id: dados.task_id,
    description: dados.description,
    tecnico_name: name,
    id_tecnicos: req.user.id,
  };

  var mentions = dados.mentions
  //console.log(dados)


  if(mentions.length > 0){
    //notificar em tempo real as pessoas envolvidas
    //inserir a notificação nos alertas da pagina

    // que vai ser mencionado
    mentions.forEach(async function(mention) {
  
  
      let loggedUsers = getUser(mention.uid)
      loggedUsers.forEach(async function(MenitonUser) {


        let mention_data = {
          tecnico_id : MenitonUser.tecnico_id,
          name : MenitonUser.name,
          message : `${MenitonUser.name}, você foi mencionado por <b>${name}</b> na Tarefa <b>${dados.task_id}</b> 👇.<br>"<b>${dados.description}</b>"`,
          task_id : dados.task_id
        }
        //console.log(mention_data)
        await pool.query("INSERT INTO notifications SET ?",mention_data);

         io.to(MenitonUser.id).emit('mention', {
          task_id: dados.task_id,
          name: MenitonUser.name,
          message : `${MenitonUser.name}, você foi mencionado por <b>${name}</b> na Tarefa <b>${dados.task_id}</b> 👇.<br>"<b>${dados.description}</b>"`
         });

      });
      //io.sockets.emit("getCountTasks", tasksCount);
     

    });


  }

  await pool.query(
    "INSERT INTO task_notes SET ?",
    data,
    function (err, result) {
      if (err) console.log(err);
      //atualizar o servidor como o telefone

      //res.redirect('/tasks/edit/' + task_id);
      res.send({ status: "added" });
    }
  );
});

router.get("/printer",  async function (req, res) {
  console.time("Print Time");
  const { getDefaultPrinter, getPrinters, print  } = require("pdf-to-printer");
  getPrinters().then(console.log);
  console.log("-------------");
  getDefaultPrinter().then(console.log);

  var html_to_pdf = require("html-pdf-node");

  let options = { format: "A4" };
  // Example of options with args //
  // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };


var file_name = `./tmp/${Math.random().toString(36).substr(7)}.pdf`
  var html_to_pdf = require("html-pdf-node");
  html_to_pdf.generatePdf({url: "http://localhost/tasks/print/5RS6J"},
     {
        path:file_name,
        //margin: { top: "150px", bottom: "150px", right: "0px", left: "0px" },
        format: "a4",
      }
    )
    .then((pdfBuffer) => {
      //console.log("PDF Buffer:-", pdfBuffer);
     //print(file_name).then(console.log);
     console.timeEnd("Print Time");



    });

 

  res.json({ status: true });
});


router.post("/services", async function (req, res) {
  const dados = req.body;
  var data = {
    task_id: dados.task_id,
    registration: dados.id_patrimonio,
    description: dados.description,
    service: dados.id_service,
    tecnico_name: req.user.name,
    id_tecnicos: req.user.id,
  };

  await pool.query(
    "INSERT INTO task_service SET ?",
    data,
    function (err, result) {
      if (err) console.log(err);
      //atualizar o servidor como o telefone

      //res.redirect('/tasks/edit/' + task_id);
      res.send({ status: "added" });
    }
  );
});

router.post("/sign", async function (req, res) {
  const dados = req.body;

  const data = await db.getTaskData(dados.task_id);
  const task_patrimonio = await db.getTaskPatrimoniobyIdTask(dados.task_id);
  var solicitante = data[0].name.toString().split(" ");

    let tpl =''
    task_patrimonio.forEach(function (patrimonio, index) {
      tpl += `_${patrimonio.registration} - ${patrimonio.name}_\n`;
    });

    console.log(dataTarefa)

  var dataTarefa = {
    task_id: dados.task_id,
    id_servidor: dados.id_servidor,
    sign_registration: dados.sign_registration,
    sign_name: dados.sign_name,
    sign_phone: dados.sign_phone,
    sign_whatsapp: dados.sign_whatsapp,
    sign_type: "papper",
    tecnico_name: req.user.name,
  };

  await pool.query("INSERT INTO task_sign SET ?", dataTarefa, function (err, result) {
    if (err) console.log(err);
    //atualizar o servidor como o telefone

    db.insertHistory("task", `Retirada de Patrimonio` , `${dados.sign_registration} - ${dados.sign_name} (${dados.sign_phone}) realizou a retirada dos patrimonios da Tarefa #${dados.task_id}`, req.user.id, dados.task_id)
    //enviando para o contato que deu entrada
   
    sendMsg({
      type: "text",
      message: `*${capitalizeFirstLetter(solicitante[0].toLowerCase())}*, o CPD da Prefeitura informa que os itens da *Tarefa #${dados.task_id}* que estavam em manutenção foram retirados.
            \nOs patrimônios:
            \n${tpl}
            \nJá foram devidamente retirados e estão sob responsabilidade do solicitante.
            \n*RETIRADO POR*
            \n ${dados.sign_registration} - ${dados.sign_name} (${dados.sign_phone})
            \n*Caso tenha alguma dúvida ou necessite de mais informações, por favor, entre em contato com o CPD.*
            \n\n_👉Mensagem automática, não é necessário responder._`,
      from: data[0].whatsapp,
    })

      db.insertHistory("task", `Notificação via Whatsapp` , `Notificação enviada as ${moment().format(
        "DD/MM/YYYY"
      )} às ${moment().format("HH:mm")} informando retirada de patrimonios do CPD.`, req.user.id, dados.task_id)

 //----------------------------



    //res.redirect('/tasks/edit/' + task_id);
    res.send({ status: "signed" });
  });
});


router.get("/print/:task_id", async function (req, res) {
  //res.send('Service home page');
  const task_id = req.params.task_id;
  const data = await db.getTaskData(task_id);
  const taskHistory = await db.getTaskHistory(task_id);
  const taskTecnico = await db.getTasktecnicos(task_id);
  const taskSign = await db.getTaskSign(task_id);
  console.log(taskSign, taskTecnico);

  var assingned = false;
 /* if (taskTecnico) {
    var tecnico_assingned = taskTecnico.map((el) => el.id_tecnico);
    assingned = tecnico_assingned.includes(req.user.id.toString());
  }*/

  res.render("admin/tasks/print.ejs", {
    user: req.user,
    data: data[0],
    task_history: taskHistory,
    task_tecnico: taskTecnico,
    taskSign: taskSign,
    assigned: assingned,
  });
});

router.get("/takeaway/:task_id", isLoggedIn, async function (req, res) {
  //res.send('Service home page');
  const task_id = req.params.task_id;
  const data = await db.getTaskData(task_id);
  const taskHistory = await db.getTaskHistory(task_id);
  const taskTecnico = await db.getTasktecnicos(task_id);
  const taskSign = await db.getTaskSign(task_id);
  console.log(taskSign);

  var assingned = false;
  if (taskTecnico) {
    var tecnico_assingned = taskTecnico.map((el) => el.id_tecnico);
    assingned = tecnico_assingned.includes(req.user.id.toString());
  }

  res.render("admin/tasks/takeaway.ejs", {
    user: req.user,
    data: data[0],
    task_history: taskHistory,
    task_tecnico: taskTecnico,
    taskSign: taskSign,
    assigned: assingned,
  });
});



router.get("/invite/:task_id", isLoggedIn, async function (req, res) {
  //res.send('Service home page');

  const task_id = req.params.task_id;
  const data = await db.getTaskData(task_id);

  if (data[0]) {
    var tecnico = {
      id_tecnico: req.user.id,
      name: req.user.name,
      task_id: data[0].task_id,
    };

    await pool.query("UPDATE tasks SET status = ? WHERE task_id = ?", [
      "pendding",
      data[0].task_id,
    ]);

    await pool.query(
      "INSERT INTO task_tecnico SET ?",
      tecnico,
      function (err, result) {
        //atualizar o servidor como o telefone
        db.insertHistory(
          "task",
          `Técnicos na Tarefa`,
          `${req.user.name} assumiu a tarefa ${moment().format(
            "DD/MM/YYYY"
          )} às ${moment().format("HH:mm")}.`,
          req.user.id,
          task_id
        );
        res.redirect("/tasks/view/" + task_id);
      }
    );
  }
});

router.get("/complete/:task_id", isLoggedIn, async function (req, res) {
  //res.send('Service home page');

  const task_id = req.params.task_id;
  const data = await db.getTaskData(task_id);
  const task_patrimonio = await db.getTaskPatrimoniobyIdTask(task_id);

  var solicitante = data[0].name.toString().split(" ");

  if (task_patrimonio) {
    let tpl =''
    task_patrimonio.forEach(function (patrimonio, index) {
      tpl += `_${patrimonio.registration} - ${patrimonio.name}_\n`;
    });

    if (data[0]) {
      var tecnico = {
        id_tecnico: req.user.id,
        name: req.user.name,
        task_id: data[0].task_id,
      };

      if (data[0].notification == 'on') {
      try {
        if(data[0].type == 'in'){


         sendMsg({
        type: "text",
        message: `*${capitalizeFirstLetter(
            solicitante[0].toLowerCase()
          )}*, o CPD da Prefeitura tem um *recado importante para você* sobre os itens que estão em manutenção.
      \nOs patrimônios:
      \n${tpl}
      \nJá estão prontos 🥳, aguardando sua retirada.
      \n*Providencie a retirada o mais breve possivel.*
      \n\n_👉Mensagem automática, não é necessario responder._
      `,
        from: data[0].whatsapp,
      })


      db.insertHistory("task", `Notificação via Whatsapp` , `Notificação enviada as ${moment().format(
        "DD/MM/YYYY"
      )} às ${moment().format("HH:mm")} para retirada do Patrimonio em manutenção.`, req.user.id, task_id)

    
        }

      
      } catch (error) {
        console.log("erro ao enviar");
      }
    }
    }
  }
  var date = new Date();
  await db.updateTaskDate(
    data[0].task_id,
    `${moment(date).add(1, "days").format("YYYY-MM-DD HH:mm:ss")}`
  );

  await pool.query("UPDATE tasks SET status = ? WHERE task_id = ?", [
    "complete",
    data[0].task_id,
  ]);

  db.insertHistory(
    "task",
    `Conclusão da Tarefa`,
    `${req.user.name} concluiu a tarefa ${moment().format(
      "DD/MM/YYYY"
    )} às ${moment().format("HH:mm")}.`,
    req.user.id,
    task_id
  );

  let tasksCount = await db.getTaskCount();
  io.sockets.emit("getCountTasks", tasksCount);

  res.redirect("/tasks/view/" + task_id);
});

router.get("/archive/:task_id", isLoggedIn, async function (req, res) {
  //res.send('Service home page');

  const task_id = req.params.task_id;
  const data = await db.getTaskData(task_id);

  if (data[0]) {
  
    var solicitante = data[0].name.toString().split(" ");
    var tecnico = {
      id_tecnico: req.user.id,
      name: req.user.name,
      task_id: data[0].task_id,
    };

    if (data[0].notification == 'on' && data[0].type == 'out') {
      //console.log(data[0].whatsapp, capitalizeFirstLetter(solicitante.toLowerCase(),data[0].task_id)

      try {

    sendMsg({
      type: "text",
      message: `*${capitalizeFirstLetter(
          solicitante[0].toLowerCase()
        )}*, a solicitação *#${data[0].task_id}* foi finalizada.
    \nFoi um prazer atendê-lo(a) 😄. Caso tenha alguma outra dúvida, não hesite em nos procurar novamente!
    \nAté mais e bom trabalho!
    \n\n_👉Mensagem automática, não é necessario responder._
    `,
      from: data[0].whatsapp,
    })
      
      } catch (error) {
        console.log("erro ao enviar" , error);
      }
    }

    await pool.query("UPDATE tasks SET status = ? WHERE task_id = ?", [
      "archive",
      data[0].task_id,
    ]);

    db.insertHistory(
      "task",
      `Conclusão e Arquivamento`,
      `${req.user.name} concluiu e arquivou a tarefa ${moment().format("DD/MM/YYYY")} às ${moment().format("HH:mm")}.`,
      req.user.id,
      task_id
    );

    let tasksCount = await db.getTaskCount();
    io.sockets.emit("getCountTasks", tasksCount);

    if (data[0].type == "in") {
      res.redirect("/tasks/takeaway/" + task_id);
    } else {
      res.redirect("/tasks/view/" + task_id);
    }
  }
});

router.get("/view/:task_id", async function (req, res) {
  //res.send('Service home page');
  const task_id = req.params.task_id;
  const data = await db.getTaskData(task_id);
  const taskHistory = await db.getTaskHistory(task_id);
  const taskTecnico = await db.getTasktecnicos(task_id);
  const mention = await db.getActiveTecnicos()
  const oficios = await db.getOficios(task_id)
  console.log(oficios)

  await pool.query("UPDATE notifications SET status = '1' WHERE task_id = ?", task_id);


  var assingned = false;
 /* if (taskTecnico) {
    var tecnico_assingned = taskTecnico.map((el) => el.id_tecnico);
    assingned = tecnico_assingned.includes(req.user.id.toString());
  }*/

  res.render("admin/tasks/view.ejs", {
    user: req.user,
    data: data[0],
    oficios : oficios,
    task_history: taskHistory,
    task_tecnico: taskTecnico,
    assigned: assingned,
    mentions: mention
  });
});



router.get("/oficio-view/:oficio_id", async function (req, res) {
  //res.send('Service home page');
  const oficio_id = req.params.oficio_id;
  const oficio = await db.getOficio(oficio_id);
  console.log(oficio)

  const task_id =oficio[0].task_id;
  const data = await db.getTaskData(task_id);
  const taskTecnico = await db.getTasktecnicos(task_id);
  //await pool.query("UPDATE notifications SET status = '1' WHERE task_id = ?", task_id);

  res.render("admin/tasks/oficio-view.ejs", {
    user: req.user,
    data: data[0],
    oficio : oficio[0],
    task_tecnico: taskTecnico
  });
});

router.get("/oficio/:task_id", async function (req, res) {
  //res.send('Service home page');
  const task_id = req.params.task_id;
  const data = await db.getTaskData(task_id);
  const taskHistory = await db.getTaskHistory(task_id);
  const taskTecnico = await db.getTasktecnicos(task_id);
  const mention = await db.getActiveTecnicos()

  await pool.query("UPDATE notifications SET status = '1' WHERE task_id = ?", task_id);


  var assingned = false;
  if (taskTecnico) {
    var tecnico_assingned = taskTecnico.map((el) => el.id_tecnico);
    assingned = tecnico_assingned.includes(req.user.id.toString());
  }

  res.render("admin/tasks/oficio.ejs", {
    user: req.user,
    data: data[0],
    task_history: taskHistory,
    task_tecnico: taskTecnico,
    assigned: assingned,
    mentions: mention
  });
});


router.post("/oficio", async function (req, res) {
  const dados = req.body;

  var taskInfo = await db.getTaskData(dados.task_id)
  var ano = new Date().getFullYear()
  var countOficios = await db.getOficiosYear(ano)
  var laudoNum = countOficios[0].count + 1


  var data = {
    task_id: dados.task_id,
    id_servidor : taskInfo[0].id_servidor,
    description: dados.description,
    description_end: dados.description_end,
    itens: `${dados.itens}`,
    tecnico_id: req.user.id,
    tipo: dados.tipo,
    number: laudoNum,
    year: ano,
    tecnico_name: req.user.name
    
  };
  //console.log(dados, data, countOficios[0].count, ano)



  pool.query("INSERT INTO oficios SET ?", data, function (err, result) {
    //console.log(data)
    //inserir a history de task criada pelo usuario x
    db.insertHistory(
      "task",
      `LAUDO DE ${dados.tipo} adicionado a tarefa`,
      `${req.user.name} adicionou o Laudo nº${laudoNum}/${ano} na tarefa.`,
      req.user.id,
      dados.task_id
    );
    console.log(err);
    
  
    data.id = result.insertId    
    res.json(data);

  });

  

});

router.get("/edit/:task_id", async function (req, res) {
  //res.send('Service home page');
  const task_id = req.params.task_id;
  const data = await db.getTaskData(task_id);
  const taskHistory = await db.getTaskHistory(task_id);
  const taskTecnico = await db.getTasktecnicos(task_id);

  console.log(data);

  var assingned = false;
  if (taskTecnico) {
    var tecnico_assingned = taskTecnico.map((el) => el.id_tecnico);
    assingned = tecnico_assingned.includes(req.user.id.toString());
  }

  res.render("admin/tasks/edit.ejs", {
    user: req.user,
    data: data[0],
    task_history: taskHistory,
    task_tecnico: taskTecnico,
    assigned: assingned,
  });
});

router.post("/create/patrimonio", async function (req, res) {
  const dados = req.body;

  var data = {
    registration: dados.registration,
    name: dados.name,
    location: dados.location,
    data_aquisicao: moment(dados.data_aquisicao).format("YYYY-MM-DD"),
    orgao: dados.orgao,
    responsavel: dados.responsavel,
    natureza: dados.natureza,
    valor_aquisicao: dados.valor_aquisicao,
    valor_atualizado: dados.valor_atualizado,
    centro_custo: dados.centro_custo,
    situacao: dados.situacao,
    task_id: dados.task_id,
  };

  pool.query("INSERT INTO task_patrimonio SET ?", data, function (err, result) {
    //console.log(data)
    //inserir a history de task criada pelo usuario x
    db.insertHistory(
      "task",
      `Novo Patrimônio Adicionado`,
      `${req.user.name} adicionou o patrimônio nº ${dados.registration} - ${dados.name} na tarefa.`,
      req.user.id,
      dados.task_id
    );
    console.log(err);
  });

  res.json(req.body);
  /* const term = req.query.term  ? req.query.term : ' '
    let rows = await pool.query("SELECT * FROM servidores WHERE registration LIKE ? OR name LIKE ? LIMIT 10", [`%${term}%`, `%${term}%`]);
      if (rows.length > 0) return   res.json(rows);
      return res.json({status: "Sorry! Not found."});*/
});



router.get("/show/archive", isLoggedIn, async function (req, res, next) {
  const status = req.params.status;
  res.render("admin/tasks_archive.ejs", {
    user : req.user,
    status: status
  });
});

router.get("/show/:status", isLoggedIn, async function (req, res, next) {
  const status = req.params.status;
  res.render("admin/tasks.ejs", {
    user : req.user,
    status: status
  });
});




module.exports = router;
