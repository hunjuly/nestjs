import { MigrationInterface, QueryRunner } from 'typeorm'

export class mig1658604911087 implements MigrationInterface {
    name = 'mig1658604911087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`role\` varchar(255) NOT NULL DEFAULT 'user', \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        )
        await queryRunner.query(
            `CREATE TABLE \`authentication\` (\`id\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        )
        await queryRunner.query(
            `CREATE TABLE \`file\` (\`id\` varchar(36) NOT NULL, \`category\` varchar(255) NOT NULL, \`originalName\` varchar(255) NOT NULL, \`mimeType\` varchar(255) NOT NULL, \`size\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`file\``)
        await queryRunner.query(`DROP TABLE \`authentication\``)
        await queryRunner.query(`DROP TABLE \`user\``)
    }
}
