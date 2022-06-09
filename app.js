const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {Client} = require("@elastic/elasticsearch");
const client = new Client({
    node: "http://rh8-nodo1:9200",
    auth: {
        username: "elastic",
        password: "CJj1SfgRF3MTCeAhS1gL"
    }
})

client.info().then(console.log)

const app = express()

app.use(express.urlencoded({ extended: true })); // support encoded bodies

app.use(bodyParser.json())

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, () => {
    console.log("connected")
})

var wiki = require('./rutas.js');
// ...
app.use('/wiki', wiki);

app.post('/links/grid', function (req, res) {
    console.log(req.body);
    console.log(req.body.queryString);
});

app.get('/', async (req, res) => {

    const {body} = await client.search({
        index: 'mis-enlaces',
        body: {
        query: {
            match: { description: 'kubernetes' }
        }
        }
    });

    res.json(body.hits.hits);
    console.log(body.hits.hits);
});

/*
app.post("/products", (req, res) => {
    esClient.index({
        index: 'products',
        body: {
            "id": req.body.id,
            "name": req.body.name,
            "price": req.body.price,
            "description": req.body.description,
        }
    })
    .then(response => {
        return res.json({"message": "Indexing successful"})
    })
    .catch(err => {
         return res.status(500).json({"message": "Error"})
    })
})
*/