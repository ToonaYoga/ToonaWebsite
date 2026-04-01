# GitHub + 宝塔 WebHook 自动部署配置指南

## 环境说明

- 服务器：腾讯云 Ubuntu
- 面板：宝塔面板
- 网站目录：`/www/wwwroot/toona.yoga`
- 代码仓库：GitHub（私有仓库）

---

## 第一步：服务器初始化 Git

SSH 登录服务器，执行：

```bash
git config --global --add safe.directory /www/wwwroot/toona.yoga
cd /www/wwwroot/toona.yoga
git init
git remote add origin https://用户名:TOKEN@github.com/用户名/仓库名.git
git fetch https://用户名:TOKEN@github.com/用户名/仓库名.git main:main
git reset --hard main
```

> 注意：GitHub 已不支持密码登录，必须使用 Personal Access Token（见第二步）

---

## 第二步：生成 GitHub Personal Access Token

1. GitHub → 右上角头像 → Settings
2. 左侧底部 → Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token → 勾选 `repo` 权限
4. 生成后立即复制（只显示一次）

---

## 第三步：宝塔安装并配置 WebHook

1. 宝塔面板 → 软件商店 → 搜索「WebHook」→ 安装
2. 安装完成后点「设置」→「添加 Hook」
3. 填写：
   - 名称：`toona-deploy`
   - 脚本内容（关键）：

```bash
#!/bin/bash
cd /www/wwwroot/toona.yoga
git fetch https://用户名:TOKEN@github.com/用户名/仓库名.git main:main
git reset --hard main
```

> ⚠️ 重要：不能用 `git fetch origin`，因为 WebHook 脚本运行时没有 credential cache，必须把 token 直接写入 fetch URL。`git reset --hard main` 对应本地 main 分支，不是 `origin/main`。

4. 保存后点「查看密钥」，复制 WebHook URL，格式为：
```
https://服务器IP:15501/hook?access_key=你的密钥
```

---

## 第四步：GitHub 配置 Webhook

1. GitHub 仓库 → Settings → Webhooks → Add webhook
2. 填写：
   - Payload URL：`https://服务器IP:15501/hook?access_key=你的密钥`
   - Content type：`application/json`
   - 触发事件：`Just the push event`
3. 保存

---

## 第五步：开放服务器端口

腾讯云控制台 → 安全组 → 入站规则 → 添加：
- 协议：TCP
- 端口：15501
- 来源：0.0.0.0/0

---

## 验证部署

1. 本地修改代码，push 到 GitHub
2. GitHub → 仓库 → Settings → Webhooks → Recent Deliveries，确认有 ✅ push 记录
3. 宝塔 WebHook → 日志，确认有执行记录（显示 `HEAD is now at xxxxxx`）
4. 刷新网站确认更新生效

---

## 日常使用流程

```bash
# 本地修改完成后
git add .
git commit -m "描述修改内容"
git push
# 服务器自动同步，无需手动操作
```

---

## 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| WebHook 无日志但调用次数增加 | 脚本没有执行权限或认证失败 | 把 token 写入 fetch URL |
| `git fetch origin` 失败 | WebHook 运行环境没有 credential | 改用完整 token URL |
| `HEAD is now at` 显示旧版本 | fetch 和 reset 的分支引用不一致 | 用 `main:main` + `reset --hard main` |
| GitHub push 后没有触发 | 端口未开放 | 腾讯云安全组开放 15501 端口 |

---

## 安全提示

- Token 写在脚本里存在泄露风险，定期在 GitHub 轮换 Token
- 宝塔 WebHook 的 access_key 不要公开分享
- 建议仓库设为 Private
