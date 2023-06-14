const express = require('express');
const app = express();

const port = 8080;
app.listen(port, () => {
    console.log(`listening on ${port}.`);
});
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/songrequest', (req, res) => {
    res.sendFile(__dirname + '/songrequest.html');
});

app.get('/see-songrequest', (req, res) => {
    res.sendFile(__dirname + '/seerequest.html');
});

app.get('/request', (req, res) => {
    res.sendFile(__dirname + '/request.html');
});