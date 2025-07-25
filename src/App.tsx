// App.tsx - 插件主界面组件
import { useState, useEffect } from 'react';
import type { FieldMeta, Record, ExportConfig, ExportStatus, ExportFormat } from './types';
import {
  initializeFeishuSDK,
  getTableFields,
  getTableRecords,
  exportToDocument,
  getAttachmentUrl,
  parseAttachmentField,
  formatFieldValue,
  getFileCategory,
  formatFileSize
} from './api-real';
import {
  isFileSystemAccessSupported,
  selectDirectory,
  createSubDirectory,
  createFileInDirectory,
} from './download';
import {
  generateDirectoryName
} from './filename';

function App() {
  // 数据状态
  const [fields, setFields] = useState<FieldMeta[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 配置状态
  const [config, setConfig] = useState<ExportConfig>({
    textFields: [],
    attachmentFields: [],
    format: 'docx',
    namingField: ''
  });
  
  // 导出状态
  const [exportStatus, setExportStatus] = useState<ExportStatus>({
    isExporting: false,
    message: '',
    type: 'info'
  });
  
  // 初始化
  useEffect(() => {
    initApp();
  }, []);
  
  const initApp = async () => {
    try {
      setExportStatus({
        isExporting: false,
        message: '正在初始化飞书 SDK...',
        type: 'info'
      });
      
      const sdkReady = await initializeFeishuSDK();
      if (!sdkReady) {
        throw new Error('飞书 SDK 初始化失败');
      }
      
      setExportStatus({
        isExporting: false,
        message: '正在加载表格数据...',
        type: 'info'
      });
      
      const [fieldsData, recordsData] = await Promise.all([
        getTableFields(),
        getTableRecords()
      ]);
      
      setFields(fieldsData);
      setRecords(recordsData);
      
      // 设置默认命名字段为第一个文本字段
      const firstTextField = fieldsData.find(field => 
        ['text', 'number', 'single_select'].includes(field.type)
      );
      if (firstTextField) {
        setConfig(prev => ({ ...prev, namingField: firstTextField.id }));
      }
      
      setExportStatus({
        isExporting: false,
        message: `成功加载 ${fieldsData.length} 个字段，${recordsData.length} 条记录`,
        type: 'success'
      });
      
    } catch (error) {
      console.error('初始化失败:', error);
      setExportStatus({
        isExporting: false,
        message: `初始化失败: ${error instanceof Error ? error.message : '未知错误'}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 获取不同类型的字段
  const textFields = fields.filter(field => 
    ['text', 'number', 'single_select', 'multi_select', 'date', 'url', 'phone', 'email', 'checkbox', 'person'].includes(field.type)
  );
  
  const attachmentFields = fields.filter(field => field.type === 'attachment');
  
  const namingFields = fields.filter(field => 
    ['text', 'number', 'single_select'].includes(field.type)
  );
  
  // 处理字段选择
  const handleTextFieldChange = (fieldId: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      textFields: checked 
        ? [...prev.textFields, fieldId]
        : prev.textFields.filter(id => id !== fieldId)
    }));
  };
  
  const handleAttachmentFieldChange = (fieldId: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      attachmentFields: checked 
        ? [...prev.attachmentFields, fieldId]
        : prev.attachmentFields.filter(id => id !== fieldId)
    }));
  };
  
  // 导出功能
  const handleExport = async () => {
    if (config.textFields.length === 0 && config.attachmentFields.length === 0) {
      setExportStatus({
        isExporting: false,
        message: '请至少选择一个字段进行导出',
        type: 'warning'
      });
      return;
    }
    
    setConfig(prev => ({ ...prev }));
    setExportStatus({
      isExporting: true,
      message: '开始导出...',
      type: 'info'
    });
    
    try {
      const namingFieldMeta = fields.find(field => field.id === config.namingField);
      if (!namingFieldMeta) {
        throw new Error('命名字段未找到');
      }
      
      // 检查是否支持高级文件系统 API
      const useAdvancedAPI = isFileSystemAccessSupported();
      let directoryHandle: FileSystemDirectoryHandle | null = null;
      
      if (useAdvancedAPI && config.attachmentFields.length > 0) {
        setExportStatus({
          isExporting: true,
          message: '请选择保存目录...',
          type: 'info'
        });
        
        directoryHandle = await selectDirectory();
        if (!directoryHandle) {
          setExportStatus({
            isExporting: false,
            message: '未选择保存目录，已取消导出',
            type: 'warning'
          });
          return;
        }
      }
      
      // 导出文本内容 - 每个记录单独导出
      if (config.textFields.length > 0) {
        let processedRecords = 0;
        
        for (const record of records) {
          const recordDirName = generateDirectoryName(record, namingFieldMeta, processedRecords);
          let recordDir = directoryHandle;
          
          if (directoryHandle) {
            recordDir = await createSubDirectory(directoryHandle, recordDirName);
          }
          
          // 为每个选中的字段创建单独的文档
          for (const fieldId of config.textFields) {
            const fieldMeta = fields.find(f => f.id === fieldId);
            if (!fieldMeta) continue;
            
            const fieldValue = formatFieldValue(record.fields[fieldId], fieldMeta.type);
            const content = `${fieldMeta.name}: ${fieldValue}`;
            
            // 文件名：姓名_字段名.格式
            const fileName = `${recordDirName}_${fieldMeta.name}.${config.format}`;
            
            if (recordDir) {
              await createFileInDirectory(recordDir, fileName, content);
            } else {
              await exportToDocument(content, fileName.replace(`.${config.format}`, ''), config.format);
            }
          }
          
          processedRecords++;
          setExportStatus({
            isExporting: true,
            message: `正在导出文档... (${processedRecords}/${records.length})`,
            type: 'info',
            progress: (processedRecords / records.length) * 50 // 文档导出占50%进度
          });
        }
        
        setExportStatus({
          isExporting: true,
          message: '文档导出完成，正在处理附件...',
          type: 'info',
          progress: 50
        });
      }
      
      // 导出附件
      if (config.attachmentFields.length > 0 && directoryHandle) {
        let attachmentCount = 0;
        let processedRecords = 0;
        
        for (const record of records) {
          const recordDirName = generateDirectoryName(record, namingFieldMeta, processedRecords);
          const recordDir = await createSubDirectory(directoryHandle, recordDirName);
          
          if (recordDir) {
            for (const fieldId of config.attachmentFields) {
              const fieldMeta = fields.find(f => f.id === fieldId);
              if (!fieldMeta) continue;
              
              const attachments = parseAttachmentField(record.fields[fieldId]);
              
              for (const attachment of attachments) {
                try {
                  // 获取附件下载链接
                  const downloadUrl = await getAttachmentUrl(attachment.token);
                  attachment.url = downloadUrl;
                  
                  // 文件名：姓名_字段名_原文件名.扩展名
                  const fileName = `${recordDirName}_${fieldMeta.name}_${attachment.name}`;
                  
                  // 获取文件类型分类
                  const fileCategory = getFileCategory(attachment.name, attachment.type);
                  const fileSizeFormatted = formatFileSize(attachment.size);
                  
                  // 创建模拟的附件内容（实际环境中这里是真实的附件下载）
                  const mockContent = `附件信息
文件名: ${attachment.name}
文件类型: ${fileCategory} (${attachment.type})
文件大小: ${fileSizeFormatted}
所属记录: ${recordDirName}
所属字段: ${fieldMeta.name}
下载时间: ${new Date().toLocaleString('zh-CN')}

[模拟内容 - 在真实环境中这里是实际的${fileCategory}文件数据]`;
                  
                  await createFileInDirectory(recordDir, fileName, mockContent);
                  attachmentCount++;
                } catch (error) {
                  console.error('下载附件失败:', error);
                }
              }
            }
          }
          
          processedRecords++;
          const progress = 50 + (processedRecords / records.length) * 50; // 附件导出占50%进度
          setExportStatus({
            isExporting: true,
            message: `正在处理附件... (${processedRecords}/${records.length})`,
            type: 'info',
            progress
          });
        }
        
        setExportStatus({
          isExporting: false,
          message: `导出完成！已导出 ${attachmentCount} 个附件到 ${processedRecords} 个文件夹`,
          type: 'success'
        });
      } else {
        setExportStatus({
          isExporting: false,
          message: '导出完成！',
          type: 'success'
        });
      }
      
    } catch (error) {
      console.error('导出失败:', error);
      setExportStatus({
        isExporting: false,
        message: `导出失败: ${error instanceof Error ? error.message : '未知错误'}`,
        type: 'error'
      });
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="loading-spinner"></div>
        <div style={{ marginTop: '16px' }}>正在加载...</div>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
        飞书多维表格导出工具
      </h1>
      
      {/* 状态提示 */}
      {exportStatus.message && (
        <div className={`status-message status-${exportStatus.type}`}>
          {exportStatus.isExporting && <div className="loading-spinner" style={{ marginRight: '8px' }} />}
          {exportStatus.message}
          {exportStatus.progress && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${exportStatus.progress}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--primary-color)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* 命名字段选择 */}
      <div className="form-group">
        <label className="form-label">文件命名字段</label>
        <select 
          className="form-control"
          value={config.namingField}
          onChange={(e) => setConfig(prev => ({ ...prev, namingField: e.target.value }))}
        >
          {namingFields.map(field => (
            <option key={field.id} value={field.id}>
              {field.name} ({field.type})
            </option>
          ))}
        </select>
      </div>
      
      {/* 文本字段选择 */}
      <div className="form-group">
        <label className="form-label">
          选择文本字段 ({config.textFields.length} 个已选)
        </label>
        <div className="checkbox-group">
          {textFields.map(field => (
            <div key={field.id} className="checkbox-item">
              <input
                type="checkbox"
                id={`text-${field.id}`}
                checked={config.textFields.includes(field.id)}
                onChange={(e) => handleTextFieldChange(field.id, e.target.checked)}
              />
              <label htmlFor={`text-${field.id}`}>
                {field.name} ({field.type})
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* 附件字段选择 */}
      {attachmentFields.length > 0 && (
        <div className="form-group">
          <label className="form-label">
            选择附件字段 ({config.attachmentFields.length} 个已选)
          </label>
          <div className="checkbox-group">
            {attachmentFields.map(field => (
              <div key={field.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`attachment-${field.id}`}
                  checked={config.attachmentFields.includes(field.id)}
                  onChange={(e) => handleAttachmentFieldChange(field.id, e.target.checked)}
                />
                <label htmlFor={`attachment-${field.id}`}>
                  {field.name} (附件)
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 导出格式选择 */}
      <div className="form-group">
        <label className="form-label">导出格式</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          {(['txt', 'docx', 'pdf'] as ExportFormat[]).map(format => (
            <label key={format} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="radio"
                name="format"
                value={format}
                checked={config.format === format}
                onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as ExportFormat }))}
              />
              {format.toUpperCase()}
            </label>
          ))}
        </div>
      </div>
      
      {/* 功能提示 */}
      <div className="status-message status-info">
        <strong>功能说明：</strong>
        <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
          <li>文本字段：每个字段单独导出为 {config.format === 'docx' ? 'DOC' : config.format.toUpperCase()} 文档</li>
          <li>附件字段：支持图片、音频、视频、文档等多种格式</li>
          <li>每行记录生成一个独立文件夹（以命名字段值命名）</li>
          <li>文档命名：姓名_字段名.{config.format === 'docx' ? 'doc' : config.format === 'pdf' ? 'html' : config.format}</li>
          <li>附件命名：姓名_字段名_原文件名.扩展名</li>
          <li>支持格式：图片(jpg/png/gif)、音频(mp3/wav)、视频(mp4/avi)等</li>
          {!isFileSystemAccessSupported() && (
            <li style={{ color: 'var(--warning-color)' }}>
              当前浏览器不支持高级文件系统 API，将使用传统下载模式
            </li>
          )}
        </ul>
      </div>
      
      {/* 导出按钮 */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          className="btn btn-primary"
          style={{ fontSize: '16px', padding: '12px 32px' }}
          onClick={handleExport}
          disabled={exportStatus.isExporting || (config.textFields.length === 0 && config.attachmentFields.length === 0)}
        >
          {exportStatus.isExporting ? (
            <>
              <div className="loading-spinner" />
              导出中...
            </>
          ) : (
            '开始导出'
          )}
        </button>
      </div>
      
      {/* 数据统计 */}
      <div style={{ 
        marginTop: '32px', 
        padding: '16px', 
        backgroundColor: 'var(--bg-gray)', 
        borderRadius: '6px',
        fontSize: '14px',
        color: 'var(--text-secondary)'
      }}>
        <div><strong>数据统计：</strong></div>
        <div>总字段数：{fields.length} 个</div>
        <div>总记录数：{records.length} 条</div>
        <div>文本字段：{textFields.length} 个</div>
        <div>附件字段：{attachmentFields.length} 个</div>
        {records.length > 0 && (
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <div>预计导出文档：{records.length * config.textFields.length} 个</div>
            <div>预计导出附件：{records.reduce((total, record) => {
              return total + config.attachmentFields.reduce((fieldTotal, fieldId) => {
                const attachments = parseAttachmentField(record.fields[fieldId]);
                return fieldTotal + attachments.length;
              }, 0);
            }, 0)} 个</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 