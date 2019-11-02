const app = require('./app') // import express app 
const port = 3000

app.listen(port, () => console.log(`Pokemon API listening on port ${port}!`))