let supabase = null;
let dbType = 'memory';
let isInitialized = false;

// In-memory storage fallback
const memoryStore = {
  users: new Map(),
  user_settings: new Map(),
  module_progress: new Map(),
  brain_assessments: new Map(),
  soul_assessments: new Map(),
  ai_agents: new Map(),
  activity_log: new Map(),
  content_calendar: new Map()
};

function initializeDatabase() {
  if (isInitialized) return;
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    // Trim environment variables to handle any whitespace issues
    const supabaseUrl = process.env.SUPABASE_URL?.trim();
    const supabaseKey = (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY)?.trim();

    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      dbType = 'supabase';
      console.log('Using Supabase PostgreSQL');
    } else {
      console.log('Using in-memory database (data will reset on deployment)');
    }
  } catch (err) {
    console.error('Database initialization error:', err.message);
    console.log('Falling back to in-memory database');
    dbType = 'memory';
  }
  
  isInitialized = true;
}

// Helper to generate simple ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== SUPABASE IMPLEMENTATION ====================

async function runSupabase(sql, params) {
  initializeDatabase();
  if (!supabase) throw new Error('Supabase not initialized');
  
  const sqlLower = sql.toLowerCase().trim();
  
  if (sqlLower.startsWith('insert')) {
    const table = extractTableName(sql);
    const data = buildDataObject(sql, params);
    const conflictCols = extractConflictColumns(sql);
    
    if (conflictCols.length > 0) {
      const { error } = await supabase
        .from(table)
        .upsert(data, { 
          onConflict: conflictCols.join(','),
          ignoreDuplicates: false
        });
      
      if (error) throw error;
      return { id: data.id, changes: 1 };
    } else {
      const { error } = await supabase
        .from(table)
        .insert(data);
      
      if (error) throw error;
      return { id: data.id, changes: 1 };
    }
  }
  
  if (sqlLower.startsWith('update')) {
    const table = extractTableName(sql);
    const { data: updateData, where } = parseUpdateSql(sql, params);
    
    let query = supabase.from(table).update(updateData);
    
    Object.entries(where).forEach(([col, val]) => {
      query = query.eq(col, val);
    });
    
    const { error } = await query;
    
    if (error) throw error;
    return { changes: 1 };
  }
  
  if (sqlLower.startsWith('delete')) {
    const table = extractTableName(sql);
    const conditions = parseWhereConditions(sql, params);
    
    let query = supabase.from(table).delete();
    
    Object.entries(conditions).forEach(([col, val]) => {
      query = query.eq(col, val);
    });
    
    const { error } = await query;
    
    if (error) throw error;
    return { changes: 1 };
  }
  
  throw new Error('Unsupported SQL operation in run(): ' + sql.substring(0, 50));
}

async function getSupabase(sql, params) {
  initializeDatabase();
  if (!supabase) return null;
  
  const table = extractTableName(sql);
  const conditions = parseWhereConditions(sql, params);
  
  let query = supabase.from(table).select('*');
  
  Object.entries(conditions).forEach(([col, val]) => {
    query = query.eq(col, val);
  });
  
  const { data, error } = await query.maybeSingle();
  
  if (error) throw error;
  return data;
}

async function allSupabase(sql, params) {
  initializeDatabase();
  if (!supabase) return [];
  
  const sqlLower = sql.toLowerCase();
  const table = extractTableName(sql);
  const conditions = parseWhereConditions(sql, params);
  
  let query = supabase.from(table).select('*');
  
  Object.entries(conditions).forEach(([col, val]) => {
    query = query.eq(col, val);
  });
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

// ==================== IN-MEMORY IMPLEMENTATION ====================

function runMemory(sql, params) {
  const sqlLower = sql.toLowerCase().trim();
  const table = extractTableName(sql);
  
  if (!memoryStore[table]) {
    memoryStore[table] = new Map();
  }
  
  if (sqlLower.startsWith('insert')) {
    const data = buildDataObject(sql, params);
    
    if (sqlLower.includes('on conflict')) {
      const conflictCols = extractConflictColumns(sql);
      const existingKey = findExistingKey(table, data, conflictCols);
      if (existingKey) {
        memoryStore[table].set(existingKey, { ...memoryStore[table].get(existingKey), ...data });
        return { id: data.id, changes: 1 };
      }
    }
    
    memoryStore[table].set(data.id, data);
    return { id: data.id, changes: 1 };
  }
  
  if (sqlLower.startsWith('update')) {
    const { data: updateData, where } = parseUpdateSql(sql, params);
    const keyField = Object.keys(where)[0];
    const keyValue = where[keyField];
    
    for (const [id, record] of memoryStore[table]) {
      if (record[keyField] === keyValue) {
        memoryStore[table].set(id, { ...record, ...updateData, updated_at: new Date().toISOString() });
        return { changes: 1 };
      }
    }
    return { changes: 0 };
  }
  
  if (sqlLower.startsWith('delete')) {
    const conditions = parseWhereConditions(sql, params);
    let deleted = 0;
    
    for (const [id, record] of memoryStore[table]) {
      let matches = true;
      for (const [col, val] of Object.entries(conditions)) {
        if (record[col] !== val) {
          matches = false;
          break;
        }
      }
      if (matches) {
        memoryStore[table].delete(id);
        deleted++;
      }
    }
    return { changes: deleted };
  }
  
  throw new Error('Unsupported SQL operation: ' + sql.substring(0, 50));
}

function getMemory(sql, params) {
  const table = extractTableName(sql);
  const conditions = parseWhereConditions(sql, params);
  
  if (!memoryStore[table]) return null;
  
  for (const record of memoryStore[table].values()) {
    let matches = true;
    for (const [col, val] of Object.entries(conditions)) {
      if (record[col] !== val) {
        matches = false;
        break;
      }
    }
    if (matches) return record;
  }
  
  return null;
}

function allMemory(sql, params) {
  const sqlLower = sql.toLowerCase();
  const table = extractTableName(sql);
  const conditions = parseWhereConditions(sql, params);
  
  if (!memoryStore[table]) return [];
  
  let results = [];
  
  for (const record of memoryStore[table].values()) {
    let matches = true;
    for (const [col, val] of Object.entries(conditions)) {
      if (record[col] !== val) {
        matches = false;
        break;
      }
    }
    if (matches) results.push(record);
  }
  
  return results;
}

function findExistingKey(table, data, conflictCols) {
  if (!memoryStore[table]) return null;
  
  for (const [key, record] of memoryStore[table]) {
    let matches = true;
    for (const col of conflictCols) {
      if (record[col] !== data[col]) {
        matches = false;
        break;
      }
    }
    if (matches) return key;
  }
  return null;
}

// ==================== SQL PARSING HELPERS ====================

function extractTableName(sql) {
  const insertMatch = sql.match(/INTO\s+(\w+)/i);
  if (insertMatch) return insertMatch[1];
  
  const fromMatch = sql.match(/FROM\s+(\w+)/i);
  if (fromMatch) return fromMatch[1];
  
  const updateMatch = sql.match(/UPDATE\s+(\w+)/i);
  if (updateMatch) return updateMatch[1];
  
  const deleteMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
  if (deleteMatch) return deleteMatch[1];
  
  throw new Error('Could not extract table name from SQL: ' + sql.substring(0, 100));
}

function extractConflictColumns(sql) {
  const match = sql.match(/ON CONFLICT\(([^)]+)\)/i);
  if (match) {
    return match[1].split(',').map(c => c.trim());
  }
  return [];
}

function buildDataObject(sql, params) {
  const colMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
  if (!colMatch) throw new Error('Could not parse INSERT columns from: ' + sql.substring(0, 100));
  
  const columns = colMatch[1].split(',').map(c => c.trim());
  const data = {};
  
  columns.forEach((col, i) => {
    if (i < params.length) {
      data[col] = params[i];
    }
  });
  
  return data;
}

function parseUpdateSql(sql, params) {
  const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s*$|\s+(?:ORDER|LIMIT|GROUP))/i);
  
  if (!setMatch) throw new Error('Could not parse UPDATE SET clause');
  
  const setClause = setMatch[1];
  const setCols = [];
  const setRegex = /(\w+)\s*=\s*\?/g;
  let match;
  while ((match = setRegex.exec(setClause)) !== null) {
    setCols.push(match[1]);
  }
  
  const where = {};
  if (whereMatch) {
    const whereClause = whereMatch[1];
    const whereRegex = /(\w+)\s*=\s*\?/g;
    const whereCols = [];
    while ((match = whereRegex.exec(whereClause)) !== null) {
      whereCols.push(match[1]);
    }
    
    const whereStartIndex = params.length - whereCols.length;
    whereCols.forEach((col, i) => {
      where[col] = params[whereStartIndex + i];
    });
  }
  
  const updateData = {};
  setCols.forEach((col, i) => {
    updateData[col] = params[i];
  });
  
  return { data: updateData, where };
}

function parseWhereConditions(sql, params) {
  const conditions = {};
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s*$|\s+(?:ORDER|LIMIT|GROUP))/i);
  
  if (whereMatch) {
    const whereClause = whereMatch[1];
    const regex = /(\w+)\s*=\s*\?/g;
    let match;
    let paramIndex = 0;
    
    while ((match = regex.exec(whereClause)) !== null) {
      if (paramIndex < params.length) {
        conditions[match[1]] = params[paramIndex];
        paramIndex++;
      }
    }
  }
  
  return conditions;
}

// Database helper that supports multiple backends
const dbAsync = {
  run: async (sql, params = []) => {
    initializeDatabase();
    if (dbType === 'supabase' && supabase) {
      return runSupabase(sql, params);
    }
    return runMemory(sql, params);
  },

  get: async (sql, params = []) => {
    initializeDatabase();
    if (dbType === 'supabase' && supabase) {
      return getSupabase(sql, params);
    }
    return getMemory(sql, params);
  },

  all: async (sql, params = []) => {
    initializeDatabase();
    if (dbType === 'supabase' && supabase) {
      return allSupabase(sql, params);
    }
    return allMemory(sql, params);
  }
};

// Initialize on first import
try {
  initializeDatabase();
} catch (err) {
  console.error('Initial database setup error:', err.message);
}

module.exports = { 
  supabase, 
  dbAsync, 
  get dbType() { return dbType; }, 
  memoryStore, 
  initializeDatabase 
};
