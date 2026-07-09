# 教学工具 Teaching Tools

> 嘉应学院 GIS/测绘遥感 教学配套工具、脚本与技能包集合  
> Teaching tools, scripts, and skill packages for GIS/Remote Sensing education at Jiaying University

---

## 📁 仓库结构

```
teaching-tools/
├── README.md                      # 本文件
├── 达成度分析工具/                # 课程达成度分析 HTML 工具
│   ├── 达成度分析工具v0.48.html   # 最新版（含AI报告生成）
│   ├── 达成度分析工具v0.47.html   # 上一版
│   ├── README.md                  # 工具说明与版本差异
│   └── 用户使用手册.md
├── H5评测工具/                   # 在线测评系统
│   ├── README.md
│   ├── 01-需求分析.md ~ 08-部署文档.md
│   ├── src/                       # Express.js 前后端源码
│   └── 题目库-完整版.json
├── 教学相长技能包/                # WorkBuddy 教学技能包（7个）
│   ├── README.md                  # 技能包说明文档
│   ├── jiaying-syllabus-generator.zip
│   ├── arcpy-course-notes.zip
│   ├── thesis-proposal-review.zip
│   ├── resume-evaluator.zip
│   ├── tutorial-to-logic.zip
│   ├── research全能助手.zip
│   └── knowledge-graph-skill.zip
├── gee-landuse-downloader/         # GEE 土地利用数据集下载工具
│   ├── README.md                   # 工具说明
│   ├── index.html                  # 主程序（单文件应用）
│   ├── 用户使用手册.md              # 详细操作指南
│   └── 教程方案.md                  # 数据集技术文档
├── 业务文档/                    # 业务与方法论文档（脱敏公开版）
│   ├── 个人OPC服务案例集（脱敏版）.md
│   ├── 钟广锐画像报告（脱敏版）.md
│   ├── OPC业务理念白皮书（脱敏版）.md
│   └── 无人机低空经济业务方案（脱敏版）.md
└── ArcPy脚本实例/                # （待上传）
```

---

## 🛠️ 已收录工具

| 工具 | 类型 | 说明 | 状态 |
|------|------|------|------|
| **达成度分析工具** | 单文件 HTML | 课程达成度计算 + AI 报告生成（v0.48） | ✅ 完整 |
| **H5评测工具** | Web应用 | Express.js + HTML/CSS/JS 在线测评系统 | ✅ 完整 |
| **嘉应学院教学大纲生成器** | WorkBuddy Skill | 按嘉应标准自动生成课程大纲 | ✅ 完整 |
| **ArcPy 课程笔记生成** | WorkBuddy Skill | 多巴胺配色 HTML 学习笔记 | ✅ 完整 |
| **毕业论文开题评审** | WorkBuddy Skill | AI 辅助评审毕设选题开题报告 | ✅ 完整 |
| **简历评估助手** | WorkBuddy Skill | 学生简历解析与评估报告生成 | ✅ 完整 |
| **教程逻辑化讲解** | WorkBuddy Skill | 软件操作教程转结构化讲解页面 | ✅ 完整 |
| **科研全能助手** | WorkBuddy Skill | 论文复现/代码调试/数据分析/写作全流程 | ✅ 完整 |
| **GEE 土地利用数据下载工具** | 单文件 HTML | 15个LULC数据集一键下载 + GEE代码自动生成 | ✅ 完整 |
| **知识图谱生成器** | WorkBuddy Skill | JSON结构化知识点转 D3.js 交互式知识图谱 | ✅ 完整 |

---

## 📚 业务与方法论文档（脱敏版）

以下文档为能力展示与方法论沉淀的**公开脱敏版**，已移除具体报价金额、客户真实名称与内部能力评分。完整版见作者个人主页仓库 [mzatun/mzatun](https://github.com/mzatun/mzatun)。

| 文档 | 内容 |
|------|------|
| [个人OPC服务案例集（脱敏版）](业务文档/个人OPC服务案例集（脱敏版）.md) | 系统 / 项目 / 工具三层交付能力，23 个实战案例 |
| [钟广锐画像报告（脱敏版）](业务文档/钟广锐画像报告（脱敏版）.md) | 双师型三维能力 × 七业联动能力全景 |
| [OPC业务理念白皮书（脱敏版）](业务文档/OPC业务理念白皮书（脱敏版）.md) | 基于虎嗅洞察的 OPC 不可替代性框架 |
| [无人机低空经济业务方案（脱敏版）](业务文档/无人机低空经济业务方案（脱敏版）.md) | 低空经济"采—建—管—用—解译"业务总图 |

> ⚠️ 文档中的项目规模（文件数、文档数等）为能力佐证，保留公开；如需完整报价与合作细节，请联系作者。

---

## 🚀 快速使用

### 达成度分析工具（HTML 单文件）

无需安装，双击 `达成度分析工具v0.48.html` 用浏览器打开即可使用。

**核心功能：**
- 支持 Excel 成绩表导入（`.xlsx`）
- 等级加权法（方案A）和权重分配法（方案B）两种计算模式
- 多班级分班与合并分析
- **v0.48 新增**：接入大模型 API，自动生成课程达成度分析报告

**AI报告生成配置（v0.48新增）：**
1. 在计算完成后，点击「AI生成达成度报告」
2. 选择大模型平台（Agens AI / 通义千问 / DeepSeek / 智谱GLM / Kimi / 豆包 / 小米MiMo）
3. 填入 API Key（Agens AI 可免 Key 使用）
4. 点击「确认配置」→「开始生成」
5. 等待 AI 生成报告，可导出打印

> ⚠️ **注意**：AI报告生成需要自行申请对应平台的 API Key。Agens AI 提供免费额度，无需配置 Key 即可试用。

---

### H5 在线测评工具

```bash
cd H5评测工具
npm install
npm start
# 访问 http://localhost:3000
```

---

## 📋 待上传内容

- [ ] 懂你阅卷脚本（Tampermonkey）
- [ ] 试卷批改视觉AI工具
- [ ] 地理综合题自动批改脚本
- [ ] 学生简历评估工具（generate_resume）
- [ ] ArcPy 教程 HTML 笔记（01-11系列）
- [ ] ArcPy 教学脚本实例

---

## 🔧 技术栈

- **前端**：HTML5 / CSS3 / JavaScript（单文件工具）
- **后端**：Node.js / Express / Python / Flask
- **GIS**：ArcPy / ArcGIS Pro / GEE / PIE-Engine / OGE
- **AI**：兼容 OpenAI API 格式的大模型（Agens/Qwen/DeepSeek/GLM/Kimi/豆包/MiMo）

---

## 👤 作者

**钟广锐**  
嘉应学院 · 地理科学与旅游学院  
GIS/测绘遥感 双师型教师  
GitHub: [@mzatun](https://github.com/mzatun)

---

## 📄 License

本仓库内容仅供教学与学习使用，禁止商业用途。  
Tools in this repository are for educational purposes only.

---

*最后更新：2026-07-09*
