const users = [];

 
const addUser = ({id, name, tecnico_id}) => {
   
    const existingUser = users.find((user) => {
       return user.name === name
   //item => item === 'one'
    })


    const user = {id,name,tecnico_id};
 
    users.push(user);
    return {user};
 
}
 
const removeUser = (id) => {
    const index = users.findIndex((user) => {
       return  user.id === id
    });
 
    if(index !== -1) {
        return users.splice(index,1)[0];
    }
}
 
const getUser = (tecnico_id) => { 
    
    let findUsers = users.filter(user => user.tecnico_id.indexOf(tecnico_id) !== -1);


return findUsers
}
 
const getUsersInRoom = (room) => users
        .filter((user) => user.room === room);
 
module.exports = {addUser, removeUser,
        getUser, getUsersInRoom};