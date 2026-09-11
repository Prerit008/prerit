// lib/db.ts
import mysql from "mysql2/promise";

declare global {
    // eslint-disable-next-line no-var
    var __mysqlPool: mysql.Pool | undefined;
}

function createPool() {
    console.log("DB work in progress....");
    return mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: "utf8mb4",
        timezone: "Z",
        // Return DATE/DATETIME as strings, not JS Date objects
        dateStrings: true,
    });
}

export const pool = global.__mysqlPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
    global.__mysqlPool = pool;
}