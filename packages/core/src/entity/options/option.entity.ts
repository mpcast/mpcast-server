import { IsJSON } from 'class-validator';
import { Entity, Index, PrimaryColumn } from 'typeorm';
import { Column } from 'typeorm';

@Entity('options')
@Index(['key'])
export class Option {
  // constructor(input?: DeepPartial<Option>) {
  // }
  @Column({ type: 'varchar', length: 100 })
  @PrimaryColumn()
  key: string;

  @Column('json', {
    nullable: true,
    comment: '元信息值',
  })
  @IsJSON()
  value?: any;

  @Column('varchar', {
    nullable: true,
    length: 200,
    comment: '配置项描述',
  })
  description: string;
}
