const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000
// const { ObjectId } = require('mongodb')


// middleware

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.myfy8om.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const jobCollection = client.db('JobDB').collection('job');

        app.post('/job', async (req, res) => {
            const newJob = req.body
            console.log(newJob)
            const result = await jobCollection.insertOne(newJob)
            res.send(result)
        })

        app.get('/job', async (req, res) => {
            const cursor = jobCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/job/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.findOne(query)
            res.send(result)
        })

        app.get("/myJob/:email", async (req, res) => {
            console.log(req.params.email)
            const result = await jobCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })

        app.delete('/job/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.deleteOne(query)
            res.send(result)
        })

        // Update job 

        app.put('/job/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedJob = req.body

            const job = {
                $set: {
                    job_title: updatedJob.job_title,
                    job_category: updatedJob.job_category,
                    salary_range: updatedJob.salary_range,
                    job_description: updatedJob.job_description,
                    user_name: updatedJob.user_name,
                    job_posting_date: updatedJob.job_posting_date,
                    application_deadline: updatedJob.application_deadline,
                    job_applicants_number: updatedJob.job_applicants_number,
                    user_email: updatedJob.user_email,
                    job_banner_url: updatedJob.job_banner_url
                }
            }

            const result = await jobCollection.updateOne(filter, job, options);
            res.send(result)

        })

        // applied job
        const appliedJobCollection = client.db('JobDB').collection('appliedJob');

        app.post('/appliedJob', async (req, res) => {
            const newAppliedJob = req.body
            console.log(newAppliedJob)
            const result = await appliedJobCollection.insertOne(newAppliedJob)
            res.send(result)
        })

        // get applied jon in applied page

        app.get('/appliedJob', async (req, res) => {
            const cursor = appliedJobCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get("/appliedJob/:LoginEmail", async (req, res) => {
            console.log(req.params.LoginEmail)
            const result = await appliedJobCollection.find({ LoginEmail: req.params.LoginEmail }).toArray();
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Job Server is running')
})

app.listen(port, () => {
    console.log(`Job Server is running on port: ${port}`)
})