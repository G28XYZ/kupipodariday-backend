import { PrimaryGeneratedColumn, Column } from 'typeorm';
/**
 * поля  для схем которые используются во всех существующих схемах данного api
 */
export class PrimaryEntityFields {
  /** id — уникальный числовой идентификатор. Генерируется автоматически и является первичным ключем каждой из таблиц; */
  @PrimaryGeneratedColumn()
  id: number;
  /** createdAt — дата создания, тип значения Date; */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  /** updatedAt — дата изменения, тип значения Date. */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
