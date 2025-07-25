// filename.ts - 自动生成文件名工具
import type { FieldMeta, Record, ExportFormat } from './types';
import { formatFieldValue } from './api';
import { sanitizeFileName } from './download';

/**
 * 生成文档文件名
 */
export function generateDocumentFileName(
  record: Record,
  namingField: FieldMeta,
  format: ExportFormat,
  prefix?: string
): string {
  const namingValue = formatFieldValue(record.fields[namingField.id], namingField.type);
  const cleanNamingValue = sanitizeFileName(namingValue || `记录_${record.recordId.slice(-6)}`);
  
  const baseName = prefix ? `${prefix}_${cleanNamingValue}` : cleanNamingValue;
  return `${baseName}.${format}`;
}

/**
 * 生成附件文件名
 */
export function generateAttachmentFileName(
  record: Record,
  namingField: FieldMeta,
  sourceField: FieldMeta,
  originalFileName: string
): string {
  const namingValue = formatFieldValue(record.fields[namingField.id], namingField.type);
  const cleanNamingValue = sanitizeFileName(namingValue || `记录_${record.recordId.slice(-6)}`);
  
  // 获取原始文件的扩展名
  const lastDotIndex = originalFileName.lastIndexOf('.');
  const extension = lastDotIndex > -1 ? originalFileName.substring(lastDotIndex) : '';
  const nameWithoutExt = lastDotIndex > -1 ? originalFileName.substring(0, lastDotIndex) : originalFileName;
  
  const cleanOriginalName = sanitizeFileName(nameWithoutExt);
  
  return `${cleanNamingValue}_${sourceField.name}_${cleanOriginalName}${extension}`;
}

/**
 * 生成目录名（用于每行记录）
 */
export function generateDirectoryName(
  record: Record,
  namingField: FieldMeta,
  index?: number
): string {
  const namingValue = formatFieldValue(record.fields[namingField.id], namingField.type);
  const cleanNamingValue = sanitizeFileName(namingValue || `记录_${index !== undefined ? index + 1 : record.recordId.slice(-6)}`);
  
  return cleanNamingValue;
}

/**
 * 生成批量导出的总文件名
 */
export function generateBatchFileName(
  tableFields: FieldMeta[],
  selectedFields: string[],
  format: ExportFormat,
  timestamp?: Date
): string {
  const now = timestamp || new Date();
  const dateString = now.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_');
  
  const fieldNames = tableFields
    .filter(field => selectedFields.includes(field.id))
    .map(field => sanitizeFileName(field.name))
    .join('-');
  
  const shortFieldNames = fieldNames.length > 50 ? fieldNames.substring(0, 50) + '...' : fieldNames;
  
  return `多维表格导出_${shortFieldNames}_${dateString}.${format}`;
}

/**
 * 检查文件名是否有效
 */
export function validateFileName(fileName: string): { valid: boolean; message?: string } {
  if (!fileName || fileName.trim().length === 0) {
    return { valid: false, message: '文件名不能为空' };
  }
  
  if (fileName.length > 255) {
    return { valid: false, message: '文件名过长（超过255个字符）' };
  }
  
  // 检查是否包含不允许的字符
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(fileName)) {
    return { valid: false, message: '文件名包含不允许的字符: < > : " / \\ | ? *' };
  }
  
  // 检查是否为保留名称（Windows）
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const nameWithoutExt = fileName.split('.')[0].toUpperCase();
  if (reservedNames.includes(nameWithoutExt)) {
    return { valid: false, message: `"${nameWithoutExt}" 是系统保留名称` };
  }
  
  return { valid: true };
}

/**
 * 生成唯一文件名（避免重复）
 */
export function generateUniqueFileName(
  baseName: string,
  extension: string,
  existingNames: string[]
): string {
  let fileName = `${baseName}.${extension}`;
  let counter = 1;
  
  while (existingNames.includes(fileName)) {
    fileName = `${baseName}(${counter}).${extension}`;
    counter++;
  }
  
  return fileName;
}

/**
 * 从字段值提取合适的文件名部分
 */
export function extractFileNameFromFieldValue(
  value: any,
  fieldType: string,
  maxLength: number = 50
): string {
  const formatted = formatFieldValue(value, fieldType);
  
  if (!formatted) {
    return '未命名';
  }
  
  // 清理和截断
  let cleaned = sanitizeFileName(formatted);
  
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength) + '...';
  }
  
  return cleaned || '未命名';
}

/**
 * 生成文件名预览
 */
export function previewFileNames(
  records: Record[],
  namingField: FieldMeta,
  _textFields: FieldMeta[],
  attachmentFields: FieldMeta[],
  format: ExportFormat
): {
  documentNames: string[];
  attachmentNames: string[][];
  directoryNames: string[];
} {
  const documentNames: string[] = [];
  const attachmentNames: string[][] = [];
  const directoryNames: string[] = [];
  
  records.forEach((record, index) => {
    // 文档文件名
    const docName = generateDocumentFileName(record, namingField, format);
    documentNames.push(docName);
    
    // 目录名
    const dirName = generateDirectoryName(record, namingField, index);
    directoryNames.push(dirName);
    
    // 附件文件名
    const recordAttachmentNames: string[] = [];
    attachmentFields.forEach(field => {
      const attachments = record.fields[field.id];
      if (Array.isArray(attachments)) {
        attachments.forEach(attachment => {
          const attName = generateAttachmentFileName(
            record,
            namingField,
            field,
            attachment.name || '附件'
          );
          recordAttachmentNames.push(attName);
        });
      }
    });
    attachmentNames.push(recordAttachmentNames);
  });
  
  return {
    documentNames,
    attachmentNames,
    directoryNames
  };
} 