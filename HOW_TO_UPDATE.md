# 如何更新你的GitHub Pages网站 - 快速指南

## 🎯 问题
你的网站在GitHub Pages上登录时显示错误: **"Error connecting to server"**

## ✅ 解决方案
我们已经修复了代码!现在你需要更新你GitHub仓库中的JavaScript文件。

## 📋 更新步骤 (超级简单!)

### 方法1: 在GitHub网页上直接更新 (推荐!) ⭐

#### 步骤1: 更新 login.js

1. **打开你的GitHub仓库**
   - 访问你的仓库页面
   
2. **导航到文件**
   - 点击 `js` 文件夹
   - 点击 `login.js` 文件

3. **编辑文件**
   - 点击右上角的铅笔图标 ✏️ (Edit this file)
   - 删除所有现有内容 (全选 Ctrl+A, 然后Delete)

4. **复制新内容**
   - 从这个项目打开 `js/login.js`
   - 复制全部内容
   - 粘贴到GitHub的编辑器中

5. **保存**
   - 滚动到页面底部
   - 在 "Commit changes" 框中输入: `Fix login error - Update login.js`
   - 点击绿色按钮 **"Commit changes"**

#### 步骤2: 更新 admin.js

重复步骤1的过程,但是针对 `admin.js` 文件:
1. 打开 `js/admin.js`
2. 点击编辑 ✏️
3. 删除所有内容
4. 从新项目复制 `js/admin.js` 的内容
5. 粘贴
6. Commit: `Fix admin dashboard - Update admin.js`

#### 步骤3: 更新 poll.js

重复步骤1的过程,但是针对 `poll.js` 文件:
1. 打开 `js/poll.js`
2. 点击编辑 ✏️
3. 删除所有内容
4. 从新项目复制 `js/poll.js` 的内容
5. 粘贴
6. Commit: `Fix data storage - Update poll.js`

#### 步骤4: 等待部署

- ⏱️ 等待 **1-2分钟** GitHub Pages自动重新部署
- 你可以在仓库的 **"Actions"** 标签查看部署进度

#### 步骤5: 测试

1. **清除浏览器缓存**
   - Chrome/Edge: `Ctrl+Shift+Delete`
   - Firefox: `Ctrl+Shift+Delete`
   - Safari: `Cmd+Option+E`
   - 或者使用隐私/无痕模式

2. **硬刷新页面**
   - Windows/Linux: `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`

3. **测试登录**
   - 访问你的 `admin-login.html` 页面
   - 输入密码: `iizukalab`
   - 点击 Login
   - ✅ 应该能成功登录了!

---

## 🔧 方法2: 下载并重新上传 (如果方法1不行)

### 步骤1: 下载新文件

从这个项目下载以下文件:
- `js/login.js`
- `js/admin.js`
- `js/poll.js`

### 步骤2: 删除旧文件

在GitHub仓库中:
1. 进入 `js` 文件夹
2. 点击每个文件 → 点击垃圾桶图标 🗑️ → Commit删除
3. 删除 `login.js`, `admin.js`, `poll.js`

### 步骤3: 上传新文件

1. 进入 `js` 文件夹
2. 点击 **"Add file"** → **"Upload files"**
3. 拖拽下载的三个新文件
4. Commit changes

### 步骤4: 等待和测试

- 等待1-2分钟
- 清除浏览器缓存
- 测试登录

---

## 🎉 完成!

更新后你的网站应该能够:
- ✅ 成功登录管理员页面
- ✅ 查看投票回复
- ✅ 设置价格
- ✅ 追踪付款
- ✅ 导出数据
- ✅ 所有功能正常工作!

---

## ❓ 常见问题

### Q: 我更新了文件,但还是显示错误?

**A: 清除浏览器缓存!**
1. 按 `Ctrl+Shift+Delete` (Windows) 或 `Cmd+Option+E` (Mac)
2. 选择清除 "缓存的图片和文件"
3. 点击清除
4. 关闭并重新打开浏览器
5. 再次访问网站

或者使用无痕/隐私浏览模式测试。

### Q: 如何确认文件已经更新?

**A: 检查GitHub仓库:**
1. 查看 `js/login.js` 文件
2. 文件顶部应该有注释: `// Fixed version that works reliably on GitHub Pages`
3. 文件大小应该约7KB
4. 最近修改时间应该是刚才

### Q: 更新后数据会丢失吗?

**A: 不会!**
- 新版本使用相同的localStorage
- 所有现有数据都会保留
- 只是修复了登录错误

### Q: 默认密码是什么?

**A: `iizukalab`**
- 登录后请立即修改密码
- 在管理面板的 Settings 中修改

---

## 📞 需要帮助?

如果按照上述步骤操作后仍有问题:

1. 检查浏览器控制台 (按F12)
2. 查看是否有错误信息
3. 确认三个JavaScript文件都已更新
4. 尝试使用不同的浏览器测试
5. 确认GitHub Pages部署状态正常

---

## ✨ 技术改进说明

**为什么之前会出错?**
- 旧版本使用SQL.js库
- SQL.js需要加载.wasm文件
- GitHub Pages上加载.wasm文件有时会失败

**新版本改进:**
- ✅ 使用浏览器内置的localStorage
- ✅ 不需要加载外部库
- ✅ 更快、更稳定
- ✅ 完全兼容GitHub Pages
- ✅ 所有功能保持不变

---

**祝你更新顺利!** 🚀

有任何问题随时询问!
