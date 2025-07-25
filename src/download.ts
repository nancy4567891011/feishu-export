// download.ts - 实现保存到本地文件夹功能
import type { AttachmentInfo, ExportResult } from './types';

/**
 * 检查浏览器是否支持 File System Access API
 */
export function isFileSystemAccessSupported(): boolean {
  return 'showDirectoryPicker' in window;
}

/**
 * 选择本地保存目录
 */
export async function selectDirectory(): Promise<FileSystemDirectoryHandle | null> {
  try {
    if (!isFileSystemAccessSupported()) {
      throw new Error('当前浏览器不支持文件系统访问 API');
    }
    
    const directoryHandle = await (window as any).showDirectoryPicker({
      mode: 'readwrite'
    });
    
    return directoryHandle;
  } catch (error) {
    console.error('选择目录失败:', error);
    return null;
  }
}

/**
 * 在指定目录中创建文件
 */
export async function createFileInDirectory(
  directoryHandle: FileSystemDirectoryHandle,
  fileName: string,
  content: string | Blob
): Promise<ExportResult> {
  try {
    const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    
    if (typeof content === 'string') {
      await writable.write(content);
    } else {
      await writable.write(content);
    }
    
    await writable.close();
    
    return {
      success: true,
      message: `文件 ${fileName} 已保存`,
      fileName
    };
  } catch (error) {
    console.error('创建文件失败:', error);
    return {
      success: false,
      message: `保存文件失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

/**
 * 在指定目录中创建子目录
 */
export async function createSubDirectory(
  parentHandle: FileSystemDirectoryHandle,
  dirName: string
): Promise<FileSystemDirectoryHandle | null> {
  try {
    // 清理目录名称，移除不允许的字符
    const cleanDirName = sanitizeFileName(dirName);
    const subDirHandle = await parentHandle.getDirectoryHandle(cleanDirName, { create: true });
    return subDirHandle;
  } catch (error) {
    console.error('创建子目录失败:', error);
    return null;
  }
}

/**
 * 下载附件文件到指定目录
 */
export async function downloadAttachmentToDirectory(
  directoryHandle: FileSystemDirectoryHandle,
  attachment: AttachmentInfo,
  fileName: string
): Promise<ExportResult> {
  try {
    if (!attachment.url) {
      return {
        success: false,
        message: '附件没有有效的下载链接'
      };
    }
    
    // 下载附件内容
    const response = await fetch(attachment.url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const cleanFileName = sanitizeFileName(fileName);
    
    return await createFileInDirectory(directoryHandle, cleanFileName, blob);
  } catch (error) {
    console.error('下载附件失败:', error);
    return {
      success: false,
      message: `下载附件失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

/**
 * 批量下载附件到目录
 */
export async function batchDownloadAttachments(
  directoryHandle: FileSystemDirectoryHandle,
  attachments: { attachment: AttachmentInfo; fileName: string }[],
  onProgress?: (current: number, total: number) => void
): Promise<ExportResult[]> {
  const results: ExportResult[] = [];
  
  for (let i = 0; i < attachments.length; i++) {
    const { attachment, fileName } = attachments[i];
    
    if (onProgress) {
      onProgress(i + 1, attachments.length);
    }
    
    const result = await downloadAttachmentToDirectory(directoryHandle, attachment, fileName);
    results.push(result);
    
    // 添加延迟避免请求过于频繁
    if (i < attachments.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return results;
}

/**
 * 清理文件名，移除不允许的字符
 */
export function sanitizeFileName(fileName: string): string {
  // 移除或替换不允许的字符
  return fileName
    .replace(/[<>:"/\\|?*]/g, '_') // 替换不允许的字符
    .replace(/\s+/g, '_') // 替换空格为下划线
    .replace(/_{2,}/g, '_') // 合并多个下划线
    .replace(/^_+|_+$/g, '') // 移除开头和结尾的下划线
    .substring(0, 255); // 限制长度
}

/**
 * 使用传统下载方式（如果不支持 File System Access API）
 */
export function fallbackDownload(fileName: string, content: string | Blob): ExportResult {
  try {
    let blob: Blob;
    
    if (typeof content === 'string') {
      blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    } else {
      blob = content;
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      message: `文件 ${fileName} 已开始下载`,
      fileName
    };
  } catch (error) {
    console.error('传统下载失败:', error);
    return {
      success: false,
      message: `下载失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

/**
 * 估算文件大小（用于显示进度）
 */
export function estimateFileSize(content: string): number {
  return new Blob([content]).size;
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