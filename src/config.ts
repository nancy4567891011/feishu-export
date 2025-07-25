// config.ts - 项目配置
export const config = {
  // 开发模式：true = 使用模拟数据，false = 使用真实飞书API
  isDevelopment: false,
  
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
}