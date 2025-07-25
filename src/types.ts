// 飞书多维表格字段类型
export interface FieldMeta {
  id: string;
  name: string;
  type: 'text' | 'number' | 'single_select' | 'multi_select' | 'date' | 'attachment' | 'url' | 'phone' | 'email' | 'checkbox' | 'person' | 'lookup' | 'formula' | 'created_time' | 'updated_time' | 'created_by' | 'updated_by';
  property?: any;
}

// 多维表格记录
export interface Record {
  recordId: string;
  fields: { [fieldId: string]: any };
}

// 导出格式
export type ExportFormat = 'docx' | 'pdf' | 'txt';

// 导出配置
export interface ExportConfig {
  textFields: string[]; // 选中的文本字段
  attachmentFields: string[]; // 选中的附件字段
  format: ExportFormat; // 导出格式
  namingField: string; // 用于命名的字段
}

// 导出状态
export interface ExportStatus {
  isExporting: boolean;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  progress?: number;
}

// 附件信息
export interface AttachmentInfo {
  token: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

// 文件导出结果
export interface ExportResult {
  success: boolean;
  message: string;
  fileName?: string;
  filePath?: string;
} 