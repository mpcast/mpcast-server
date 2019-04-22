import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsArray, IsJSON } from 'class-validator';
import { BaseEntity } from '../base.entity';
import { UserMeta } from '@app/entity';
import { PostMeta } from '@app/entity/posts/postmeta.entity';

@Index(['name'], { unique: true })
// @Index(['type', 'status', 'createdDate', 'id'], { unique: true })
// @Index(['parent'])
// @Index(['author'])
@Entity('posts')
export class Post extends BaseEntity {
  @Column({
    name: 'author',
    type: 'int',
    comment: '作者',
    nullable: true,
  })
  author: number;
  @Column({
    type: 'varchar',
    length: 20,
    default: 'publish',
    comment: '内容状态',
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '读取密码',
    nullable: true,
  })
  password: string;

  @Column({
    name: 'title',
    type: 'text',
    comment: '内容标题',
    nullable: true,
  })
  @IsString()
  title: string;

  @Column({
    comment: '内容标识',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'guid',
    comment: '网络唯一地址 Global Unique ID for referencing the post.',
    nullable: true,
  })
  guid: string;

  @Column({
    comment: '内容摘要',
    nullable: true,
  })
  excerpt: string;

  @Column({
    name: 'type',
    default: 'post',
    comment: '内容类型',
  })
  type: string;

  @Column('text', {
    name: 'content',
    comment: '内容 block',
    nullable: true,
  })
  content: string[];

  @Column('json', {
    comment: '内容区块',
  })
  block: any;

  @Column({
    name: 'allow_comment',
    type: 'boolean',
    comment: '格式',
    default: false,
  })
  allowComment: boolean;

  @Column({
    type: 'int',
  })
  commentCount: number;

  @Column({
    name: 'post_parent',
    comment: '父级内容',
    unsigned: true,
    type: 'int',
    default: 0,
  })
  parent: number;

  @Column({
    length: 100,
    nullable: true,
  })
  mimeType: string;

  @Column({
    name: 'menu_order',
    comment: '菜单顺序',
    default: 0,
  })
  menuOrder: number;

  @Column({
    comment: '排序',
    default: 0,
  })
  sort: number;

  @OneToMany(type => PostMeta, postMeta => postMeta.post, {
    cascade: true,
  })
  metas?: PostMeta[];
}
