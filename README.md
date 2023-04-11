Redis with Node Crash Course - Cache Data for Improved Performance
==================================================================

https://www.youtube.com/watch?v=AzQ6_DTcG6c&ab_channel=LaithAcademy

1. redis docker container를 다음과 같이 만든다.
docker run -p 6379:6379 -d --name redis redis:latest
-> redis:7.0.10 컨테이너가 만들어졌다.

2. express, redis를 설치하고 관련 route를 만든다.
- redis v.4부터는 자동 연결이 안되고, 다음과 같이 connect()를 명시적으로 해야 한다.
```javascript
    import { createClient } from 'redis';   
    const client = createClient();   
    await client.connect();   
    await client.ping();   
```
```javascript
  import {createClient} from 'redis'

  const redisUrl = "redis://localhost:6379"
  const client = createClient({url:redisUrl})
  client.on('error', err => console.log('Redis Client Error', err));
  await client.connect()
```

3. 다음과 같이 redis의 캐쉬서버를 세팅할 수 있다.
```javascript
app.get('/posts/:id', async (req, res) => {
  const {id} = req.params
  
  const cachedPost = await client.get(`post-${id}`)  // 캐쉬 서버에 있는지 확인

  if(cachedPost) {
    return res.json(JSON.parse(cachedPost))
  }
  
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  const data = await response.json()
  await client.set(`post-${id}`, JSON.stringify(data))  // 캐쉬서버에 저장
  return res.json(data)
})
```