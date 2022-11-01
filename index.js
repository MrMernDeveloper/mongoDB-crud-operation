const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


//user: dbuser2
//password: vFCB14jbFAukBxGf



const uri = "mongodb+srv://dbuser2:vFCB14jbFAukBxGf@cluster0.h32cfqq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//async await
async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users');
        // const user = {
        //     name: 'mango test',
        //     email: 'mango@gmail.com'
        // }
        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        });
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await userCollection.findOne(query);
            res.send(user)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user);
            res.send(result)
        });
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updateUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updateUser, option);
            res.send(result);
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            // console.log('trying to delete', id)
            console.log(result)
            res.send(result)
        })
        
        // console.log(result)
    }
    finally {
        
    }
    
}

run().catch(err=>console.error(err));

app.get('/', (req, res) => {
    res.send('Hello from node mongo crud server')
});

app.listen(port, () => {
    console.log(`listen to port ${port}`);
})