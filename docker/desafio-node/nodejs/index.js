const express = require('express')
const app = express()
const port = 3000

var mysql = require('mysql2');
var connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
});

connection.connect();

app.get('/', (req, res) => {
    connection.query(`INSERT INTO people (name) VALUES ('Marco')`);

    connection.query(`SELECT * from people`, (err, rows, fields) => {
        if (err) throw err

        var names = "";
        rows.forEach((val) => {
            names += `<li>ID: ${val.id} - Name: ${val.name}</li>`
        });

        res.send(`
            <h1>Full Cycle Rocks!</h1>
            <br>
            <br>
            <ul>
                ${names}
            </ul>
        `);
    });
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})