// Simple test script to verify database connection
require('dotenv').config();

const { dbAsync } = require('./api/database');

async function testDatabase() {
  console.log('Testing database connection...\n');
  
  try {
    // Test 1: Insert a test user
    console.log('Test 1: Insert user...');
    const { v4: uuidv4 } = require('uuid');
    const testUserId = uuidv4();
    
    await dbAsync.run(
      `INSERT INTO users (id, email, password, first_name, last_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [testUserId, `test_${Date.now()}@example.com`, 'hashedpassword', 'Test', 'User']
    );
    console.log('✓ User inserted:', testUserId);
    
    // Test 2: Retrieve the user
    console.log('\nTest 2: Retrieve user...');
    const user = await dbAsync.get(
      'SELECT * FROM users WHERE id = ?',
      [testUserId]
    );
    console.log('✓ User retrieved:', user ? user.email : 'NOT FOUND');
    
    // Test 3: Insert brain assessment
    console.log('\nTest 3: Insert brain assessment...');
    const assessmentId = uuidv4();
    await dbAsync.run(
      `INSERT INTO brain_assessments (id, user_id, section, question_id, answer, completed) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [assessmentId, testUserId, 'business_identity', 'legal_name', 'Test Business', 1]
    );
    console.log('✓ Brain assessment inserted');
    
    // Test 4: Retrieve assessments
    console.log('\nTest 4: Retrieve assessments...');
    const assessments = await dbAsync.all(
      'SELECT * FROM brain_assessments WHERE user_id = ?',
      [testUserId]
    );
    console.log('✓ Assessments retrieved:', assessments.length, 'records');
    
    // Test 5: Update user
    console.log('\nTest 5: Update user...');
    await dbAsync.run(
      `UPDATE users SET first_name = ?, updated_at = NOW() WHERE id = ?`,
      ['Updated', testUserId]
    );
    console.log('✓ User updated');
    
    // Test 6: Verify update
    console.log('\nTest 6: Verify update...');
    const updatedUser = await dbAsync.get(
      'SELECT first_name FROM users WHERE id = ?',
      [testUserId]
    );
    console.log('✓ Updated first_name:', updatedUser?.first_name);
    
    console.log('\n✅ All tests passed!');
    
    // Cleanup
    console.log('\nCleaning up test data...');
    await dbAsync.run('DELETE FROM brain_assessments WHERE user_id = ?', [testUserId]);
    await dbAsync.run('DELETE FROM users WHERE id = ?', [testUserId]);
    console.log('✓ Test data cleaned up');
    
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

// Check if Supabase credentials are configured
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
  console.error('\nPlease set these variables:');
  console.error('  export SUPABASE_URL=https://your-project.supabase.co');
  console.error('  export SUPABASE_SERVICE_KEY=your-service-role-key');
  process.exit(1);
}

testDatabase();