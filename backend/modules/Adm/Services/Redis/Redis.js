const { ServiceProvider } = require('@adonisjs/fold')

class Redis extends ServiceProvider {
  register() {
    this.app.singleton('ADM/Redis', () => {
      require('dotenv').config()
      const redisLib = require('redis');
      const redis = redisLib.createClient({ host: process.env.REDIS_SERVER || null })
      redis.on("error", err => {
        console.log("[Redis] Error ", err);
      });
      return new (class Redis {
        async get(key){
          return new Promise((resolve, reject)=>{
            redis.get(key, (error, result) => {
              if (error) return reject(error);
              resolve(JSON.parse(result));
            })
          })
        }

        set(key, value){
          redis.set(key, JSON.stringify(value) );
        }

        async keys(pattern){
          return new Promise((resolve, reject)=>{
            redis.keys(pattern, (error, result) => {
              if (error) return reject(error);
              resolve(result);
            })
          })
        }

        async getAll(pattern){
          return new Promise((resolve, reject)=>{
            redis.keys(pattern, async (err, keys) =>  {
              if (err){
                console.log(err);
                reject(err);
              }
              if(keys){
                resolve (await Promise.all( keys.map((key)=>{
                    return new Promise((resolve, reject)=>{
                      redis.get(key, (error, result) => {
                        if (error) return reject(error);
                        resolve(JSON.parse(result));
                      })
                    })
                  })
                ));
              }
            });
          })
        }

        async delete(key){
          return new Promise((resolve, reject)=>{
            redis.del(key, (error, result) => {
              if (error) return reject(error);
              resolve(JSON.parse(result));
            });
          })
        }

        async deleteAll(pattern){
          return new Promise((resolve, reject)=>{
            redis.keys(pattern, async (err, keys) =>  {
              if (err){
                console.log(err);
                reject(err);
              }
              if(keys){
                resolve (await Promise.all( keys.map((key)=>{
                    return new Promise((resolve, reject)=>{
                      redis.del(key, (error, result) => {
                        if (error) return reject(error);
                        resolve(JSON.parse(result));
                      });
                    })
                  })
                ));
              }
            });
          })
        }
      })
    })
  }
}

module.exports = Redis;
