const express = require('express')
const router = express.Router()

const MongoClient  = require('mongodb').MongoClient
const MONGO_URL = "mongodb+srv://superadmin:tanatorn@cluster0-sjnca.gcp.mongodb.net/test?retryWrites=true&w=majority"
console.log(process.env.MONGO_URL)

router.get('/pokemons',async (req,res)=>{
    // let name = req.query.name  
    /* 
    http://localhost:3000/pokemons?name=testgetapi
    or pokemons?name=Pikachu&type=Water
    */

        const client =await MongoClient.connect(MONGO_URL,{
                useNewUrlParser:true,
                useUnifiedTopology:true
            }).catch((err)=>{
                console.log(err)
                res.status(400).json({ error : err})
        })
        let db = client.db('pokemondb')

        let r =await  db.collection('pokemons').find({}).toArray()
        .catch((err)=>{
            console.log(`Cannot find to Mongodb: ${err}`)
            res.status(400).json({error:err})
        })

        if(!r){
            res.status(400).json({error : 'data is not found'})
        }
    
    res.json(r)
})
router.post('/pokemons',async (req,res)=>{
    let name = req.body.name
    let type = req.body.type   
    let object = {
        name:name,
        type:type
    }    
    const client = await MongoClient.connect(MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true})
    .catch(err=>{
        console.log(err)
    })
    let db  = client.db('pokemondb')
    let r = await db.collection('pokemons').insertOne(object)
    .catch(err=>{
        res.status(400).json({error :err })
    })

    let result = { _id:object._id,
        name:object.name,
        type:object.type }
    res.status(200).json(result)
})


//  GET  http://localhost:3000/pokemon/999
// Request Parameters
router.get('/pokemon/:id',(req,res)=>{
    let id =req.params.id
    console.log(id)
    res.json({ pokemon_id : id })
})


const hander = require('./handerV1')

router.get('/version',hander.getVersion)


module.exports = router