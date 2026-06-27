# GEE 土地利用/覆盖数据集下载工具

基于 Google Earth Engine 的多源 LULC（Land Use / Land Cover）数据一键下载工具。

> **© 嘉应学院 钟广锐** | mzatun@qq.com

## 功能特性

- 支持 **15 个主流土地利用/覆盖数据集**，覆盖全球、中国、美国、欧洲区域
- 支持 **6 种研究区域模式**：手动绘制、省级、市级、县区级、国家级、全球
- **DEM 地形数据**可选下载（SRTM 30m/90m）
- 自动生成可直接运行的 **GEE JavaScript 代码**
- **一键复制**代码，粘贴至 GEE Code Editor 即可执行
- 单文件应用，**无需安装**，双击 `index.html` 即可使用

## 支持的数据集

### 公开可用（直接使用）

| 数据集 | 分辨率 | 时间跨度 | 区域 |
|--------|--------|----------|------|
| Dynamic World V1 | 10m | 2015-至今 | 全球 |
| ESA WorldCover | 10m | 2020-2021 | 全球 |
| GLAD Land Cover | 30m | 2000/2010/2020 | 全球 |
| USGS NLCD | 30m | 2001-2021 | 美国 |
| CGLS-LC100 | 100m | 2015-2019 | 全球 |
| MODIS MCD12Q1 | 500m | 2001-2023 | 全球 |

### 需申请权限

| 数据集 | 分辨率 | 时间跨度 | 区域 |
|--------|--------|----------|------|
| CLCD | 30m | 1985-2022 | 中国 |
| GLC_FCS30D | 30m | 1985-2022 | 全球 |
| FROM-GLC10 | 10m | 2017/2020 | 全球 |
| FROM-GLC30 | 30m | 2010/2015/2017 | 全球 |
| GlobeLand30 | 30m | 2000/2010/2020 | 全球 |
| 中科院土地利用 | 30m | 1980-2020 | 中国 |
| ESA CCI LC | 300m | 1992-2020 | 全球 |
| AGLC | 30m | 2000-2015 | 全球 |
| CORINE LC | 100m | 1990-2018 | 欧洲 |

## 快速开始

### 1. 环境准备

- 浏览器：Chrome / Edge / Firefox（最新版）
- Google 账号 + GEE 权限（https://signup.earthengine.google.com/）
- 中国大陆用户需科学上网访问 GEE Code Editor

### 2. 使用步骤

1. 双击 `index.html` 打开工具
2. 选择目标数据集
3. 设置研究区域（绘制矩形 / 选择行政区划）
4. 设置时间范围和输出参数
5. （可选）勾选"同时下载 DEM 地形数据"
6. 点击 **📤 复制代码并查看操作指引**
7. 打开 [GEE Code Editor](https://code.earthengine.google.com/)
8. 粘贴代码 → 点击 Run → 在 Tasks 面板启动导出

### 3. 下载结果

导出完成后，访问 [Google Drive](https://drive.google.com) 进入对应文件夹下载 .tif 文件。

## DEM 地形数据

支持同时下载 SRTM DEM 数据：

| 选项 | GEE ID | 分辨率 | 说明 |
|------|--------|--------|------|
| SRTM 30m（推荐） | USGS/SRTMGL1_003 | 30m | 全球80%陆地覆盖 |
| SRTM 90m | USGS/SRTMGL1_003 | 90m | 重采样，适合大尺度分析 |

## 常见问题

**Q: 数据集报错 "Image asset not found"？**
部分数据集需先在 GEE Code Editor 中搜索并申请访问权限。

**Q: 导出失败 "User memory limit exceeded"？**
缩小研究区域、降低分辨率或缩短时间范围。

**Q: 行政区划下拉为空？**
检查网络连接，或使用手动绘制模式。

## 技术说明

- 单文件 HTML 应用（`index.html`），无需构建工具
- 底图：天地图 WMTS 瓦片（WGS84 坐标）
- 行政边界：阿里 DataV 地理数据 API
- DEM 数据：SRTM（USGS/SRTMGL1_003），通过 `ee.Image()` 加载

## 文件结构

```
gee-landuse-downloader/
├── index.html                    # 主程序（单文件应用）
├── README.md                     # 本文件
├── 用户使用手册.md                # 详细使用说明
└── 教程方案.md                    # 数据集技术文档
```

## License

MIT License
