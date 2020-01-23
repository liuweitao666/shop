import axios from 'axios'
import { timeout } from 'q'

export function request(config,admin){
     const instace = axios.create({
         baseURL:'https://www.liulongbin.top:8888/api/private/v1/',
         timeout: 10000,
         method:'post',
     })
     return instace(config,admin)
}



