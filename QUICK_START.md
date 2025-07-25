# 🚀 飞书插件快速入门指南

> 5分钟从开发到部署！

## 📋 当前状态
✅ 代码已完成  
✅ 模拟数据测试正常  
✅ 真实API代码已准备  
🔄 等待部署到飞书环境  

## 🎯 立即开始使用

### 开发模式（当前）
```bash
# 当前正在运行，可以直接测试
http://localhost:3000

# 如果没有运行，执行：
npm run dev
```

### 切换到生产模式
```bash
# 1. 切换到真实API模式
node switch-mode.js prod

# 2. 重启服务器
npm run dev
```

## 🔧 两种部署方式

### 方式一：快速测试（推荐）⭐
1. **打开飞书多维表格**
2. **点击右上角插件按钮**  
3. **选择"开发者选项"**
4. **上传我们的插件文件**

### 方式二：正式发布
1. **注册飞书开发者账号**：https://open.feishu.cn/
2. **创建应用并配置权限**
3. **构建生产版本**：`npm run build`
4. **上传到飞书应用市场**

## 📁 项目文件说明

### 核心文件
```
src/
├── api.ts          # 模拟数据API（开发用）
├── api-real.ts     # 真实飞书API（生产用）
├── App.tsx         # 主界面组件
├── config.ts       # 配置文件
└── types.ts        # 类型定义
```

### 配置文件
```
manifest.json       # 飞书插件配置
package.json        # 项目依赖
switch-mode.js      # 模式切换脚本
```

### 说明文档
```
README.md           # 项目说明
DEPLOYMENT_GUIDE.md # 详细部署指南
EXPORT_GUIDE.md     # 功能使用指南
QUICK_START.md      # 快速入门（本文件）
```

## ⚡ 常用命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 切换到开发模式（模拟数据）
node switch-mode.js dev

# 切换到生产模式（真实API）
node switch-mode.js prod

# 安装依赖
npm install
```

## 🔗 重要链接

- **本地预览**：http://localhost:3000
- **飞书开放平台**：https://open.feishu.cn/
- **插件开发文档**：https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/

## 💡 下一步行动

### 如果您想立即测试真实数据：
1. 在飞书中创建一个多维表格
2. 添加一些测试数据（包含文本和附件）
3. 按照 `DEPLOYMENT_GUIDE.md` 部署插件
4. 在飞书中测试导出功能

### 如果您想继续开发：
1. 修改 `src/App.tsx` 添加新功能
2. 在 `src/api.ts` 中添加新的模拟数据
3. 使用 `npm run dev` 实时预览更改

## 🎉 恭喜！

您已经拥有了一个完整的飞书多维表格导出插件：
- ✅ 完整的前端界面
- ✅ 数据导出功能  
- ✅ 附件下载功能
- ✅ 文件组织结构
- ✅ 真实API对接准备
- ✅ 详细的部署文档

现在您可以根据需要选择部署方式，开始在真实的飞书环境中使用这个插件了！

---

**需要帮助？** 随时联系我们或查看详细的 `DEPLOYMENT_GUIDE.md` 文档。 