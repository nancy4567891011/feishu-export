// api.ts - 封装飞书 API 调用
// 注意：这里使用模拟数据，在实际飞书环境中需要替换为真实的飞书SDK调用
import type { FieldMeta, Record, AttachmentInfo, ExportResult, ExportFormat } from './types';

/**
 * 初始化飞书 SDK
 */
export async function initializeFeishuSDK(): Promise<boolean> {
  try {
    // 模拟 SDK 初始化
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('飞书 SDK 初始化成功（模拟）');
    return true;
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
    // 模拟字段数据
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockFields: FieldMeta[] = [
      { id: 'field1', name: '姓名', type: 'text' },
      { id: 'field2', name: '年龄', type: 'number' },
      { id: 'field3', name: '部门', type: 'single_select' },
      { id: 'field4', name: '入职日期', type: 'date' },
      { id: 'field5', name: '简历附件', type: 'attachment' },
      { id: 'field6', name: '照片', type: 'attachment' },
      { id: 'field7', name: '邮箱', type: 'email' },
      { id: 'field8', name: '是否在职', type: 'checkbox' }
    ];
    
    return mockFields;
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
    // 模拟记录数据
            await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockRecords: Record[] = [
          {
            recordId: 'rec1',
            fields: {
              field1: '张三',
              field2: 28,
              field3: { text: '技术部' },
              field4: 1640995200000,
              field5: [
                { token: 'file1', name: '张三简历.pdf', type: 'pdf', size: 1024000 },
                { token: 'audio1', name: '张三自我介绍.mp3', type: 'mp3', size: 3500000 }
              ],
              field6: [
                { token: 'file2', name: '张三照片.jpg', type: 'jpg', size: 512000 },
                { token: 'video1', name: '张三介绍视频.mp4', type: 'mp4', size: 15000000 }
              ],
              field7: 'zhangsan@company.com',
              field8: true
            }
          },
          {
            recordId: 'rec2',
            fields: {
              field1: '李四',
              field2: 32,
              field3: { text: '产品部' },
              field4: 1609459200000,
              field5: [
                { token: 'file3', name: '李四简历.docx', type: 'docx', size: 2048000 },
                { token: 'audio2', name: '李四语音简介.wav', type: 'wav', size: 5200000 }
              ],
              field6: [
                { token: 'file4', name: '李四照片.png', type: 'png', size: 768000 },
                { token: 'file7', name: '李四头像.gif', type: 'gif', size: 1200000 }
              ],
              field7: 'lisi@company.com',
              field8: true
            }
          },
          {
            recordId: 'rec3',
            fields: {
              field1: '王五',
              field2: 25,
              field3: { text: '设计部' },
              field4: 1672531200000,
              field5: [
                { token: 'file5', name: '王五简历.pdf', type: 'pdf', size: 1536000 },
                { token: 'video2', name: '王五作品展示.avi', type: 'avi', size: 25000000 }
              ],
              field6: [
                { token: 'file8', name: '王五作品集.zip', type: 'zip', size: 8500000 }
              ],
              field7: 'wangwu@company.com',
              field8: false
            }
          }
        ];
    
    return mockRecords;
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
    // 模拟获取附件 URL
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 返回一个模拟的 URL（实际环境中这里应该是真实的飞书附件 URL）
    return `https://example.com/mock-file/${token}`;
  } catch (error) {
    console.error('获取附件 URL 失败:', error);
    throw new Error('无法获取附件下载链接');
  }
}

/**
 * 格式化字段值为文本
 */
export function formatFieldValue(value: any, fieldType: string): string {
  if (!value) return '';
  
  switch (fieldType) {
    case 'text':
    case 'url':
    case 'phone':
    case 'email':
      return String(value);
    
    case 'number':
      return typeof value === 'number' ? value.toString() : String(value);
    
    case 'single_select':
      return value?.text || '';
    
    case 'multi_select':
      return Array.isArray(value) ? value.map(item => item?.text || '').join(', ') : '';
    
    case 'date':
      return value ? new Date(value).toLocaleDateString('zh-CN') : '';
    
    case 'checkbox':
      return value ? '是' : '否';
    
    case 'person':
      if (Array.isArray(value)) {
        return value.map(person => person?.name || person?.en_name || '').join(', ');
      }
      return value?.name || value?.en_name || '';
    
    case 'attachment':
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
 * 创建文档内容
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
        finalFileName = `${fileName}.doc`; // 使用.doc扩展名，兼容性更好
        break;
      
      case 'pdf':
        // 创建可打印的HTML，建议用户通过浏览器打印为PDF
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
            <script>
              // 自动打开打印对话框（可选）
              // window.onload = () => window.print();
            </script>
          </body>
          </html>
        `;
        blob = new Blob([pdfContent], { type: 'text/html' });
        finalFileName = `${fileName}.html`; // 先保存为HTML，用户可以通过浏览器打印为PDF
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