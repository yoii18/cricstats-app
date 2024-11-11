import { Client } from "pg";
import NEON_DB_KEY from "./config";
import { promises as fs } from 'fs'
import { parse } from "csv-parse/sync";
import path from "path";


const client = new Client({
    connectionString: NEON_DB_KEY
})

interface ColumnRecord {
    cols: string;
    dtypes: string;
}

async function createTable(filepath: string, tablename: string){
    await client.connect()

    try{
        const filecontent = await fs.readFile(filepath, 'utf-8');
        const records = parse(filecontent, {columns: true, skip_empty_lines: true}) as ColumnRecord[];

        if (records.length === 0){
            throw new Error("CSV file is empty")
        }

        const columns = records.map(record => {
            return `"${record.cols}" ${record.dtypes}`;
        })

        // console.log(columns);

        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tablename}(
            ${columns.join(',\n                ')}
        );
        `;
        const res = await client.query(createTableQuery);
        if (res){
            console.log(`Table: ${tablename} created successfully`);
        }
    } catch(error){
        console.error("Error in creating the table", error);
    } finally{
        client.end();
    }
}

const filepath_cols = path.join(__dirname, 'data', 'col_struct.csv');
// function executeAll(){
//     const filepath = path.join(__dirname, 'data', 'col_struct.csv');
//     createTable(filepath, 'IPL_Data');
// }

export { filepath_cols, createTable };