const moment = require('moment');
moment.locale('PL');
function formatMessage(username,text){
    return{
        username,
        text,
        time:moment().format('LT')
    }
}
module.exports = formatMessage;