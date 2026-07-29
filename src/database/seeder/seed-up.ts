import { Logger } from '@nestjs/common';
import { Helpers } from 'src/common/utils/helper-utils';
import { dataSource } from 'src/database/datasources';
import { USER } from 'src/database/DBTableNames';
import * as bcrypt from 'bcrypt';

const seedUp = async () => {
  const logger = new Logger('seeder');

  try {
    console.log('🚀 Seeder starting...');

    await dataSource.initialize();
    console.log('✅ Database connection successful');

    const superAdmin = await Helpers.fetchMockFile(
      'src/database/seeder/data',
      'super-admin',
    );

    console.log(`📦 Loaded ${superAdmin.length} admin record(s) from file`);

    if (!superAdmin.length) {
      console.log('⚠️ No data found in seed file. Exiting...');
      process.exit(0);
    }

    const existing = await dataSource.query(
      `SELECT id FROM "users" WHERE type = $1 LIMIT 1`,
      ['super_admin'],
    );

    if (existing.length > 0) {
      console.log('⚠️ Super Admin already exists. Skipping...');
      process.exit(0);
    }

    await dataSource.query(`TRUNCATE TABLE "users" RESTART IDENTITY CASCADE`);

    console.log(`🧹 Tables truncated successfully`);

    for (const datum of superAdmin) {
      const hashedPassword = await bcrypt.hash(datum.password, 10);

      await dataSource.query(
        `INSERT INTO "users"
          (full_name, user_name, phone, email, password, type, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,

        [
          datum.full_name,
          datum.user_name,
          datum.phone,
          datum.email,
          hashedPassword,
          datum.type,
          datum.status,
        ],
      );
    }
    console.log('🎉 Seeder completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    logger.error(error);

    process.exit(1);
  }
};

if (process.argv[2] === 'seed-up') {
  seedUp().then(() => console.log('🏁 Seeder process finished'));
}
