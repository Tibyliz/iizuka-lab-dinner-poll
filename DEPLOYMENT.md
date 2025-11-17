# 🚀 部署指南

如何将投票系统部署到各种平台的完整指南。

---

## 📦 部署前检查

### 文件清单验证

确保你有以下所有文件:

#### HTML文件 (3个)
- ✅ `index.html` - 投票表单
- ✅ `admin-login.html` - 登录页面
- ✅ `admin.html` - 管理仪表板

#### CSS文件 (2个)
- ✅ `css/style.css` - 表单样式
- ✅ `css/admin.css` - 管理页面样式

#### JavaScript文件 (3个)
- ✅ `js/poll.js` - 投票逻辑
- ✅ `js/login.js` - 登录逻辑
- ✅ `js/admin.js` - 管理功能 (含归档管理)

#### 文档文件 (6个,可选)
- 📄 `README.md` - 项目文档
- 📄 `QUICK_START.md` - 快速开始
- 📄 `ARCHIVE_MANAGEMENT_GUIDE.md` - 归档管理指南
- 📄 `TESTING_GUIDE.md` - 测试指南
- 📄 `PROJECT_SUMMARY.md` - 项目总结
- 📄 `INDEX.md` - 文档索引

**总计**: 8个核心文件 + 6个文档文件 = 14个文件

### 文件夹结构

```
project/
├── index.html
├── admin-login.html
├── admin.html
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── poll.js
│   ├── login.js
│   └── admin.js
└── docs/ (可选)
    ├── README.md
    ├── QUICK_START.md
    ├── ARCHIVE_MANAGEMENT_GUIDE.md
    ├── TESTING_GUIDE.md
    ├── PROJECT_SUMMARY.md
    └── INDEX.md
```

---

## 🌐 部署方式1: GitHub Pages (推荐)

### 优点
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 适合学术用途
- ✅ 版本控制

### 部署步骤

#### 1. 创建GitHub账号
- 访问 [github.com](https://github.com)
- 注册免费账号

#### 2. 创建新仓库
```
1. 点击右上角 "+" → "New repository"
2. 填写:
   - Repository name: iizuka-lab-dinner-poll
   - Description: Dinner poll system for Iizuka Lab
   - Public ✓ (必须是Public才能使用免费Pages)
   - 勾选 "Add a README file"
3. 点击 "Create repository"
```

#### 3. 上传文件
```
方法A: 网页上传
1. 点击 "Add file" → "Upload files"
2. 拖拽所有8个核心文件和文件夹
3. 确保保持文件夹结构
4. Commit message: "Initial commit"
5. 点击 "Commit changes"

方法B: Git命令行
1. git clone https://github.com/你的用户名/iizuka-lab-dinner-poll.git
2. 复制所有文件到克隆的文件夹
3. git add .
4. git commit -m "Initial commit"
5. git push
```

#### 4. 启用GitHub Pages
```
1. 进入仓库的 "Settings"
2. 左侧菜单找到 "Pages"
3. Source:
   - Branch: main (或 master)
   - Folder: / (root)
4. 点击 "Save"
5. 等待1-2分钟
```

#### 5. 获取网址
```
部署成功后,会显示:
✅ Your site is live at https://你的用户名.github.io/iizuka-lab-dinner-poll/

访问URL:
- 投票页面: https://你的用户名.github.io/iizuka-lab-dinner-poll/
- 管理登录: https://你的用户名.github.io/iizuka-lab-dinner-poll/admin-login.html
```

#### 6. 测试
```
1. 访问投票页面
2. 提交测试回复
3. 登录管理页面 (密码: iizukalab)
4. 验证所有功能正常
```

---

## 🌐 部署方式2: Netlify

### 优点
- ✅ 极其简单
- ✅ 拖拽上传
- ✅ 自动HTTPS
- ✅ 快速部署

### 部署步骤

#### 1. 注册Netlify
- 访问 [netlify.com](https://netlify.com)
- 用GitHub/GitLab/Email注册

#### 2. 部署网站
```
1. 点击 "Add new site" → "Deploy manually"
2. 将包含所有文件的文件夹拖拽到页面
3. 等待上传和部署 (约1分钟)
4. 自动生成网址: https://随机名称.netlify.app
```

#### 3. 自定义域名 (可选)
```
1. Site settings → Domain management
2. 点击 "Add custom domain"
3. 输入你的域名
4. 按照提示配置DNS
```

---

## 🌐 部署方式3: Vercel

### 优点
- ✅ 性能优秀
- ✅ 部署快速
- ✅ 免费HTTPS

### 部署步骤

#### 1. 注册Vercel
- 访问 [vercel.com](https://vercel.com)
- 用GitHub/GitLab/Email注册

#### 2. 部署
```
方法A: 从GitHub
1. 点击 "New Project"
2. 选择你的GitHub仓库
3. 点击 "Deploy"

方法B: 拖拽上传
1. 将文件夹拖拽到页面
2. 等待部署完成
```

---

## 🌐 部署方式4: 本地服务器

### 适用场景
- 实验室内网使用
- 测试开发
- 不需要外网访问

### 方法A: Python简单服务器

```bash
# Python 3
cd 项目文件夹
python -m http.server 8000

# 访问: http://localhost:8000
```

### 方法B: Node.js服务器

```bash
# 安装http-server
npm install -g http-server

# 运行
cd 项目文件夹
http-server -p 8000

# 访问: http://localhost:8000
```

### 方法C: VS Code Live Server

```
1. 在VS Code中打开项目文件夹
2. 安装 "Live Server" 扩展
3. 右键 index.html → "Open with Live Server"
```

---

## 🎓 部署到大学服务器

### 东京大学为例

#### 1. 检查权限
```
联系IT部门或实验室管理员,询问:
- 是否有web hosting服务
- 访问权限
- 文件上传方式
- 域名格式
```

#### 2. 上传文件
```
常见方式:
- FTP/SFTP
- SCP
- Web界面上传
```

#### 3. 访问URL
```
可能的格式:
- http://www.lab.u-tokyo.ac.jp/~username/poll/
- http://iizuka-lab.u-tokyo.ac.jp/poll/
```

---

## ⚙️ 部署后配置

### 1. 修改默认密码 (重要!)
```
1. 访问管理登录页面
2. 登录 (密码: iizukalab)
3. Settings → Change Password
4. 输入新密码 (至少6位)
5. 保存
```

### 2. 设置投票标题
```
1. Title Settings
2. 输入标题或使用默认
3. 保存
```

### 3. 配置价格
```
1. Price Settings
2. 输入总费用
3. 设置百分比 (总和=100%)
4. 保存
```

### 4. 测试功能
```
1. 提交测试回复
2. 查看管理页面
3. 测试归档功能
4. 测试导出功能
5. 测试付款追踪
```

---

## 📱 分享给用户

### 获取分享链接

#### GitHub Pages
```
https://你的用户名.github.io/仓库名/
```

#### Netlify
```
https://你的站点名.netlify.app/
```

#### Vercel
```
https://你的项目名.vercel.app/
```

### 分享方式

#### 通过Email
```
主题: Iizuka Lab Dinner Poll

大家好,

请访问以下链接填写聚餐投票:
https://你的网址/

请在 [截止日期] 前完成填写。

谢谢!
```

#### 通过Slack/Teams
```
@channel
大家好!请填写聚餐投票 👇
https://你的网址/
截止日期: [日期]
```

#### 通过二维码
```
1. 使用二维码生成器 (如 qr-code-generator.com)
2. 输入你的网址
3. 下载二维码图片
4. 打印或发送给成员
```

---

## 🔄 更新部署

### GitHub Pages更新
```
1. 修改本地文件
2. 上传到GitHub:
   - 网页: 编辑文件 → Commit
   - Git: git add . → git commit → git push
3. 等待1-2分钟自动重新部署
```

### Netlify更新
```
方法A: 拖拽更新
1. 进入站点
2. Deploys tab
3. 拖拽新文件夹

方法B: Git连接
1. 推送到GitHub
2. Netlify自动部署
```

---

## ⚠️ 重要提示

### 数据存储
```
⚠️ 所有数据存储在用户浏览器的localStorage
⚠️ 不是存储在服务器上
⚠️ 每个用户看到自己浏览器中的数据

建议:
✅ 固定用一台电脑作为管理终端
✅ 定期导出数据备份
✅ 重要投票保存到归档
```

### 密码安全
```
⚠️ 默认密码: iizukalab
✅ 部署后立即修改
✅ 不要分享管理员链接
✅ 定期更换密码
```

### 隐私考虑
```
⚠️ GitHub Pages是公开的
⚠️ 任何人都能访问URL
✅ 不要在投票中收集敏感信息
✅ 考虑使用内网部署
```

---

## 🧪 部署测试清单

部署完成后,测试以下功能:

- [ ] 能访问投票页面
- [ ] 能提交回复
- [ ] 能访问管理登录页面
- [ ] 能用默认密码登录
- [ ] 能修改密码
- [ ] 能看到提交的回复
- [ ] 能设置价格
- [ ] 能标记付款状态
- [ ] 能导出数据
- [ ] 能保存归档
- [ ] 能开始新投票
- [ ] 能查看归档列表
- [ ] 能恢复归档
- [ ] 能导出归档
- [ ] 能删除归档

---

## 🆘 部署问题排查

### 问题1: 404错误
```
原因: 文件路径不正确
解决:
1. 检查文件夹结构
2. 确认index.html在根目录
3. 检查CSS/JS路径是否正确
```

### 问题2: 功能不工作
```
原因: JavaScript没有加载
解决:
1. 清除浏览器缓存
2. 检查浏览器控制台错误
3. 确认所有JS文件都已上传
```

### 问题3: 样式错乱
```
原因: CSS文件未加载
解决:
1. 检查CSS文件路径
2. 确认文件夹结构正确
3. 清除缓存刷新
```

### 问题4: GitHub Pages不更新
```
解决:
1. 检查Pages是否启用
2. 等待3-5分钟
3. 强制刷新 (Ctrl+F5)
4. 检查分支设置是否正确
```

---

## 📊 不同部署方式对比

| 平台 | 难度 | 速度 | 费用 | 自定义域名 | 推荐度 |
|------|------|------|------|-----------|--------|
| GitHub Pages | 中等 | 快 | 免费 | ✅ | ⭐⭐⭐⭐⭐ |
| Netlify | 简单 | 极快 | 免费 | ✅ | ⭐⭐⭐⭐⭐ |
| Vercel | 简单 | 极快 | 免费 | ✅ | ⭐⭐⭐⭐ |
| 本地服务器 | 简单 | 快 | 免费 | ❌ | ⭐⭐⭐ |
| 大学服务器 | 困难 | 中等 | 免费 | ✅ | ⭐⭐⭐⭐ |

**推荐:** GitHub Pages (学术用途) 或 Netlify (最简单)

---

## 🎉 部署完成!

恭喜你成功部署了投票系统!

**下一步:**
1. ✅ 修改默认密码
2. ✅ 配置投票标题和价格
3. ✅ 测试所有功能
4. ✅ 分享链接给实验室成员
5. ✅ 开始收集回复!

祝使用愉快! 🎊

---

**需要帮助?** 查看其他文档:
- 📄 QUICK_START.md - 使用指南
- 📄 README.md - 完整文档
- 📄 TESTING_GUIDE.md - 测试指南
