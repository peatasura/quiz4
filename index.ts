import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, query, validationResult } from 'express-validator'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000
const SECRET = "SIMPLE_SECRET"

interface DbSchema {
  users: []
  
}

interface JWTPayload {
  username: string;
  password: string;
}

app.post('/login',
  (req, res) => {

    const { username, password } = req.body
    // Use username and password to create token.
    

    return res.status(200).json({
      message: 'Login succesfully',
    })
  })

app.post('/register',
  (req, res) => {

    const { username, password, firstname, lastname, balance } = req.body
    const hashPassword = bcrypt.hashSync(password,10)
    try{
      const user = await User.create({
        username,
      password:hashPassword,
      firstname,
      lastname,
      balance
      })
      res.status(200).json(
      {
        message:"Register successfully"
      }
      )
    }catch(e){
      if(e.username)
    }
    
    
  })

app.get('/balance',
  (req, res) => {
    const token = req.query.token as string
    try {
      const { username } = jwt.verify(token, SECRET) as JWTPayload
      res.json(token)
  
    }
    catch (e) {
      //response in case of invalid token
      res.status(401)
      res.json(
        {
          message:"Invalid token"
        }
      )
    }
  })

app.post('/deposit',
  body('amount').isInt({ min: 1 }),
  (req, res) => {

    //Is amount <= 0 ?
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ message: "Invalid data" })
  })

app.post('/withdraw',
  (req, res) => {
  })

app.delete('/reset', (req, res) => {

  //code your database reset here
  const id = Number(req.params.id)
  const token = req.query.token as string

  console.log(id)

  try {
    const data = jwt.verify(token, SECRET) as JWTPayload

    const todo =  data.destroy({ where: { id, userId: data.id } })

    if (todo === 0) {
      res.status(404)
      res.json({
        message: 'This todo not found'
      })
      return
    }

    res.json({
      message: 'Deleted todo'
    })

  } catch(e) {
    res.status(401)
    res.json({ message: e.message })
  }
  
  return res.status(200).json({
    message: 'Reset database successfully'
  })
})

app.get('/me', (req, res) => {
  return res.status(200).json({
    "firstname": "Pryat",
    "lastname" : "Kaewthep",
    "code" : 620610796,
    "gpa" : 4.00}) 
})

app.get('/demo', (req, res) => {
  return res.status(200).json({
    message: 'This message is returned from demo route.'
  })
})

app.listen(PORT, () => console.log(`Server is running at ${PORT}`))