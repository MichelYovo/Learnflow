import * as SQLite from "expo-sqlite";
import { ADDITIVE_COLUMNS, SCHEMA_VERSION, SQL_INIT } from "./schema";

const DB_NAME = "learnflow.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let ready = false;
let appliedSchemaVersion = -1;

export function isDatabaseReady(): boolean {
  return ready;
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openAndMigrate();
  }
  const db = await dbPromise;
  if (appliedSchemaVersion < SCHEMA_VERSION) {
    await migrateSchema(db);
    appliedSchemaVersion = SCHEMA_VERSION;
  }
  return db;
}

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync(SQL_INIT);
    await migrateSchema(db);
    appliedSchemaVersion = SCHEMA_VERSION;
    ready = true;
    return db;
  } catch (error) {
    dbPromise = null;
    ready = false;
    appliedSchemaVersion = -1;
    console.warn("[LearnFlow] SQLite init failed", error);
    throw error;
  }
}

async function migrateSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await ensureAdditiveColumns(db);
  await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
}

async function ensureAdditiveColumns(db: SQLite.SQLiteDatabase): Promise<void> {
  for (const [table, columns] of Object.entries(ADDITIVE_COLUMNS)) {
    const names = await listColumnNames(db, table);
    for (const column of columns) {
      if (names.has(column.name)) continue;
      try {
        await db.runAsync(`ALTER TABLE ${table} ADD COLUMN ${column.name} ${column.ddl}`);
        names.add(column.name);
        console.log(`[LearnFlow] SQLite +${table}.${column.name}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (/duplicate column name/i.test(message)) {
          names.add(column.name);
          continue;
        }
        console.warn(`[LearnFlow] migrate ${table}.${column.name}`, error);
        throw error;
      }
    }
  }
}

async function listColumnNames(db: SQLite.SQLiteDatabase, table: string): Promise<Set<string>> {
  const names = new Set<string>();
  try {
    const rows = await db.getAllAsync<Record<string, string>>(
      `SELECT name FROM pragma_table_info('${table}')`
    );
    for (const row of rows) {
      const name = row.name ?? Object.values(row)[0];
      if (name) names.add(name);
    }
  } catch {
    /* pragma_table_info indisponible */
  }
  if (names.size > 0) return names;
  try {
    const rows = await db.getAllAsync<Record<string, string>>(`PRAGMA table_info(${table})`);
    for (const row of rows) {
      const name = row.name ?? Object.values(row)[0];
      if (name) names.add(name);
    }
  } catch {
    /* table_info indisponible */
  }
  return names;
}

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  return getDatabase();
}

function isMissingColumnError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /no such column|has no column named/i.test(message);
}

export async function withDatabase<T>(
  work: (db: SQLite.SQLiteDatabase) => Promise<T>
): Promise<T> {
  const db = await getDatabase();
  try {
    return await work(db);
  } catch (error) {
    if (!isMissingColumnError(error)) throw error;
    await migrateSchema(db);
    appliedSchemaVersion = SCHEMA_VERSION;
    return work(db);
  }
}
