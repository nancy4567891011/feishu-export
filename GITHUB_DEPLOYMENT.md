# GitHub Pages 部署指南 🚀

## 🎯 目标
将飞书多维表格导出工具部署到GitHub Pages，获得稳定的云端访问地址

## 📋 部署步骤

### 第一步：创建GitHub仓库
1. **访问 https://github.com**
2. **点击右上角的 "+" 号，选择 "New repository"**
3. **填写仓库信息**：
   ```
   Repository name: feishu-export-tool
   Description: 飞书多维表格导出工具
   选择: Public（公开）
   不要勾选 Initialize this repository with README
   ```
4. **点击 "Create repository"**

### 第二步：上传代码到GitHub
在您的项目目录中运行以下命令：

```bash
# 1. 提交本地代码
git commit -m "Initial commit: 飞书多维表格导出工具"

# 2. 添加远程仓库（替换YOUR_USERNAME为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/feishu-export-tool.git

# 3. 推送代码到GitHub
git branch -M main
git push -u origin main
```

### 第三步：配置GitHub Pages
1. **在GitHub仓库页面，点击 "Settings"**
2. **在左侧菜单找到 "Pages"**
3. **在 "Source" 部分选择 "Deploy from a branch"**
4. **Branch 选择 "main"**
5. **Folder 选择 "/ (root)"**
6. **点击 "Save"**

### 第四步：等待部署完成
- GitHub会自动构建和部署您的应用
- 通常需要1-5分钟
- 完成后您会得到一个地址：`https://YOUR_USERNAME.github.io/feishu-export-tool`

### 第五步：更新飞书应用配置
1. **回到飞书开发者后台**
2. **进入"网页应用"配置**
3. **将桌面端主页URL更新为**：
   ```
   https://YOUR_USERNAME.github.io/feishu-export-tool
   ```
4. **保存配置**

## 🎉 完成！

部署完成后：
1. ✅ 您的应用将有一个稳定的云端地址
2. ✅ 任何人都可以访问（在飞书环境中）
3. ✅ 不依赖您的本地电脑
4. ✅ 自动HTTPS加密

## 🔧 如果遇到问题

### 常见问题：
1. **页面显示404**: 检查GitHub Pages设置，确保选择了正确的分支
2. **应用无法加载**: 检查控制台错误，可能需要调整文件路径
3. **权限错误**: 确保仓库是公开的

### 优化建议：
1. **自定义域名**: 可以绑定您自己的域名
2. **自动部署**: 推送代码后自动更新
3. **版本控制**: 可以回滚到任何历史版本

## 📞 需要帮助？
如果部署过程中遇到任何问题，请提供：
1. 错误信息截图
2. GitHub仓库链接
3. 具体的操作步骤

我会帮您解决！ 