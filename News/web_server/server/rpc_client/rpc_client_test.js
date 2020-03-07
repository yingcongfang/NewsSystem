var client = require('./rpc_client');

client.add(1, 4, (response) => {
    console.assert(response == 3);
});

client.getNewsSummariesForUser('test_user', 1, (response) => {
    console.assert(response != null);
})

