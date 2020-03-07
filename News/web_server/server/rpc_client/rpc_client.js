var jayson = require('jayson');

var client = jayson.client.http('http://localhost:5000/api');

// Test RPC methods
function add(a, b, callback) {
    client.request('add', [a, b], function (err, error, response) {
        if(err) {
            throw err;
        }
        console.log(response);
        callback(response);
    });
}

function getNewsSummariesForUser(user_id, page_num, callback) {
    client.request('getNewsSummariesForUser', [user_id, page_num], function(err, error, response) {
        if(err) {
            throw err;
        }
        console.log(response);
        callback(response);
    })
}

function logNewsClickForUser(user_id, news_id) {
    client.request('logNewsClickForUser', [user_id, news_id], function (err, error, response) {
        if (err) {
            throw err;
        }
        console.log(response);
    })
}

module.exports = {
    add,
    getNewsSummariesForUser,
    logNewsClickForUser
}