# 小小花 · 幼小衔接自学 App

面向 5–7 岁幼小衔接阶段的离线自学 H5，覆盖**语文 / 数学 / 英语 / 自然 / 科学**五大科目，约 144 个游戏化关卡。支持手机、平板；可 PWA「装机」、Android 打包，运行时无需远程服务。

## 快速开始

```bash
npm install
npm run dev:h5
```

浏览器打开控制台提示的地址（默认 `http://localhost:5173`）。

### 局域网体验（iPad / 手机）

1. 电脑与设备连同一 Wi-Fi
2. 运行 `npm run dev:h5`（已绑定 `0.0.0.0`）
3. 设备浏览器访问 `http://电脑局域网IP:5173`
4. iPad/iPhone：Safari → 分享 → **添加到主屏幕**，可获全屏体验

查本机 IP（Windows）：`ipconfig`，看「无线局域网适配器」的 IPv4。

## 三条交付路径

### 1. PWA 离线部署（推荐 · iPad / 全平台主路径）

首次打开域名会下载全部静态资源（约数 MB～十余 MB），之后可断网使用。

```bash
npm run build:h5
```

产物目录：`dist/build/h5/`

1. 将产物上传到你的**已备案域名**静态空间（Nginx / OSS / 任意静态托管）
2. **必须 HTTPS**（Let's Encrypt 免费证书即可）
3. 用手机/平板浏览器打开 → 「添加到主屏幕」即完成装机
4. 验证离线：装机后开飞行模式，再点桌面图标应仍可学

> 国内服务器域名需完成 ICP 备案。无域名时请用下面两条路径。

### 2. Android APK（HBuilderX 云打包）

1. 安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 将本项目整个文件夹拖入 HBuilderX
3. 菜单：**发行 → 原生 App-云打包 → Android**
4. 使用 DCloud 公共证书或自有证书，打出 apk 后安装即可离线使用

无需域名、无需备案。

### 3. iOS / iPad 正式 ipa（可选）

需 Apple 开发者账号（$99/年）。在 HBuilderX 配置证书与 Profile 后云打包。  
**日常体验请优先用 PWA**，无需开发者账号。

> 注意：自 2022 年起，HBuilderX「标准基座」无法直接装到 iOS 真机，需自有证书重签，流程繁琐，不推荐作为交付手段。

## 功能一览

| 模块 | 说明 |
|------|------|
| 五科课程 | 语文拼音汉字古诗、数学运算图形逻辑、英语字母拼读、自然四季动植物、科学实验身体宇宙 |
| 互动玩法 | 点读、听音选、拖拽配对、描红、拼读、选择题、排序、小实验、跟读 |
| 进度体系 | 关卡解锁、1–3 星评定、本地持久化 |
| 家长中心 | 各科进度、星星、学习时长 |
| 语音 / 音效 | 系统 TTS + Web Audio 合成音效（零音频文件） |

## 项目结构

```
src/
  pages/          首页 / 科目地图 / 关卡播放 / 家长中心 / 设置
  engine/         课程 Schema、进度、渲染器、题库生成器
  components/     互动组件 + UI + SVG 吉祥物
  data/           五科课程内容（纯本地 TS）
  utils/          TTS / 音效 / 本地存储
  styles/         设计令牌与动画
public/           PWA manifest 与图标
```

## 常用命令

```bash
npm run dev:h5      # 开发（局域网可访问）
npm run build:h5    # 生产构建（含 Service Worker）
npm run type-check  # TypeScript 检查
```

## 技术栈

uni-app · Vue3 · TypeScript · Vite · vite-plugin-pwa

## 说明与限制

- 学习进度存在浏览器/App 本地存储；清除站点数据会丢失进度
- Android WebView TTS 质量因机型而异，无语音时自动退化为文字高亮
- iOS Safari 若长期不用且存储紧张，缓存可能被系统清理；联网打开一次即可恢复
