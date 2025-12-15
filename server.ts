import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(express.json());
app.use(cors());

async function openDb() {
   return open({
    filename: '.database.sqlite',
    driver: sqlite3.Database
   })
}

async function initializeDb() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            value REAL,
            type TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`
    );
    console.log("database its ready")
}
initializeDb();

app.get('/transactions', async (req:Request, res: Response) => {
    const db = await openDb();
    const transactions = await db.all('SELECT * FROM transactions');
    return res.json(transactions);
})

app.post('/transactions', async (req:Request, res:Response) => {
    const { description, value, type, created_at} = req.body;
    const db = await openDb();

    await db.run(
        'INSERT INTO transactions (description, value, type, created_at) VALUES (?, ?, ?, ?)',
        [description, value, type, created_at || new Date().toISOString()]
    );

    return res.status(201).json({message: "Sucesso!"});
})

app.delete('/transactions/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    const db = await openDb();

    await db.run(
        'DELETE FROM transactions WHERE id = ?', [id]
    );

    return res.status(200).json({message: "OK!"});
})

app.put('/transactions/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    const { description, value, type, created_at } = req.body; 
    const db = await openDb();

    await db.run(
        'UPDATE transactions SET description = ?, value = ?, type = ?, created_at = ? WHERE id = ?', [description, value, type, created_at,id]
    );

    return res.json({ message: "Dados atualizados com sucesso!" });

});

app.listen(3333, () => {
    console.log(" Servidor rodando em http://localhost:3333")
})