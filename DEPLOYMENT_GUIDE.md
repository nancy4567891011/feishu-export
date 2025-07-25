# 飞书插件部署指南 📚

> 这是一份详细的小白指南，教您如何将插件部署到真实的飞书环境中。

## 🎯 部署方式选择

### 方式一：飞书多维表格插件（推荐）⭐
- **优点**：部署简单，用户使用方便
- **适用**：企业内部使用
- **难度**：⭐⭐☆☆☆

### 方式二：飞书小程序
- **优点**：功能强大，可上架应用市场
- **适用**：对外发布
- **难度**：⭐⭐⭐⭐☆

## 📋 准备工作

### 1. 注册飞书开发者账号
```
1. 访问：https://open.feishu.cn/
2. 使用飞书账号登录
3. 完成开发者认证
```

### 2. 创建应用
```
1. 进入开发者后台
2. 点击"创建应用"
3. 选择"自建应用"
4. 填写应用信息：
   - 应用名称：多维表格导出工具
   - 应用描述：导出多维表格数据为文档和附件
```

### 3. 配置权限
在应用管理后台，添加以下权限：
```
✅ bitable:app          # 多维表格应用权限
✅ drive:drive          # 云文档访问权限  
✅ docx:write           # 文档写入权限
✅ im:message          # 消息发送权限（可选）
```

## 🔧 方式一：多维表格插件部署

### 步骤1：修改配置
编辑 `src/config.ts` 文件：
```typescript
export const config = {
  // 改为false，启用真实API
  isDevelopment: false,
  
  // 填入您的应用信息
  feishu: {
    appId: 'cli_你的应用ID',
    appSecret: '你的应用密钥',
  }
};
```

### 步骤2：构建项目
```bash
# 安装依赖（如果还没安装）
npm install

# 构建生产版本
npm run build
```

### 步骤3：上传插件
```
1. 打开飞书，进入多维表格
2. 点击右上角的"插件"按钮
3. 选择"开发者选项" > "本地插件"
4. 上传 dist 文件夹中的所有文件
5. 配置插件manifest.json
```

### 步骤4：测试插件
```
1. 在多维表格中激活插件
2. 测试数据读取功能
3. 测试导出功能
4. 检查文件下载是否正常
```

## 🚀 方式二：小程序部署

### 步骤1：安装飞书开发工具
```bash
# 下载飞书开发者工具
https://open.feishu.cn/document/home/develop-a-bot-in-5-minutes/create-an-app

# 或使用命令行工具
npm install -g @larksuiteoapi/cli
```

### 步骤2：创建小程序项目
```bash
# 使用CLI创建项目
lark-cli create my-export-plugin

# 将我们的代码复制到新项目中
cp -r src/* my-export-plugin/src/
cp package.json my-export-plugin/
```

### 步骤3：配置小程序
编辑 `manifest.json`：
```json
{
  "manifest_version": 2,
  "name": "多维表格导出工具",
  "version": "1.0.0",
  "description": "导出多维表格数据为文档和附件",
  "permissions": [
    "bitable:app",
    "drive:drive", 
    "docx:write"
  ],
  "app": {
    "urls": {
      "primary": "index.html"
    }
  }
}
```

### 步骤4：本地调试
```bash
# 启动开发服务器
npm run dev

# 在飞书开发者工具中预览
```

### 步骤5：发布
```bash
# 构建生产版本
npm run build

# 在开发者后台上传代码包
# 提交审核
# 发布到应用市场（可选）
```

## 🔧 API对接详解

### 修改真实API调用

当前项目中，将 `src/App.tsx` 中的API导入改为：
```typescript
// 将这行
import { ... } from './api';

// 改为
import { ... } from './api-real';
```

### 常见API问题解决

1. **初始化失败**
```typescript
// 问题：SDK初始化失败
// 解决：检查权限配置
const isReady = await initializeFeishuSDK();
if (!isReady) {
  console.error('请检查应用权限配置');
}
```

2. **字段类型不匹配**
```typescript
// 问题：字段类型命名不一致
// 解决：更新类型映射
switch (fieldType) {
  case 'Text':        // 飞书中是 'Text' 不是 'text'
  case 'SingleSelect': // 飞书中是 'SingleSelect'
  // ...
}
```

3. **附件下载失败**
```typescript
// 问题：附件URL获取失败
// 解决：确保有正确的fieldId和recordId
const urls = await table.getCellAttachmentUrls(fieldId, recordId, [token]);
```

## 🐛 常见问题排查

### 1. 权限问题
```
错误：Permission denied
解决：
1. 检查应用权限配置
2. 确认用户已授权
3. 验证token是否有效
```

### 2. 网络问题
```
错误：Network request failed
解决：
1. 检查网络连接
2. 确认域名白名单
3. 检查HTTPS配置
```

### 3. 数据格式问题
```
错误：Data format error
解决：
1. 检查字段类型映射
2. 验证数据结构
3. 添加容错处理
```

## 📞 获取帮助

### 官方文档
- 飞书开放平台：https://open.feishu.cn/document/
- 多维表格API：https://open.feishu.cn/document/server-docs/docs/bitable-v1/
- 插件开发指南：https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/

### 社区支持
- 飞书开发者社区：https://open.feishu.cn/community/
- GitHub Issues：(您的项目地址)

### 直接联系
如果遇到问题，请提供：
1. 错误信息截图
2. 浏览器控制台日志
3. 操作步骤描述
4. 飞书版本信息

## ✅ 发布检查清单

部署前请确认：
- [ ] 应用权限配置正确
- [ ] 本地测试通过
- [ ] 生产环境配置已更新
- [ ] 文件上传功能测试通过
- [ ] 错误处理机制完善
- [ ] 用户手册准备完成

完成这些步骤后，您的飞书多维表格导出插件就可以在真实环境中使用了！🎉 