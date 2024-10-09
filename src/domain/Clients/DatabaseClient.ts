import pg, { PoolConfig } from "pg";

const poolConfig: PoolConfig = {
  user: "su",
  host: "localhost",
  password: "password",
  database: "sirnext",
  port: 39001,
};

const pool = new pg.Pool(poolConfig);

export const GetCursor = async (query: string) => {
  const data = await pool.query(query);
  return data.rows;
};

export const ExecQuery = async (query: string) => {
    const data = await pool.query(query);
  
    console.log(data);
  };