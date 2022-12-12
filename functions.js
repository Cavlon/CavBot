const replies = require('./replies.json');
const insults = replies.insults;

const insult =  (id) => {
    rVal = Math.round(Math.random() * insults.length);
    return `<@${id}> ` + insults[rVal];
}

module.exports = {
    insult
}