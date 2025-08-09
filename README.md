# One API Hub

一个用于集中管理多个 One-API 兼容站点（如 New API、Veloera、VoAPI、OneHub）的轻量级 Web 服务。支持统一登录、站点校验、账户信息与 API Key 查询、每日签到、导入导出备份等功能。

## 功能特性

- 统一登录（单用户管理员），基于 JWT
- 站点管理：添加 / 编辑 / 删除
- 站点校验：添加/更新时验证凭据是否可用
- 账户信息查询：用户名、额度、已用额度等信息
- API Key 查询：密钥、已用额度、剩余额度等信息
- 签到：不同站点类型自动选择对应签到接口
- 数据导出/导入：JSON 格式
- 仪表盘汇总：总站点数、API Key 总数、总额度与使用率

## 截图
![home](https://github.com/user-attachments/assets/936fb40d-0202-4619-973d-bd0ffa064dfb)
![setting](https://github.com/user-attachments/assets/5fb7dd1f-67cc-414d-8d16-9c1137cddbe3)

## 技术栈

- 前端：React 18 + Vite + TypeScript + Radix UI + Tailwind（组件封装于 `src/components/ui`）
- 后端：Node.js + Hono + @hono/node-server
- 数据库：SQLite（better-sqlite3）
- 安全：bcryptjs（密码哈希）+ jsonwebtoken（JWT）

## 快速开始（本地开发）

```bash
# 1. 安装依赖
npm ci

# 2. 启动开发环境（前后端并行）
npm run dev
# - 前端开发服务: http://localhost:3000
# - 后端 API:     http://localhost:8000
```

默认开发模式会在 `./data/data.db` 创建 SQLite 数据库，并初始化管理员用户：

- 用户名：`admin`（界面仅输入密码，无需输入用户名）
- 初始密码（开发模式）：`admin123456`

## 构建与启动 (生产环境)

```bash
# 构建（生成前端与后端产物到 dist/）
npm run build

# 启动（从 dist/ 运行后端并内置静态资源）
npm start
# 生产服务默认监听 PORT（默认 8000）并同时提供静态前端
```

## 环境变量

- `PORT`：后端监听端口（默认 `8000`）
- `NODE_ENV`：`development` 或 `production`
- `LOG_LEVEL`：日志级别（默认 `info`）
- `JWT_SECRET`：JWT 签名密钥（生产环境务必修改默认值）
- `ADMIN_INITIAL_PASSWORD`：生产环境首次启动必须设置，用于创建 `admin` 初始密码
- `DB_PATH`：生产环境数据库路径（默认 `/data/data.db`）；开发环境固定为 `./data/data.db`

可选 `.env` 示例：

```env
NODE_ENV=production
PORT=8000
LOG_LEVEL=info
JWT_SECRET=change-me-please
ADMIN_INITIAL_PASSWORD=your-strong-password
DB_PATH=/data/data.db
```

## Docker 一键部署

```bash
# 构建镜像
docker build -t one-api-hub:latest .

# 配置环境变量
cp .env.example .env

# 运行容器（首次生产运行需显式指定 ADMIN_INITIAL_PASSWORD）
docker run -d \
  --name one-api-hub \
  -p 8000:8000 \
  --env-file .env \
  -v one-api-hub:/data \
  -v one-api-hub:/app/logs \
  one-api-hub:latest
```

启动后访问 `http://localhost:8000`。
