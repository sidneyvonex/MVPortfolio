import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!, { schema });

const EMAIL    = process.argv[2];
const PASSWORD = process.argv[3];

if (!EMAIL || !PASSWORD) {
  console.error('Usage: npm run create-admin <email> <password>');
  process.exit(1);
}

async function main() {
  const existing = await db.query.usersTable.findFirst({
    where: eq(schema.usersTable.email, EMAIL),
  });

  if (existing) {
    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    await db
      .update(schema.usersTable)
      .set({ passwordHash })
      .where(eq(schema.usersTable.email, EMAIL));
    console.log(`Updated password for existing admin: ${EMAIL}`);
  } else {
    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    await db.insert(schema.usersTable).values({ email: EMAIL, passwordHash });
    console.log(`Admin account created: ${EMAIL}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});