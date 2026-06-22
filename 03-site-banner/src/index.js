import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379"
);

const BANNER_KEY = "app:banner";

app.post(('/banner'),async(req,res)=>{
    const {message} = req.body;

    await redis.set(BANNER_KEY,message || "Default banner");

    return res.json({
        message : 'welcome to chai aur redis playlist',
        success : true
    })
});


app.get('/banner',async(req,res)=>{
    try {
        const banner = await redis.get(BANNER_KEY);
        return res.json({
            message: 'banner found successfully',banner,
            success : true
        })
    } 
    catch (error) {
        return res.json({
            error : error.message,
            success : false,
            message : 'Banner not found'
        })
    }
});


app.delete('/banner',async(req,res)=>{
    await redis.del(BANNER_KEY);
    return res.json({
        message : 'Banner deleted',
        success : true
    })
});

app.get('/banner/exists',async(req,res)=>{
    const exists = await redis.exists(BANNER_KEY);
    return res.json({
        exists: Boolean(exists),
        success : true
    })
});


app.listen(3000,()=>{
    console.log('Server started on port 3000');
});