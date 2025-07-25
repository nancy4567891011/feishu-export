#!/usr/bin/env node

/**
 * 飞书插件模式切换脚本
 * 使用方法：
 * node switch-mode.js dev    # 切换到开发模式（模拟数据）
 * node switch-mode.js prod   # 切换到生产模式（真实API）
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, 'src', 'config.ts');
const appPath = path.join(__dirname, 'src', 'App.tsx');

function updateConfig(isDevelopment) {
  const configContent = `// config.ts - 项目配置
export const config = {
  // 开发模式：true = 使用模拟数据，false = 使用真实飞书API
  isDevelopment: ${isDevelopment},
  
  // 飞书应用配置（生产环境使用）
  feishu: {
    appId: '', // 您的飞书应用ID
    appSecret: '', // 您的飞书应用密钥
  },
  
  // 调试配置
  debug: {
    enableLogging: true,
    showDetailedErrors: true,
  }
};

// 环境检测
export function isFeishuEnvironment(): boolean {
  // 检查是否在飞书环境中运行
  return typeof window !== 'undefined' && 
         (window.location.hostname.includes('feishu') || 
          window.location.hostname.includes('larksuite'));
}

// 获取当前模式
export function getCurrentMode(): 'development' | 'production' {
  return config.isDevelopment ? 'development' : 'production';
}`;

  fs.writeFileSync(configPath, configContent, 'utf8');
}

function updateAppImports(isDevelopment) {
  let appContent = fs.readFileSync(appPath, 'utf8');
  
  const apiImport = isDevelopment ? './api' : './api-real';
  
  // 替换API导入
  appContent = appContent.replace(
    /} from '\.\/api(-real)?';/,
    `} from '${apiImport}';`
  );
  
  fs.writeFileSync(appPath, appContent, 'utf8');
}

function main() {
  const mode = process.argv[2];
  
  if (!mode || !['dev', 'prod'].includes(mode)) {
    console.log('❌ 使用方法：');
    console.log('  node switch-mode.js dev    # 切换到开发模式');
    console.log('  node switch-mode.js prod   # 切换到生产模式');
    process.exit(1);
  }
  
  const isDevelopment = mode === 'dev';
  const modeName = isDevelopment ? '开发模式' : '生产模式';
  const apiType = isDevelopment ? '模拟数据' : '真实飞书API';
  
  console.log(`🔄 正在切换到${modeName}...`);
  
  try {
    updateConfig(isDevelopment);
    updateAppImports(isDevelopment);
    
    console.log(`✅ 成功切换到${modeName}`);
    console.log(`📡 API类型：${apiType}`);
    console.log(`🚀 请重启开发服务器以应用更改`);
    
    if (!isDevelopment) {
      console.log('');
      console.log('⚠️  生产模式提醒：');
      console.log('1. 请确保已在 src/config.ts 中配置飞书应用ID和密钥');
      console.log('2. 请确保应用权限配置正确');
      console.log('3. 请在飞书环境中测试插件');
    }
    
  } catch (error) {
    console.error('❌ 切换失败：', error.message);
    process.exit(1);
  }
}

main(); 