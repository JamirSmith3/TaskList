import db from "#db/client";
import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database created.");

async function seed() {
  await db.query("BEGIN");
  try {
    const user = await createUser({
      username: "seeduser",
      password: "password123",
    });

    await createTask({ title: "Buy milk", done: false, user_id: user.id });
    await createTask({ title: "Write code", done: true, user_id: user.id });
    await createTask({ title: "Push to git", done: false, user_id: user.id });

    await db.query("COMMIT");
  } catch (e) {
    await db.query("ROLLBACK");
    throw e;
  }
}
