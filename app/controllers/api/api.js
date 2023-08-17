const express = require('express');
const router = express.Router();


var pool = require("../../config/pool-factory");

// Estrutura /API

router.get('/servidores', async function (req, res) { 
  console.log('iniiando')

  const servidores = require('../../data/servidores.json')
  async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
      }
  }

  var novos = []
  var atualizados = []
  
      await asyncForEach(servidores, async (servidor) => {
        var data = {
          registration: servidor.matriculaServidor,
          name: servidor.nomeServidor,
          location: servidor.lotacao,
          ve: servidor.vinculoEmpregaticio,
          role: servidor.cargoAtual,
         // phone: ""
        };


        //VERIFICA SEM O SERVIDOR EXISTE NO BANCODEDADOS ATRAES DA REGISTRATION
        let rows = await pool.query("SELECT * FROM servidores WHERE registration = ?", [data.registration]);
        if (rows.length > 0){
          //caso sim
          await pool.query("UPDATE servidores SET ?  WHERE registration = ?", [data, data.registration]);
         // atualizados.push(`AT Novo Servidor atualizado ${servidor.nomeServidor}`)
          console.log(`AT Novo Servidor atualizado ${servidor.nomeServidor}`)

        }else{
          //caso não
          pool.query("INSERT INTO servidores SET ?", data, function (err, result) {
           // novos.push(`NV Novo Servidor registrado ${servidor.nomeServidor}`)
            console.log(`NV Novo Servidor registrado ${servidor.nomeServidor}`)
            // console.log(err)
            // console.log(`${servidor.nomeServidor} registrado`)
           });
        }
          

  
      })

      console.log(novos, atualizados)

  res.json(novos, atualizados);
})



router.get('/patrimonio', async function (req, res) {
  console.log('iniiando')

  const itens = require('../../data/patrimonio.json')
  async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
      }
  }


  var novos = []
  var atualizados = []
  

  
      await asyncForEach(itens, async (item) => {
        var data = {
          registration: item.placaMatricula,
          name: item.descricao,
          data_aquisicao : item.dataAquisicao,
          location: item.unidade,
          orgao: item.orgao,
          responsavel: item.responsavel,
          natureza: item.natureza,
          valor_aquisicao : item.valorAquisicao,
          valor_atualizado: item.valorAtualizado,
          centro_custo : item.centroCusto,
          situacao : item.situacao
        };


        
        //VERIFICA SEM O SERVIDOR EXISTE NO BANCODEDADOS ATRAES DA REGISTRATION
        let rows = await pool.query("SELECT * FROM patrimonio WHERE registration = ?", [data.registration]);
        if (rows.length > 0){

           
          //caso sim
          await pool.query("UPDATE patrimonio SET ?  WHERE registration = ?", [data, data.registration]);
         // atualizados.push(`AT Novo Patrimonio atualizado ${data.name}`)
         console.log(`${rows[0].id} - ${data.name} atualizado`)

        }else{
          //caso não
          pool.query("INSERT INTO patrimonio SET ?", data, function (err, result) {
           // novos.push(`NV Novo Patrimonio registrado ${data.name}`)
            // console.log(err)
         //    console.log(`${data.name} registrado`)
           });
        }
          

      })
     // console.log(novos, atualizados)
  


console.log('acabou')
      res.json(novos, atualizados);
})

router.get('/about', function (req, res) {
  res.send('About this Api end');

})

module.exports = router;