import pkg from 'pg';
const { Client } = pkg;

async function checkDb() {
    const client = new Client({
        connectionString: "postgresql://postgres:postgres@localhost:5432/postgres"
    });
    try {
        await client.connect();
        const res = await client.query('SELECT * FROM projects LIMIT 10;');
        console.log("Projects in DB:", JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error("DB Error:", err.message);
    } finally {
        await client.end();
    }
}
checkDb();
