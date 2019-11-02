let hander = {}

hander.getVersion = (req,res)=>{
    
    return res.json({ version: "version 1 " })
}

module.exports = hander