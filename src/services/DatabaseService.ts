import { PGliteWorker } from '@electric-sql/pglite/worker';

let db: PGliteWorker | null = null;

const initSchema = async (database: PGliteWorker) => {
  await database.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      gender TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      created_at DATE DEFAULT CURRENT_DATE
    );
  `);

  await database.query(`
    CREATE INDEX IF NOT EXISTS idx_patient_name ON patients (last_name, first_name);
  `);
};

export const initDatabase = async (): Promise<PGliteWorker> => {
  if (!db) {
    try {
      const workerInstance = new Worker(new URL('/pglite-worker.js', import.meta.url), {
        type: 'module',
      });
      db = new PGliteWorker(workerInstance);
      await initSchema(db);
    } catch (error) {
      throw error;
    }
  }
  return db;
};

const toISTDateString = (dateInput: Date = new Date()): string => {
  const istOffsetMinutes = 330;
  const utc = dateInput.getTime();
  const istTime = new Date(utc + istOffsetMinutes * 60 * 1000);

  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istTime.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const registerPatient = async (patientData: any): Promise<any> => {
  const database = await initDatabase();
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    email,
    phone,
    address,
  } = patientData;

  const dobIST = toISTDateString(new Date(date_of_birth));

  const result = await database.query(
    `INSERT INTO patients 
      (first_name, last_name, date_of_birth, gender, email, phone, address) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [
      first_name,
      last_name,
      dobIST,
      gender,
      email || null,
      phone || null,
      address || null,
    ]
  );

  return result.rows?.[0];
};

export const getAllPatients = async (): Promise<any[]> => {
  const database = await initDatabase();
  try {
    const result = await database.query(
      "SELECT * FROM patients ORDER BY last_name, first_name"
    );
    return result.rows || [];
  } catch (error) {
    throw error;
  }
};

export const searchPatientsByName = async (
  searchTerm: string
): Promise<any[]> => {
  const database = await initDatabase();
  try {
    const result = await database.query(
      `SELECT * FROM patients
       WHERE first_name ILIKE $1 OR last_name ILIKE $2
       ORDER BY last_name, first_name`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return result.rows || [];
  } catch (error) {
    throw error;
  }
};

export const executeQuery = async (
  sqlQuery: string,
  params: any[] = [],
  setError?: (msg: string) => void
): Promise<any> => {
  try {
    const database = await initDatabase();
    const result = await database.query(sqlQuery, params);
    return { success: true, data: result.rows || [], error: null };
  } catch (error: any) {
    const errorMessage = error.message || "An error occurred while executing the query";
    if (setError) {
      setError(errorMessage);
    }
    return {
      success: false,
      data: [],
      error: error.message || "An error occurred while executing the query",
    };
  }
};
