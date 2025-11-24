# 知乎 2025 年度盘点

知乎 2025 年度盘点项目。

## 开发

先复制 `.env.example` 为 `.env.development`, `.env.production`

```
# .env.development
NEXT_PUBLIC_BASE_API_URL=/api
NEXT_PUBLIC_BASE_LOGIN_API_URL=/auth
NEXT_PUBLIC_CDN_BASE_URL=/2025
# copy from zhihu.com
NEXT_PUBLIC_ZHIHU_COOKIE=
```

```
# .env.production
NEXT_PUBLIC_BASE_API_URL=https://api.zhihu.com/api
NEXT_PUBLIC_BASE_LOGIN_API_URL=https://www.zhihu.com/api/v4
```

运行开发服务器:

```bash
npm run dev
# or
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 构建

构建生产版本:

```bash
npm run build
# or
pnpm build
```
