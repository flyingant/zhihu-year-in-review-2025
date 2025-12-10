# 知乎 2025 年度盘点

知乎 2025 年度盘点项目。

## 技术栈 (Tech Stack)

### 核心框架与运行时
- **Next.js** 16.0.3 - React 框架，使用 App Router
- **React** 19.2.0 - UI 库
- **React DOM** 19.2.0 - React 渲染器
- **TypeScript** 5 - 类型系统

### 样式与 CSS
- **Tailwind CSS** 3.4.17 - 实用优先的 CSS 框架
- **PostCSS** - CSS 处理工具
  - `tailwindcss` 3.4.17
  - `autoprefixer` 10.4.20 - 自动添加浏览器前缀
  - `postcss-mobile-forever` 5.0.0 - 移动端优先响应式设计
  - `postcss-px-to-viewport-8-plugin` 1.2.5 - px 到 vw/vh 转换
- **CSS Filters** - 原生 CSS 滤镜效果（用于动画和视觉效果）

### 动画库
- **Framer Motion** 12.23.25 - 强大的 React 动画库，用于构建流畅的动画和交互效果

### HTTP 与 API
- **Axios** 1.13.2 - HTTP 客户端

### UI 组件与库
- **Swiper** 12.0.3 - 触摸滑动组件
  - 使用 Pagination 和 Autoplay 模块
- **react-intersection-observer** 10.0.0 - Intersection Observer React Hook

### 工具库
- **Lodash** 4.17.21 - JavaScript 工具库

### 分析与追踪
- **za-js-sdk** 4.19.2 - 分析和追踪 SDK

### 开发工具
- **ESLint** 9 - 代码检查工具
  - `eslint-config-next` 16.0.3
- **Sharp** 0.34.5 - 图像优化工具
- **react-docgen-typescript** 2.4.0 - TypeScript 文档生成工具

### 构建与部署
- **静态导出** - Next.js 配置为静态站点生成 (`output: "export"`)
- **Base Path** - 生产环境为 `/2025`，开发环境为空
- **包管理器** - pnpm

### 项目特性
- **App Router** - Next.js App Router 架构
- **TypeScript** - 严格模式
- **路径别名** - `@/*` 映射到 `src/*`
- **客户端组件** - 使用 `"use client"` 指令
- **Context API** - 自定义 React Contexts（assets, toast 等）
- **知乎 Hybrid SDK** - 与知乎移动端 SDK 集成
- **图片优化** - Next.js Image 组件（静态导出时未优化）
- **环境变量** - 开发和生产环境分离配置
- **API 重写** - 开发环境代理到知乎 API

## 开发

创建环境变量文件 `.env.development` 和 `.env.production`:

```
# .env.development
NEXT_PUBLIC_BASE_API_URL=/api
NEXT_PUBLIC_BASE_LOGIN_API_URL=/auth
NEXT_PUBLIC_BASE_VIDEO_API_URL=
NEXT_PUBLIC_CDN_BASE_URL=
# copy from zhihu.com
NEXT_PUBLIC_ZHIHU_COOKIE=
```

```
# .env.production
NEXT_PUBLIC_BASE_API_URL=https://api.zhihu.com/api
NEXT_PUBLIC_BASE_LOGIN_API_URL=https://www.zhihu.com/api/v4
NEXT_PUBLIC_BASE_VIDEO_API_URL=https://api.zhihu.com
NEXT_PUBLIC_CDN_BASE_URL=/2025
# copy from zhihu.com
NEXT_PUBLIC_ZHIHU_COOKIE=
```

**注意**: 
- 开发环境: `basePath` 为空，`NEXT_PUBLIC_CDN_BASE_URL` 为空
- 生产环境: `basePath` 自动设置为 `/2025`，`NEXT_PUBLIC_CDN_BASE_URL` 需要设置为 `/2025`

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

## Scene Theme System

This document explains how to use the centralized theme system for report scenes.

### Overview

The theme system provides consistent styling (fonts, colors, layout, typography) across all scene components. It consists of:

1. **Theme Configuration** (`src/lib/scene-theme.ts`) - Central theme definitions
2. **Theme Hooks** (`src/hooks/useSceneTheme.ts`) - React hooks to access theme
3. **BaseScene Component** (`src/components/report/scenes/BaseScene.tsx`) - Reusable wrapper component

### Usage

#### Option 1: Using BaseScene Component (Recommended)

The easiest way is to wrap your scene content with `BaseScene`:

```tsx
import BaseScene from "./BaseScene";
import { useSceneTheme, colorClass, typographyClass } from "@/hooks/useSceneTheme";

export default function MyScene({ onNext }: PageProps) {
  const theme = useSceneTheme();
  
  return (
    <BaseScene onNext={onNext}>
      <div className={typographyClass('title')}>
        Your Title
      </div>
      <span className={colorClass('pink', 'font-bold text-[18px]')}>
        Highlighted Text
      </span>
    </BaseScene>
  );
}
```

#### Option 2: Manual Implementation

If you need more control, you can use the hooks directly:

```tsx
import { useSceneTheme, useSceneThemeStyles, colorClass, typographyClass } from "@/hooks/useSceneTheme";

export default function MyScene({ onNext }: PageProps) {
  const theme = useSceneTheme();
  const styles = useSceneThemeStyles();
  
  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-white flex ${theme.layout.paddingTop}`}
      style={styles}
      onClick={onNext}
    >
      <div className={`relative ${theme.layout.containerWidth} bg-white`}>
        <div className={`${theme.layout.baseFontSize} ${theme.layout.paddingX}`}>
          {/* Your content */}
        </div>
      </div>
    </div>
  );
}
```

### Available Theme Properties

#### Colors
- `theme.colors.pink` → `text-r-pink`
- `theme.colors.blue` → `text-r-blue`
- `theme.colors.fern` → `text-r-fern`
- `theme.colors.green` → `text-r-green`
- `theme.colors.yellow` → `text-r-yellow`

#### Typography Sizes
- `theme.typography.title` → `text-[22px]`
- `theme.typography.subtitle` → `text-[18px]`
- `theme.typography.body` → `text-[14px]`
- `theme.typography.highlight` → `text-[24px]`
- `theme.typography.large` → `text-[32px]`

#### Layout
- `theme.layout.containerWidth` → `w-[375px]`
- `theme.layout.paddingTop` → `pt-[120px]`
- `theme.layout.paddingX` → `pl-[34px] pr-[34px]`
- `theme.layout.baseFontSize` → `text-[14px]`

#### Font
- `theme.font.family` → `var(--font-tianwang)`

### Helper Functions

#### `colorClass(color, size?)`
Creates a color class with optional size classes:

```tsx
colorClass('pink', 'font-bold text-[18px]') 
// → "text-r-pink font-bold text-[18px]"
```

#### `typographyClass(type)`
Gets typography size class:

```tsx
typographyClass('title') 
// → "text-[22px]"
```

### Customizing Theme

You can override theme settings per scene:

```tsx
const theme = useSceneTheme({
  layout: {
    paddingTop: 'pt-[100px]', // Custom padding
  },
  colors: {
    pink: 'text-custom-pink', // Custom color
  }
});
```

### Migration Example

**Before:**
```tsx
<div className="relative w-full h-screen overflow-hidden bg-white flex pt-[120px]"
      style={{ fontFamily: 'var(--font-tianwang)' }}>
  <div className="relative w-[375px] bg-white">
    <div className="text-[14px] pl-[34px]">
      <span className="text-r-pink font-bold text-[18px]">Text</span>
    </div>
  </div>
</div>
```

**After:**
```tsx
<BaseScene>
  <span className={`${colorClass('pink', 'font-bold')} ${typographyClass('subtitle')}`}>
    Text
  </span>
</BaseScene>
```
