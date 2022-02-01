const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let clients = [];

router.get('/subscribe', async (ctx, next) => {
    ctx.body = await new Promise(resolve => {
        clients.push(message => resolve(message))
    })
});

router.post('/publish', async (ctx, next) => {
    if (ctx.request.body.message) {
        clients.forEach(resolve => {
            resolve(ctx.request.body.message);
        })
        ctx.status = 200;
        clients = [];
    }
});

app.use(router.routes());

module.exports = app;
