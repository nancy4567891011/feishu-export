# 飞书多维表格导出插件

这是一个基于 React + Vite + 飞书 JS SDK 开发的多维表格导出插件，可以将飞书多维表格的数据导出为文档，并批量下载附件到本地文件夹。

## 功能特性

### 📊 数据导出
- **文本字段导出**：支持将选中的文本列导出为 DOCX、PDF、TXT 格式
- **附件批量下载**：支持将选中的附件列中的所有文件下载到本地
- **自定义文件命名**：可选择任意列作为文件命名依据
- **结构化组织**：每行记录生成独立文件夹，文件命名规范化

### 🎯 智能功能
- **多格式支持**：TXT、DOCX、PDF 三种文档格式
- **文件系统集成**：支持现代浏览器的 File System Access API
- **批量处理**：一键导出所有数据，自动处理大量文件
- **进度显示**：实时显示导出进度和状态

### 💼 文件组织
- 文件命名格式：`<命名字段值>_<列字段名>.<扩展名>`
- 每行记录创建独立文件夹（以命名字段值命名）
- 支持文件名自动清理和去重

## 项目结构

```
feishu-export/
├── src/
│   ├── App.tsx          # 主界面组件
│   ├── main.tsx         # 应用入口
│   ├── api.ts           # 飞书 API 封装
│   ├── download.ts      # 本地下载功能
│   ├── filename.ts      # 文件名生成工具
│   ├── types.ts         # TypeScript 类型定义
│   └── index.css        # 样式文件
├── manifest.json        # 插件配置文件
├── index.html          # 开发页面
├── package.json        # 依赖配置
├── vite.config.ts      # Vite 配置
└── tsconfig.json       # TypeScript 配置
```

## 开发环境搭建

### 前置要求
- Node.js 16.0+ 
- npm 或 yarn
- 现代浏览器（Chrome 86+、Edge 86+、Firefox 90+）

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发运行
```bash
npm run dev
# 或
yarn dev
```

访问 `http://localhost:3000` 查看插件界面。

### 构建部署
```bash
npm run build
# 或
yarn build
```

构建后的文件在 `dist/` 目录下。

## 使用说明

### 1. 初始化
插件会自动初始化飞书 SDK 并加载当前多维表格的字段和记录信息。

### 2. 配置导出
- **选择命名字段**：用于文件和文件夹命名的字段
- **选择文本字段**：需要导出为文档的字段
- **选择附件字段**：需要下载的附件字段
- **选择导出格式**：TXT、DOCX 或 PDF

### 3. 开始导出
点击"开始导出"按钮，插件会：
1. 选择保存目录（如果有附件需要下载）
2. 导出文本内容为文档
3. 为每行记录创建文件夹
4. 下载所有选中的附件文件

### 4. 文件组织结构
```
选择的保存目录/
├── 记录1_命名字段值/
│   ├── 记录1_命名字段值_字段1_附件1.jpg
│   ├── 记录1_命名字段值_字段1_附件2.pdf
│   └── ...
├── 记录2_命名字段值/
│   ├── 记录2_命名字段值_字段2_附件3.docx
│   └── ...
└── 多维表格导出_字段1-字段2-字段3_20240101_120000.docx
```

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **飞书集成**：@lark-base-open/js-sdk
- **文件处理**：File System Access API
- **样式方案**：原生 CSS + CSS Variables

## API 权限

插件需要以下飞书 API 权限：
- `bitable:app` - 访问多维表格应用
- `docx:base` - 创建和编辑文档
- `drive:base` - 访问云文档

## 浏览器兼容性

### 完整功能支持
- Chrome 86+
- Edge 86+  
- Safari 15.2+

### 基础功能支持
- Firefox 90+（不支持文件夹选择，附件单独下载）

## 开发说明

### 核心模块

#### api.ts
- 飞书 SDK 初始化
- 表格字段和记录获取
- 附件 URL 获取
- 字段值格式化

#### download.ts  
- 文件系统访问 API 封装
- 本地文件和文件夹创建
- 附件批量下载
- 传统下载模式兼容

#### filename.ts
- 文件名自动生成
- 文件名清理和验证
- 批量命名规则

#### App.tsx
- 用户界面组件
- 状态管理
- 导出流程控制

### 自定义配置

可以通过修改 `src/types.ts` 中的接口来扩展功能：

```typescript
export interface ExportConfig {
  textFields: string[];
  attachmentFields: string[];
  format: ExportFormat;
  namingField: string;
  // 添加自定义配置...
}
```

## 故障排除

### 常见问题

1. **飞书 SDK 初始化失败**
   - 检查是否在飞书环境中运行
   - 确认插件权限配置正确

2. **文件下载失败**
   - 检查浏览器是否支持 File System Access API
   - 确认已授予文件系统权限

3. **附件获取失败**
   - 检查网络连接
   - 确认附件 token 有效

4. **文件名包含特殊字符**
   - 插件会自动清理文件名中的特殊字符
   - 可以在 `filename.ts` 中自定义清理规则

### 调试模式

在开发环境中，打开浏览器控制台可以查看详细的日志信息。

## 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](LICENSE) 文件。

## 更新日志

### v1.0.0 (2024-01-01)
- 🎉 初始版本发布
- ✨ 支持文本字段导出为多种格式
- ✨ 支持附件批量下载
- ✨ 支持文件系统 API 集成
- 🎨 现代化用户界面 