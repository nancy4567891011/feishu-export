# 飞书应用配置步骤 🔧

> 基于您当前的飞书开放平台界面进行配置

## 📋 当前状态
✅ 已创建应用"多维表格导出工具"  
✅ 已进入应用管理界面  
🔄 正在配置应用能力  

## 🎯 第一步：添加多维表格插件能力

### 1. 在当前界面中找到"多维表格插件"卡片
- 如截图所示，应该在能力列表中
- 描述："在多维表格中创建插件，让用户在多维表格流转中感知并使用插件..."

### 2. 点击"+ 添加"按钮
- 这是最关键的能力，必须添加

### 3. 配置插件信息
```
插件名称：多维表格导出工具
插件描述：导出多维表格数据为文档和附件
插件图标：（可选择默认图标）
```

## 🎯 第二步：添加云文档能力

### 1. 找到"云文档小组件"卡片
- 用于文档创建和导出功能

### 2. 点击"+ 添加"
- 配置权限：文档读写权限

## 🎯 第三步：配置权限范围

添加能力后，需要配置具体权限：

### API权限设置
```
✅ bitable:app          # 多维表格应用权限
✅ bitable:record       # 记录读取权限  
✅ bitable:field        # 字段信息权限
✅ drive:drive          # 云文档访问权限
✅ docx:write           # 文档写入权限
```

### 数据权限
```
✅ 读取表格结构
✅ 读取表格数据
✅ 下载附件文件
✅ 创建文档
```

## 🎯 第四步：获取应用凭证

### 1. 进入"凭证与基础信息"页面
```
App ID: cli_xxxxxxxxxx        # 复制这个ID
App Secret: xxxxxxxxxxxx      # 复制这个密钥
```

### 2. 更新我们的配置文件
编辑 `src/config.ts`：
```typescript
export const config = {
  isDevelopment: false,
  feishu: {
    appId: 'cli_您刚才复制的App ID',
    appSecret: '您刚才复制的App Secret',
  }
};
```

## 🎯 第五步：配置插件入口

### 1. 在"多维表格插件"配置中
```
插件入口URL: http://localhost:3000
（开发阶段使用本地地址）

生产环境URL: https://your-domain.com
（部署后的正式地址）
```

### 2. 配置插件权限
```
✅ 读取当前表格
✅ 读取表格字段
✅ 读取表格记录
✅ 下载附件
```

## 🎯 第六步：测试配置

### 1. 保存所有配置

### 2. 切换到生产模式
```bash
node switch-mode.js prod
```

### 3. 重启开发服务器
```bash
npm run dev
```

### 4. 在飞书多维表格中测试
- 打开任意多维表格
- 查看是否能找到您的插件
- 测试数据读取功能

## ⚠️ 常见问题

### 1. 找不到多维表格插件选项
- 确认您的飞书账号有开发者权限
- 检查是否在正确的应用类型中

### 2. 权限配置失败
- 确认应用状态为"开发中"
- 检查权限范围设置

### 3. 本地测试失败
- 确认本地服务器正在运行
- 检查网络连接和防火墙设置

## 📞 下一步

配置完成后：
1. 您的插件就可以在飞书多维表格中使用了
2. 可以读取真实的表格数据
3. 可以导出真实的文档和附件

如果遇到问题，请告诉我具体的错误信息，我会帮您排查解决！ 