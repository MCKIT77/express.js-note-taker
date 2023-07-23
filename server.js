const express = require('express');
const app = express();

const PORT = 3306;

app.use(express.static('public'));


app.listen(PORT, () => {
    console.log(`Visit localhost:${PORT} to view app`)
});