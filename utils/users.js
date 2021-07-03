const users=[];

function joinUserToRoom(id,username,room) {
    const user={id,username,room};
    users.push(user);
    return user;
}
//Geben user bei Id
function getUserById(id) {
    return users.find(u=>u.id === id);
}

function userLeave(id) {
    const index= users.findIndex(u=> u.id === id);
    if(index !== -1){
      return  (users.splice(index, 1))[0];
    }
}
function getUserRoom(room) {
    return users.filter(u=>u.room === room);
}

module.exports={
    joinUserToRoom,
    getUserById,
    userLeave,
    getUserRoom
};