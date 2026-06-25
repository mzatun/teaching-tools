# 教学工具 Teaching Tools

> 嘉应学院 GIS/测绘遥感 教学配套工具、脚本与技能包集合  
> Teaching tools, scripts, and skill packages for GIS/Remote Sensing education at Jiaying University

---

## 📁 仓库结构

```
teaching-tools/
├── README.md                  # 本文件
├── tools/                    # 通用教学小工具
│   ├── excel-tools/          # Excel 批改/分析工具
│   ├── grade-analysis/       # 成绩达成度分析工具
│   └── h5-quiz/             # H5 在线测评工具
├── arcpy-scripts/            # ArcPy 教学脚本实例
│   ├── cursor-demo/         # 游标操作示例
│   ├── raster-processing/    # 栅格处理示例
│   └── toolbox-demos/        # 工具箱开发示例
├── skills/                   # WorkBuddy 技能包
│   ├── thesis-review/        # 毕业论文评审技能
│   ├── syllabus-generator/   # 教学大纲生成技能
│   └── lab-report/          # 实验报告批改技能
└── docs/                    # 使用文档与教程
    ├── arcpy-tutorial/       # ArcPy 教程笔记
    └── lab-manuals/         # 实验指导书
```

---

## 🛠️ 已收录工具

| 工具 | 类型 | 说明 | 状态 |
|------|------|------|------|
| H5评测工具 | Web应用 | Express.js + HTML/CSS/JS 在线测评系统 | ✅ 完整 |
| 课程达成度分析 | Python | 成绩数据分析与达成度计算 | 🟡 开发中 |
| 毕业论文评审 | Skill | 自动评审本科毕设（双视角输出） | ✅ 可用 |
| 教学大纲生成器 | Skill | 嘉应学院标准大纲自动生成 | ✅ 可用 |

---

## 🚀 快速使用

### H5 在线测评工具
```bash
cd tools/h5-quiz
npm install
npm start
# 访问 http://localhost:3000
```

### ArcPy 脚本运行
```bash
# 在 ArcGIS Pro Python 环境中运行
cd arcpy-scripts/cursor-demo
python cursor_example.py
```

---

## 📋 待上传内容

- [ ] 懂你阅卷脚本（Tampermonkey）
- [ ] 试卷批改视觉AI工具
- [ ] 地理综合题自动批改脚本
- [ ] 学生简历评估工具（generate_resume）
- [ ] 课程达成度分析完整工具
- [ ] ArcPy 教程 HTML 笔记（01-11系列）

---

## 🔧 技术栈

- **前端**：HTML5 / CSS3 / JavaScript / Vue3
- **后端**：Node.js / Express / Python / Flask
- **GIS**：ArcPy / ArcGIS Pro / GEE / PIE-Engine / OGE
- **AI**：WorkBuddy Skills / Python 脚本

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

*最后更新：2026-06-25*
