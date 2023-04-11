import express from 'express'
const app = express()
import {createClient} from 'redis'

const redisUrl = "redis://localhost:6379"
const client = createClient({url:redisUrl})
client.on('error', err => console.log('Redis Client Error', err));
await client.connect()

app.use(express.json())

app.post("/", async (req, res) => {
  const {key, value} = req.body
  const response = await client.set(key, value)
  res.status(201).json(response)
})

app.get('/:key', async (req, res) => {
  const {key} = req.params
  const value = await client.get(key)
  res.status(200).json(value)
})

app.get('/', async (req, res) => {
  const keys = await client.KEYS('*')
  res.status(200).json(keys)
})

app.get('/posts/:id', async (req, res) => {
  const {id} = req.params
  
  const cachedPost = await client.get(`post-${id}`)

  if(cachedPost) {
    return res.json(JSON.parse(cachedPost))
  }
  
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  const data = await response.json()
  await client.set(`post-${id}`, JSON.stringify(data))
  return res.json(data)
})

const PORT = 8081
app.listen(PORT, console.log(`server is listening on port http://localhost:${PORT}`))