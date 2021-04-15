import express from 'express'
import data from './data.js'
import mongoose from 'mongoose'
import userRouter from './routers/userRouters.js'
import configSecret from './config.js'
import orderRouter from './routers/orderRouters.js'
import productRouter from './routers/productRouters.js'
import path from 'path'
import uploadRouter from './routers/uploadRouter.js'
import draftRouter from './routers/draftRouter.js'
import { Server } from 'socket.io'
import http from 'http'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(configSecret.mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.use('/api/drafts', draftRouter)
app.use('/api/uploads', uploadRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.get('/api/config/paypal', (req, res) => {
    res.send(configSecret.paypal_client_id || 'sb')
})
app.get('/api/fields', (req, res) => {
    res.send(data.fields)
})
app.get('/api/config/googlemap', (req, res) => {
    res.send(configSecret.google_api_key || 'gm')
})
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(express.static(path.join(__dirname, '/frontend/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
})

app.get('/', (req, res) => {
    res.send('Server is ready')
})
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})

const httpServer = http.Server(app)
const io = new Server(httpServer, { cors: { origin: '*' } })
const users = []

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        const user = users.find(x => x.socketId === socket.id)
        if (user) {
            user.online = false;
            console.log('Offline', user.name)
            const admin = users.find(x => x.isAdmin && x.online)
            if (admin) {
                io.to(admin.socketId).emit('updateUser', user)
            }
        }
    })

    socket.on('onLogin', (user) => {
        const updateUser = {
            ...user,
            online: true,
            socketId: socket.id,
            messages: []
        }
        const existUser = users.find(x => x._id === updateUser._id)
        if (existUser) {
            existUser.online = true;
            existUser.socketId = socket.id
        }
        console.log('Online', user.name)
        const admin = users.find(x => x.isAdmin && x.online)
        if (admin) {
            io.to(admin.socketId).emit('updateUser', updateUser)
        }
        if (updateUser.isAdmin) {
            io.to(updateUser.socketId).emit('listUsers', users)
        }
    })
})

const port = process.env.PORT || 5000;
httpServer.listen(port, () => console.log(`Server is running on localhost:${port}`))
// app.listen(port, () => console.log(`Server is running on localhost:${port}`))