const express = require("express");
const sql = require("mssql");
const app = express();
app.use(express.json()); // Permitir envío de datos en formato JSON

app.get("/", (req, res) => {
    res.send("¡API funcionando correctamente en localhost!");
});

// 🔗 Configuración de la conexión a Azure SQL Database
const config = {
    server: "rfidserver17.database.windows.net", // Servidor SQL en Azure
    database: "rfidDB", // Base de datos
    user: "AdminSQL", // Usuario
    password: "CloudP1SQL", // Contraseña
    options: {
        encrypt: true, // Encriptar conexión
        trustServerCertificate: false
    }
};

// 📡 Endpoint para recibir datos RFID y almacenarlos en dbo.RegistrosRFID
app.post("/rfid", async (req, res) => {
    const { tag_id, fecha } = req.body;
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`INSERT INTO dbo.RegistrosRFID (tag_id, fecha) VALUES ('${tag_id}', '${fecha}')`);
        res.send({ message: "Lectura RFID almacenada con éxito", tag_id });
    } catch (error) {
        console.error("Error en la conexión:", error);
        res.status(500).send(error);
    }
});

// 🔎 Endpoint para probar conexión con la tabla dbo.RegistrosRFID
app.get("/test", async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT TOP 5 * FROM dbo.RegistrosRFID");
        res.send(result.recordset);
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).send(error);
    }
});

// 🚀 Iniciar el servidor en el puerto 3000
app.listen(3000, () => console.log("API ejecutándose en http://localhost:3000"));