const pool = require('../config/db');

async function removeDuplicates() {
  console.log("Starting duplicate Mezmur cleanup...");
  
  try {
    // Find groups of duplicates based on title and category
    // We group by lowercased title to catch case differences
    const [rows] = await pool.query(`
      SELECT LOWER(TRIM(title)) as norm_title, category_id, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id ASC) as ids
      FROM mezmurs
      GROUP BY norm_title, category_id
      HAVING count > 1
    `);

    if (rows.length === 0) {
      console.log("No duplicate Mezmurs found!");
      process.exit(0);
    }

    console.log(`Found ${rows.length} groups of duplicates.`);
    let totalDeleted = 0;

    for (const group of rows) {
      const ids = group.ids.split(',').map(Number);
      
      // Keep the first ID (the oldest one)
      const keepId = ids[0];
      const deleteIds = ids.slice(1);
      
      console.log(`Title: "${group.norm_title}" (Category: ${group.category_id})`);
      console.log(`  Keeping ID: ${keepId}`);
      console.log(`  Deleting IDs: ${deleteIds.join(', ')}`);
      
      // Delete the duplicates
      const [result] = await pool.query(
        "DELETE FROM mezmurs WHERE id IN (?)",
        [deleteIds]
      );
      
      totalDeleted += result.affectedRows;
    }

    console.log(`\nCleanup complete! Deleted a total of ${totalDeleted} duplicate Mezmurs.`);
    process.exit(0);

  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
}

removeDuplicates();
