import { redis } from "../index.js"
export const rateLimiter = async (req, res, next) => {

    const ip = req.ip;
    const key = `rate_limit:${ip}`;

    const requests = await redis.incr(key);

    if (requests === 1) {
        await redis.expire(key, 60);
    }

    const ttl = await redis.ttl(key);

    if (requests > 5) {
        return res.status(429).json({
            message: "Too Many Requests",
            retryAfter: ttl
        });
    }

    next();
};