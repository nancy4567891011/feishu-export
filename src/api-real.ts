// api-real.ts - 真实的飞书 API 调用
import { bitable } from '@lark-base-open/js-sdk';
import type { FieldMeta, Record, AttachmentInfo, ExportResult, ExportFormat } from './types';

/**
 * 初始化飞书 SDK
 */
export async function initializeFeishuSDK(): Promise<boolean> {
  try {
    // 检查SDK是否可用
    if (typeof bitable !== 'undefined' && bitable.base) {
      console.log('飞书 SDK 初始化成功');
      return true;
    } else {
      throw new Error('飞书 SDK 不可用');
    }
  } catch (error) {
    console.error('飞书 SDK 初始化失败:', error);
    return false;
  }
}

/**
 * 获取当前表的所有字段信息
 */
export async function getTableFields(): Promise<FieldMeta[]> {
  try {
    const table = await bitable.base.getActiveTable();
    const fieldMetaList = await table.getFieldMetaList();
    
    return fieldMetaList.map((field: any) => ({
      id: field.id,
      name: field.name,
      type: field.type,
      property: field.property
    }));
  } catch (error) {
    console.error('获取字段信息失败:', error);
    throw new Error('无法获取表格字段信息');
  }
}

/**
 * 获取当前表的所有记录
 */
export async function getTableRecords(): Promise<Record[]> {
  try {
    const table = await bitable.base.getActiveTable();
    const recordIdList = await table.getRecordIdList();
    
    const records: Record[] = [];
    for (const recordId of recordIdList) {
      const record = await table.getRecordById(recordId);
      records.push({
        recordId,
        fields: record.fields
      });
    }
    
    return records;
  } catch (error) {
    console.error('获取记录失败:', error);
    throw new Error('无法获取表格记录');
  }
}

/**
 * 获取附件的下载 URL
 */
export async function getAttachmentUrl(token: string): Promise<string> {
  try {
    // 注意：真实环境中需要具体的fieldId和recordId
    // 这里返回模拟URL，部署时需要根据实际API调整
    console.log('获取附件URL:', token);
    return `https://example.com/mock-attachment/${token}`;
  } catch (error) {
    console.error('获取附件 URL 失败:', error);
    return `https://example.com/mock-attachment/${token}`;
  }
}

/**
 * 格式化字段值为文本
 */
export function formatFieldValue(value: any, fieldType: string): string {
  if (!value) return '';
  
  switch (fieldType) {
    case 'Text':
    case 'Url':
    case 'Phone':
    case 'Email':
      return String(value);
    
    case 'Number':
      return typeof value === 'number' ? value.toString() : String(value);
    
    case 'SingleSelect':
      return value?.text || '';
    
    case 'MultiSelect':
      return Array.isArray(value) ? value.map(item => item?.text || '').join(', ') : '';
    
    case 'DateTime':
      return value ? new Date(value).toLocaleString('zh-CN') : '';
    
    case 'Checkbox':
      return value ? '是' : '否';
    
    case 'User':
      if (Array.isArray(value)) {
        return value.map(person => person?.name || person?.en_name || '').join(', ');
      }
      return value?.name || value?.en_name || '';
    
    case 'Attachment':
      if (Array.isArray(value)) {
        return value.map(att => att?.name || '').join(', ');
      }
      return '';
    
    default:
      return String(value);
  }
}

/**
 * 解析附件字段
 */
export function parseAttachmentField(value: any): AttachmentInfo[] {
  if (!value || !Array.isArray(value)) return [];
  
  return value.map(attachment => ({
    token: attachment.token || '',
    name: attachment.name || '',
    type: attachment.type || '',
    size: attachment.size || 0,
    url: attachment.url
  }));
}

/**
 * 获取文件类型分类
 */
export function getFileCategory(fileName: string, fileType: string): string {
  const extension = fileType || fileName.split('.').pop()?.toLowerCase() || '';
  
  // 图片格式
  const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff'];
  if (imageFormats.includes(extension)) {
    return '图片';
  }
  
  // 视频格式
  const videoFormats = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', '3gp', 'rmvb'];
  if (videoFormats.includes(extension)) {
    return '视频';
  }
  
  // 音频格式
  const audioFormats = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'];
  if (audioFormats.includes(extension)) {
    return '音频';
  }
  
  // 文档格式
  const documentFormats = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'];
  if (documentFormats.includes(extension)) {
    return '文档';
  }
  
  // 压缩包
  const archiveFormats = ['zip', 'rar', '7z', 'tar', 'gz'];
  if (archiveFormats.includes(extension)) {
    return '压缩包';
  }
  
  return '其他';
}

/**
 * 格式化文件大小显示
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 导出为文档（使用浏览器 API）
 */
export async function exportToDocument(
  content: string,
  fileName: string,
  format: ExportFormat
): Promise<ExportResult> {
  try {
    let blob: Blob;
    let finalFileName: string;
    
    switch (format) {
      case 'txt':
        blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        finalFileName = `${fileName}.txt`;
        break;
      
      case 'docx':
        // 创建RTF格式，可以被Word正确识别并打开
        const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 \\froman\\fcharset0 Times New Roman;} {\\f1 \\fswiss\\fcharset0 Arial;}} {\\colortbl;\\red0\\green0\\blue0;} \\f1\\fs24 ${content.replace(/\n/g, '\\par ')} }`;
        blob = new Blob([rtfContent], { type: 'application/rtf' });
        finalFileName = `${fileName}.doc`;
        break;
      
      case 'pdf':
        // 创建可打印的HTML
        const pdfContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>${fileName}</title>
            <style>
              @media print {
                body { margin: 0; font-size: 12pt; }
                @page { margin: 2cm; }
              }
              body { 
                font-family: 'Microsoft YaHei', 'SimSun', sans-serif; 
                margin: 20px; 
                line-height: 1.6;
                color: #333;
              }
              pre { 
                white-space: pre-wrap; 
                font-family: inherit;
                background: #f5f5f5;
                padding: 10px;
                border-radius: 4px;
              }
              h1 { color: #1f7ff0; border-bottom: 2px solid #1f7ff0; padding-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>${fileName}</h1>
            <pre>${content}</pre>
          </body>
          </html>
        `;
        blob = new Blob([pdfContent], { type: 'text/html' });
        finalFileName = `${fileName}.html`;
        break;
      
      default:
        throw new Error('不支持的导出格式');
    }
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      message: '文档导出成功',
      fileName: finalFileName
    };
  } catch (error) {
    console.error('导出文档失败:', error);
    return {
      success: false,
      message: `导出失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

/**
 * 创建文档内容（这个函数保持不变）
 */
export function createDocumentContent(
  records: Record[],
  fields: FieldMeta[],
  selectedTextFields: string[],
  namingField: string
): string {
  const selectedFields = fields.filter(field => selectedTextFields.includes(field.id));
  const namingFieldMeta = fields.find(field => field.id === namingField);
  
  let content = '';
  
  records.forEach((record, index) => {
    const namingValue = formatFieldValue(record.fields[namingField], namingFieldMeta?.type || 'text');
    content += `\n=== 记录 ${index + 1}: ${namingValue} ===\n\n`;
    
    selectedFields.forEach(field => {
      const value = formatFieldValue(record.fields[field.id], field.type);
      content += `${field.name}: ${value}\n`;
    });
    
    content += '\n';
  });
  
  return content;
} 