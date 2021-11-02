import express, { request, response } from 'express';
import { openDatabase } from './database.js';
const app = express();

app.use(express.json());

app.get('/api/ping', (request, response) => {
    response.send({
        message: 'pong'
    })
})

/* endpoints Products */

app.get('/api/products', async (request, response) => {
    const db = await openDatabase();
    const products = await db.all(`
        SELECT * FROM products
    `);
    db.close();
    response.send (products);
});

app.post('/api/products', async (request, response) => {
    const { name, mark, quantity, type, code, observation } = request.body;
    const db = await openDatabase();
    const data = await db.run(`
        INSERT INTO products (name, mark, quantity, type, code, observation)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [name, mark, quantity, type, code, observation]);
    db.close();
    response.send ({
        id: data.lastID,
        name, 
        mark,
        quantity,
        type, 
        code,
        observation
    });
});

app.put('/api/products/:id', async (request, response) => {
    const { name, mark, quantity, type, code, observation } = request.body;
    const { id } = request.params;

    const db = await openDatabase();

    const products = await db.get(`
        SELECT * FROM products WHERE id = ?
    `, [id]);
  
    if(products) {
        const data = await db.run(`
            UPDATE products
            SET name = ?,
                mark = ?,
                quantity = ?,
                type = ?,
                code = ?,
                observation = ?
            Where id = ?
         `, [name, mark, quantity, type, code, observation, id]);

         db.close();
        response.send({
            id,
            name,
            mark,
            quantity,
            type,
            code,  
            observation
        });
        return;
    }

    db.close();
    response.send(products || {});    
});

app.delete('/api/products/:id', async (request, response) => {
    const { id } = request.params;
    const db = await openDatabase();
    const data = await db.run(`
        DELETE FROM products 
         WHERE id = ?
    `, [id]);
    db.close();
    response.send ({
        id,
        message: `Produto [${id}] removido com sucesso`
    });
});

app.listen(8000, () => {
    console.log("Servidor rodando na porta 8000...");
})
