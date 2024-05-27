import {Ratelimit} from "@upstash/ratelimit"
import redis from "../lib/redisClient"


const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(3, "5 m") // set the limit for 1 h. it will be best.
})

export default ratelimit