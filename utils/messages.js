const moment = require('moment')

const formatMessage = (username, text, isServer) => ({
    username,
    text,
    time: moment().format('h:mm:ss a'),
    isServer
})
module.exports = formatMessage;