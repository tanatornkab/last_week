const express = require('express')
const router = express.Router()
const bcript = require('bcryptjs')
const jwt  = require('jsonwebtoken')
const jwt_key= 'keytoken'

const MongoClient  = require('mongodb').MongoClient
const MONGO_URL = "mongodb+srv://superadmin:tanatorn@cluster0-sjnca.gcp.mongodb.net/test?retryWrites=true&w=majority"


router.post('/register',async (req,res)=>{
    let email = req.body.email
    let password = req.body.password
    let encodePassword = await bcript.hash(password,8)

    let object = {
        email:email,
        password:encodePassword
    }    
    const client = await MongoClient.connect(MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true})
    .catch(err=>{
        console.log(err)
    })
    let db  = client.db('BUU')
    let r = await db.collection('users').insertOne(object)
    .catch(err=>{
        res.status(400).json({error :err })
    })

    let result = { _id:object._id,
        email:object.email,
        password:object.password }
    res.status(201).json(result)
})

router.post('/sign-in',async (req,res)=>{
    let email = req.body.email
    let password = req.body.password

    let client =await  MongoClient.connect(MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true}).catch(err=>{
        console.log(err)
    })

    let db = client.db('BUU')
    let user =await  db.collection('users').findOne({ email:email})
    .catch(err=>{
        console.log(err)
        res.status(500).json(err)
    }) 
    if(!user){
        res.status(400).json({error :`Email: ${email} is not existed`})
        return
    }

    let valid = await bcript.compare(password, user.password)
    if(!valid){
        res.status(401),json({error: "ํemail/password is incorrect"})
    }
    // ต้องใช้อะไรในการเช็คบ้างก็ใส่ไปใน token 
    let token  = await jwt.sign(
        {email:user.email, id : user._id },//payload ข้อมูลที่ ถูก sign แล้วเก็บไว้ใน token
        jwt_key
        
        )

        res.json({token:token})
})
const auth= async (req,res, next)=>{

    let token = req.header('Authorization')
    let decoded 
    try{
        decoded = await jwt.verify(token,jwt_key)
        req.decoded= decoded
        next()
    }catch(err){
            console.log(`invalid token ${err}`)
            res.status(401).json({error:err})
            return
    }
}

router.get('/me',auth, async (req,res)=>{
    let email = req.decoded.email

    let client =await  MongoClient.connect(MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true}).catch(err=>{
        console.log(err)
    })
    let db = client.db('BUU')
    let user = await db.collection('users')
        .findOne({email:email})
        .catch((err)=>{
            console.log(`Cannot find to Mongodb: ${err}`)
            res.status(500).json({error:err})
        })


        if (!user ) {
            res.status(401).json({error: "data is not found"})
            return
        }
        delete user.password

    res.json(user)
})


module.exports = router