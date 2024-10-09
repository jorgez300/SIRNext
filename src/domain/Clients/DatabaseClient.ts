import pg from "pg";
//import { ObtieneVariable } from "../Helpers/VariablesEntornoHelper";

/*const poolConfig: PoolConfig = {
  user: "su",
  host: "localhost",
  password: "password",
  database: "sirnext",
  port: 39001,
};*/

//const pool = new pg.Pool(poolConfig);

const pool = new pg.Pool({
  connectionString: process.env["POSTGRES_URL"],
});

export const GetCursor = async (query: string) => {
  const data = await pool.query(query);
  return data.rows;
};

export const ExecQuery = async (query: string) => {
  await pool.query(query);
};
