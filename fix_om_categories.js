const pool = require('./backend/config/db');

async function fixCategories() {
  try {
    const [rows] = await pool.query("SELECT id, title_om FROM mezmur_categories");
    console.log("Before trim:");
    console.table(rows);
    
    let updated = 0;
    for (const row of rows) {
      if (row.title_om && typeof row.title_om === 'string') {
        const trimmed = row.title_om.trim();
        if (trimmed !== row.title_om) {
          await pool.query("UPDATE mezmur_categories SET title_om = ? WHERE id = ?", [trimmed, row.id]);
          updated++;
        }
      }
    }
    console.log(`Updated ${updated} categories.`);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
fixCategories();
