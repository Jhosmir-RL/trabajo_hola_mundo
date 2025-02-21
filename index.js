require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const express = require('express');
const app = express();

const PORT = 3001;
const sql = neon(process.env.DATABASE_URL);

app.get('/', async (req, res) => {
    try {
        const versionResult = await sql`SELECT version()`;
        const { version } = versionResult[0];

        const tablesResult = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;

        let tablesData = {};
        for (let row of tablesResult) {
            const tableName = row.table_name;
            
            // Ejecuta la consulta manualmente como string
            const records = await sql(`SELECT * FROM "${tableName}"`);
            // hola mundo
            tablesData[tableName] = records;
        }

        res.json({
            version,
            tables: tablesData
        });
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
