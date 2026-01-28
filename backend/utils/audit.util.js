const db = require("../config/db");

// AUDIT LOGGING UTILITY
const logAction = async (actorId, action, targetId = null) => {
  try {
    await db.execute(
      "INSERT INTO audit_logs (actor_id, action, target_id) VALUES (?, ?, ?)",
      [actorId, action, targetId]
    );
  } catch (err) {
    // Audit failure should NOT crash main flow
    console.error("Audit log failed:", err.message);
  }
};

module.exports = {
  logAction
};
