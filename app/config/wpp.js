
const makeWAclientet = require("@whiskeysockets/baileys").default;
const P = require("pino");
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

//AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, getAggregateVotesInPollMessage, makeCacheableSignalKeyStore, makeInMemoryStore, PHONENUMBER_MCC, proto, useMultiFileAuthState, WAMessageContent, WAMessageKey
/*
const {
    default: makeWAclientet,
    delay,
    MessageType,
    MessageOptions,
    Mimetype,
    useMultiFileAuthState,
    DisconnectReason,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    processSenderKeyMessage,
    makeInMemoryStore,
  } = require("@whiskeysockets/baileys");
*/

  const path = require("path")
  var fs = require('fs');

  if (!fs.existsSync('./app/sessions')){
      fs.mkdirSync('./app/sessions', { recursive: true });
      
  }



  const startSock = async() => {

    let { state, saveCreds } =  await useMultiFileAuthState(path.resolve('./app/sessions/'))

   /* const { state, saveState } = await useMultiFileAuthState(
      "./app/sessions/"
    );*/

    console.log(path.resolve('./app/sessions/'))
  
   


    const { version, isLatest } = await fetchLatestBaileysVersion()
	 console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)


    const client = makeWAclientet({
      version, 
      logger: P({ level: 'debug' }),
      printQRInTerminal: true,
      auth: state,
      //version: [2,2323,4],
      saveCreds
    });

    
  
  
    //await start(client);

    // store.bind(client.ev)

     

     client.ev.on('chats.set', () => {
          // can use "store.chats" however you want, even after the socket dies out
          // "chats" => a KeyedDB instance
          console.log('got chats', store.chats.all())
      })

      client.ev.on('contacts.set', () => {
          console.log('got contacts', Object.values(store.contacts))
      })
    
  
    client.ev.on("connection.update", (update) => {
      const { connection } = update;
      if (connection === "close") {
        console.log("closed connection =/");
        //startSock()
       
        process.exit();
  

  
      } else if (connection === "open") {
        console.log("opened connection");
      }
    });
  
    //const botNumber = client.user.id.includes(':') ? client.user.id.split(':')[0] + '@s.whatsapp.net' : client.user.id
  
    client.ev.on("messages.upsert", async (m) => {
      const msg = m.messages[0];
      if (
        !msg.key.fromMe &&
        m.type === "notify" &&
        m.messages[0].key.remoteJid !== "status@broadcast"
      ) {
        console.log("Enviando mensagem para: ", m.messages[0].key.remoteJid);
       // await processMessage(msg, client);
      }
    });
  
  
  
    //client.ev.on("presence.update", (m) => console.log(m));
    //client.ev.on("chats.update", (m) => console.log(m));
    //client.ev.on("contacts.update", (m) => console.log(m));
  
    client.ev.on("creds.update", saveCreds);

  

  module.exports = client;

 
}


startSock()

async function list(){

  //const useCursor = "after" in cursor ? cursor : null;
  messages =  await store.loadMessages('553788555554@s.whatsapp.net', '10', null);
  console.log(messages)

  fs.writeFile("./ms.json", JSON.stringify(messages), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 

}

//list()
//const useCursor = "after" in cursor ? cursor : null;


