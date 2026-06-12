const { createClient } = require('@supabase/supabase-js');

// Database configuration - supports multiple backends
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

// Create Supabase client
let supabase = null;
let dbType = 'memory'; // Default fallback

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  dbType = 'supabase';
  console.log('Using Supabase PostgreSQL');
} else if (postgresUrl) {
  dbType = 'postgres';
  console.log('Using PostgreSQL (Neon/other)');
} else {
  console.log('Using in-memory database (data will reset on deployment)');
}

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

// Helper to generate simple ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Database helper that supports multiple backends
const dbAsync = {
  // For INSERT operations - returns { id, changes }
  run: async (sql, params = []) => {
    // Use Supabase if available
    if (dbType === 'supabase' && supabase) {
      return runSupabase(sql, params);
    }
    
    // Fallback to in-memory
    return runMemory(sql, params);
  },

  // For SELECT single row
  get: async (sql, params = []) => {
    if (dbType === 'supabase' && supabase) {
      return getSupabase(sql, params);
    }
    
    return getMemory(sql, params);
  },

  // For SELECT multiple rows
  all: async (sql, params = []) => {
    if (dbType === 'supabase' && supabase) {
      return allSupabase(sql, params);
    }
    
    return allMemory(sql, params);
  }
};

// ==================== SUPABASE IMPLEMENTATION ====================

async function runSupabase(sql, params) {
  const sqlLower = sql.toLowerCase().trim();
  
  // Handle INSERT with ON CONFLICT (UPSERT)
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
  
  // Handle UPDATE
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
  
  // Handle DELETE
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
  const sqlLower = sql.toLowerCase();
  const table = extractTableName(sql);
  const conditions = parseWhereConditions(sql, params);
  
  // Check if this is a GROUP BY query
  if (sqlLower.includes('group by')) {
    const groupCol = extractGroupByColumn(sql);
    
    let query = supabase.from(table).select('*');
    
    Object.entries(conditions).forEach(([col, val]) => {
      query = query.eq(col, val);
    });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Manual grouping
    const grouped = {};
    (data || []).forEach(row => {
      const key = row[groupCol];
      if (!grouped[key]) grouped[key] = { [groupCol]: key, count: 0 };
      grouped[key].count++;
    });
    
    return Object.values(grouped);
  }
  
  let query = supabase.from(table).select('*');
  
  Object.entries(conditions).forEach(([col, val]) => {
    query = query.eq(col, val);
  });
  
  // Handle date filtering for activity log queries
  if (sqlLower.includes('activity_log') && sqlLower.includes('>')) {
    const { data, error } = await query;
    if (error) throw error;
    
    const daysMatch = sql.match(/-(\d+)\s*days/i);
    if (daysMatch) {
      const daysAgo = parseInt(daysMatch[1]);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      return (data || []).filter(row => new Date(row.created_at) > cutoffDate);
    }
    return data || [];
  }
  
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
  
  // Handle INSERT
  if (sqlLower.startsWith('insert')) {
    const data = buildDataObject(sql, params);
    
    // Check for ON CONFLICT (simple implementation)
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
  
  // Handle UPDATE
  if (sqlLower.startsWith('update')) {
    const { data: updateData, where } = parseUpdateSql(sql, params);
    const keyField = Object.keys(where)[0];
    const keyValue = where[keyField];
    
    // Find matching record
    for (const [id, record] of memoryStore[table]) {
      if (record[keyField] === keyValue) {
        memoryStore[table].set(id, { ...record, ...updateData, updated_at: new Date().toISOString() });
        return { changes: 1 };
      }
    }
    return { changes: 0 };
  }
  
  // Handle DELETE
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
  
  // Handle GROUP BY
  if (sqlLower.includes('group by')) {
    const groupCol = extractGroupByColumn(sql);
    const grouped = {};
    
    results.forEach(row => {
      const key = row[groupCol];
      if (!grouped[key]) grouped[key] = { [groupCol]: key, count: 0 };
      grouped[key].count++;
    });
    
    return Object.values(grouped);
  }
  
  // Handle date filtering
  if (sqlLower.includes('activity_log') && sqlLower.includes('>')) {
    const daysMatch = sql.match(/-(\d+)\s*days/i);
    if (daysMatch) {
      const daysAgo = parseInt(daysMatch[1]);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      return results.filter(row => new Date(row.created_at) > cutoffDate);
    }
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

function extractGroupByColumn(sql) {
  const match = sql.match(/GROUP\s+BY\s+(\w+)/i);
  return match ? match[1] : null;
}

module.exports = { supabase, dbAsync, dbType, memoryStore };