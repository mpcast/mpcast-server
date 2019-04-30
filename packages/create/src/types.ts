export type DbType = 'mysql' | 'postgres';

export interface UserResponses {
  usingTs: boolean;
  dbType: DbType;
  // 填充节目数据
  populateEpisodes: boolean;
  indexSource: string;
  configSource: string;
}

export type LogLevel = 'silent' | 'info' | 'verbose';
