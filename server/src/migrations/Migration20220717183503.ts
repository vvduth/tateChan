import { Migration } from '@mikro-orm/migrations';

export class Migration20220717183503 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `post` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `title` text not null) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `post`;');
  }

}
