const express = require('express')
const router = express.Router()
const MongoCilent = require('mongodb').MongoClient

router.get('/version',async (req,res)=>{
    
    const client = await MongoClient.connect(MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true})
    .catch(err=>{
        console.log(err)
    })

    const db = client.db('faculty')
    

})



module.exports = router