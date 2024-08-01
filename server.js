const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body').default;
const cors = require('@koa/cors');
// const uuid = require('uuid');

const app = new Koa();
const router = new Router();

const notes = [
    {
        id: '1',
        text: 'сделать что то',
    },
    {
        id: '2',
        text: 'ничего не делать',
    },
];

/**
 * Middleware для обработки CORS-запросов.
 * @function
 */
app.use(cors());

/**
 * Middleware для обработки данных в формате JSON.
 * @function
 */
app.use(koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
}));

// GET
router.get('/', (ctx, next) => {
    ctx.status = 200;
    ctx.body = { GET: 'ok', };
});

/**
 * GET-запрос для получения заметок.
 * @route {GET} /notes
 * @param {object} ctx - Контекст запроса.
 */
router.get('/notes', async (ctx, next) => {
    await new Promise(resolve => setTimeout(resolve, 1));

    ctx.status = 200;
    ctx.body = { notes: notes };
});

/**
 * POST-запрос для создания новой заметки.
 * @route {POST} /notes
 * @param {object} ctx - Контекст запроса.
 */
router.post('/notes', async (ctx, next) => {
    const { id, text } = ctx.request.body;

    // console.log(text)

    notes.push({ id, text });

    ctx.status = 200;
    ctx.body = { POST: 'ok' };
});

/**
 * DELETE-запрос для удаления заметки по ID.
 * @route {DELETE} /notes/:id
 * @param {object} ctx - Контекст запроса.
 */
router.delete('/notes/:id', async (ctx, next) => {
    const noteId = ctx.params.id;
    const index = notes.findIndex((o) => o.id === noteId);

    if (index !== -1) {
        notes.splice(index, 1);
    }

    // console.log('index', index);
    // console.log('noteId', noteId);

    ctx.status = 200;
    ctx.body = { DELETE: 'ok' };
});

const messages = [];
let nextId = 1;

/**
 * GET-запрос для получения сообщений с определенного ID.
 * @route {GET} /messages
 * @param {object} ctx - Контекст запроса.
 */
router.get("/messages", async (ctx) => {
    const from = Number(ctx.request.query.from);

    // console.log(from);

    if (from === 0 || isNaN(from)) {
        ctx.body = messages;
        return;
    }

    const fromIndex = messages.findIndex((o) => o.id === from);
    if (fromIndex === -1) {
        ctx.body = messages;
        return;
    }
    ctx.body = messages.slice(fromIndex + 1);
});

/**
 * POST-запрос для добавления нового сообщения.
 * @route {POST} /messages
 * @param {object} ctx - Контекст запроса.
 */
router.post("/messages", (ctx) => {
    const message = { ...ctx.request.body, id: nextId++ };
    messages.push(message);
    ctx.status = 204;
    ctx.body = { POST: 'ok' };
});

app
    .use(router.routes())
    .use(router.allowedMethods());

const port = process.env.PORT || 7070;

/**
 * Запуск сервера на указанном порту.
 * @function
 * @param {number} port - Порт, на котором будет запущен сервер.
 */
app.listen(port, () => console.log(`Сервер запущен на порту ${port}.`));
