import { Client } from "pg";
import NEON_DB_KEY from "./config";
import { promises as fs } from 'fs'
import { parse } from "csv-parse/sync";
import path from "path";


const client = new Client({
    connectionString: NEON_DB_KEY
})

// interface ColumnRecord {
//     cols: string;
//     dtypes: string;
// }

async function insertData(filepath: string, tablename: string){
    await client.connect();

    try{
        const fileContent = await fs.readFile(filepath, 'utf-8');
        const records = parse(fileContent, { columns: true, skip_empty_lines: true });

        if (records.length === 0) {
            throw new Error('CSV file is empty');
        }

        const columns = Object.keys(records[0]);
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

        const checkQuery = `SELECT EXISTS(SELECT 1 
                            FROM ${tablename} 
                            WHERE match_id = $1 AND innings = $2 AND ball = $3)`;
        const insertQuery = `
            INSERT INTO ${tablename} (${columns.join(', ')})
            VALUES (${placeholders})
        `;

        let insertedCount = 0;
        let skippedCount = 0;

        for (const record of records) {
            const values = columns.map(col => {
                return record[col];
            });

            const { rows } = await client.query(checkQuery, [record.match_id, record.innings, record.ball]);
            const exists = rows[0].exists;

            if (!exists) {
                await client.query(insertQuery, values);
                insertedCount++;
            } else {
                skippedCount++;
                console.log(`skipped: ${skippedCount}`);
            }

            // await client.query(insertQuery, values);
        }

        console.log(`Data imported successfully into ${tablename}`);
        console.log(`Inserted: ${insertedCount} rows`);
        console.log(`Skipped: ${skippedCount} rows`);

    } catch(error){
        console.error(`Error in inserting data: ${error}`);
    } finally{
        client.end();
    }

}

const filepath_data = path.join(__dirname, 'data', 'IPL_cleaned.csv');
// insertData(filepath, 'IPL_Data');

export {insertData, filepath_data};
