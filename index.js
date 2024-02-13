const express = require("express");
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aoxwnlj.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {


    try {
        const productCollection = client.db("takeALot").collection("allProducts");
        const categoryListCollection = client.db("takeALot").collection("categoryList");
        const countryListCollection = client.db("takeALot").collection("countryList");

        app.get("/total-products", async (req, res) => {
            const result = await productCollection.estimatedDocumentCount();
            res.send({ totalProduct: result });
        })

        app.get("/all-category" , async(req,res)=>{
            const result = await categoryListCollection.find({}).toArray();
            res.send(result)
        })
        app.get("/all-country-code" , async(req,res)=>{
            const result = await countryListCollection.find({}).toArray();
            res.send(result)
        })

        // Houses Collection
        app.get("/all-products", async (req, res) => {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const skip = page * limit;
            // const queryParams = req.query;

            const products = await productCollection.find({}).skip(skip).limit(limit).toArray();
            res.send(products)


        })

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Server successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Takealot Server is running");
})

app.listen(port, () => {
    console.log(`This app listening at port ${port}`);
})