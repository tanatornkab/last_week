const express = require('express')
const app = express()
const pokemonRouter  = require('./pokemon/rounter_pokemon')
const faculityRouter  = require('./pokemon/rounter_faculity')
const userRouter  = require('./user/router')

/*Register middleware  
โปรแกรมเล็กๆหนึ่งตัว ที่ทำให้โปรแกรมสามารถ ทำงานเพิ่มเติมได้*/
app.use(express.json()) // อ่านจาก res แต่ไมไ่ด้ใช้ ส่ง ผ่าน req 
// app.use(pokemonRouter)
app.use('/pokemon',pokemonRouter)
app.use('/faculity',faculityRouter)
app.use('/member',userRouter)



module.exports= app