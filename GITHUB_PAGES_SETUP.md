# GitHub Pages 配置说明

## 需要在GitHub仓库中进行的设置

为了确保GitHub Pages部署成功，需要在GitHub仓库的设置中进行以下配置：

### 1. 启用GitHub Pages

1. 进入GitHub仓库页面
2. 点击 "Settings" 标签
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分选择 "GitHub Actions"

### 2. 设置Actions权限

1. 在仓库设置中，点击 "Actions" > "General"
2. 在 "Workflow permissions" 部分：
   - 选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"

### 3. 验证部署

- 当推送tag时，GitHub Actions会自动构建并部署到GitHub Pages
- 部署成功后，可以通过以下链接访问：
  - `https://{username}.github.io/Oji-Assistant`

### 故障排除

如果仍然遇到权限问题：

1. 检查仓库是否为私有仓库（私有仓库可能需要付费计划才能使用GitHub Pages）
2. 确认已正确设置Actions权限
3. 可以在Actions日志中查看详细错误信息

### 备用方案

如果GitHub官方Pages action有问题，workflow中也可以使用peaceiris/actions-gh-pages@v4作为备用方案。
