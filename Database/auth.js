const bcrypt = require('bcryptjs')
const saltRound = 10
const jwt = require('jsonwebtoken')



const hashPassword = async(password)=>{
    let salt = await bcrypt.genSalt(saltRound)
    let hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword;
}


const hashCompare = async(password, hashedPassword)=>{
   return await bcrypt.compare(password, hashedPassword)
}


const createToken = async(payload)=>{
   let token = await jwt.sign(payload, process.env.SECRT_KEY, {expiresIn: '2m'})
   return token;
}

const validate = async(req, res, next)=>{
     if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1]
        let data = await jwt.decode(token)
           if (Math.floor((+new Date())/1000) < data.exp) {
               next()
           } else { 
              res.status(402).send({
                message: "Token Expired...!"
              })
           }
     } else{
        res.status(400).send({
            message: "Token Not Found...!"
          })
     } 
}

const roleAdmin = async(req, res, next)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1]
        let data = await jwt.decode(token)
           if (data.role === 'admin') {
               next()
           } else { 
              res.status(402).send({
                message: "Only Admin are Allowed...!"
              })
           }
     } else{
        res.status(400).send({
            message: "Token Not Found...!"
          })
     } 
}

module.exports={hashPassword, hashCompare, createToken, validate, roleAdmin}