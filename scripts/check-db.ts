import 'dotenv/config';
import mongoose from 'mongoose';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env');
    process.exit(1);
  }

  const redacted = uri.replace(/\/\/([^:]+):[^@]+@/, '//$1:***@');
  console.log(`→ Connecting to ${redacted}`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    const admin = mongoose.connection.db?.admin();
    const ping = await admin?.ping();
    const dbName = mongoose.connection.db?.databaseName ?? '(default)';
    const collections = (await mongoose.connection.db?.listCollections().toArray()) ?? [];

    console.log('✅ Connected');
    console.log(`   DB name:       ${dbName}`);
    console.log(`   Ping:          ${JSON.stringify(ping)}`);
    console.log(`   Collections:   ${collections.length === 0 ? '(none yet)' : collections.map((c) => c.name).join(', ')}`);
  } catch (err) {
    console.error('❌ Connection failed');
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
