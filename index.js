import express from 'express'
import redis from 'redis'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import { v4 as uuidv4 } from 'uuid'
import cookieParser from 'cookie-parser'
import crypto from 'crypto'


dotenv.config()

const app = express()

let layoutVersion = 0

const layoutName = ['Layout1', 'Layout2', 'Layout3']

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(session({
    secret: 'dripshop secret',
    //sessionId: uuidv4(),
    cookie: { }
}))

const client = new redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

client.connect()


app.get('/', (req, res) => {
    console.log('dripshop')
    res.json({'result': "layout"})
})

app.get('/layout', async (req, res) => {
    let cookies = req?.cookies
    console.log('cookies: ', cookies)
    let sessionId = cookies?.sessionId
    console.log('sessionId', sessionId)
    try {
        let sessionLay = await client.get(sessionId)
        console.log(sessionLay)
        if(sessionLay) {
            res.status(200).json({'result': layoutName[parseInt(sessionLay) %3]})
            return
        }
    }
    catch(e) {
        console.log('new session', sessionId)
        res.cookie('sessionId', uuidv4())
    }

    //console.log('dripshop')
    let layVer = 0
    try {
        layVer = await client.get('layoutVersion')
    }
    catch(e) {
        console.log('error', e.message)
        res.status(500).json({'result': 'no layout'})
    }
    try {
        await client.set('layoutVersion', parseInt(layVer)+1)
        await client.set(sessionId, parseInt(layVer)+1 )
    }
    catch(e) {
        console.log('error', e.message)
        //res.json({'result': 'no layout'})
    }
   
    //layoutVersion++
    res.status(200).json({'result': layoutName[parseInt(layVer) %3]})
})


app.listen(4000, ()=> {console.log("server started")})