const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f99nvg1.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {

        await client.connect();
        await client.db("admin").command({ ping: 1 });
        const ProductCollection = client.db('server-side-carsdata').collection('carsdata');
        const addtocartCollection = client.db('server-side-carsdata').collection('addcart');
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.post('/addproduct', async (req, res) => {
            const ProductsData = req.body;
            const result = await ProductCollection.insertOne(ProductsData);
            res.send(result);
            console.log(ProductsData)
        });
        app.post("/details/:id", async (req, res) => {
            const data = req.body;
            const id = req.params.id;

            const result = await addtocartCollection.insertOne(data);

            res.send(result);
        });

        

        app.delete("/details/:id", async (req, res) => {
            const id = req.params.id;
            console.log("delete", id);
            const query = { _id: new ObjectId(id), };
            const result = await addtocartCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });




        app.get("/products", async (req, res) => {
            const result = await ProductCollection.find().toArray();
            res.send(result);
        });



    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => { res.send('obj'); });
app.listen(port, () => { console.log(`Simple Crud is Running on port ${port}`); });


