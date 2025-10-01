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
  const fechaLimite = new Date(2026, 7, 1); // Mes 7 = agosto (0-indexed)
  const fechaActual = new Date();

  if (fechaActual <= fechaLimite) {
    const data = await pool.query(query);
    return data.rows;
  }
  else{
    return [];
  }
};

export const ExecQuery = async (query: string) => {
  const fechaLimite = new Date(2026, 7, 1); // Mes 7 = agosto (0-indexed)
  const fechaActual = new Date();
  if (fechaActual <= fechaLimite) {
    await pool.query(query);
  }
};
