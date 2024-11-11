import { filepath_data, insertData } from "./insertData";
import { createTable, filepath_cols } from "./model";

const tablename = 'IPL_data'

//createTable(filepath_cols, tablename);
insertData(filepath_data, tablename);
