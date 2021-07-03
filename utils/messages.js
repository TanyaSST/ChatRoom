const moment= require('moment');

function formatMessage(username,textMessage) {
    return {
        username,
        textMessage,
        time:moment().format('DD-MM-YYYY h:mm')
     }
}
module.exports=formatMessage;