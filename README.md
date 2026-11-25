# 机器人知识库

中文学习站，围绕机器人零件的选材、制造、连接和验证展开。包含材料学习页面、三类机器人零件案例、电机与三类减速器图解，以及构建时实际执行的质量、挠度和热膨胀计算。

在线阅读：https://tiansongyu.github.io/robotics-knowledge/

内容入口：[docs/index.md](docs/index.md)。建议从学习路线开始，依次阅读基础、材料、工艺、选材与实验。案例参数明确标为教学假设，材料数据附原始来源；内容不替代具体零件的设计与验证。

## 机器人示教与第一人称操作学习

同一仓库另含两套中文 Sphinx 教程。每站有独立的目录、搜索索引、概念图和可执行计算。启动下方预览后可直接进入课程。

| 课程 | 源码 | 本地阅读 |
| --- | --- | --- |
| UMI 手持夹爪、轨迹重建与策略执行 | [UMI 目录](tutorials/umi/index.md) | [打开 UMI](http://127.0.0.1:8000/umi/) |
| Ego4D 手物交互与 Ego-Exo4D 多视角学习 | [Ego 目录](tutorials/ego/index.md) | [打开 Ego](http://127.0.0.1:8000/ego/) |

## 本地构建

需要 Python 3.10 或更高版本；首次安装与准备渲染资源需要联网。

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-docs.txt
.venv/bin/python scripts/vendor_assets.py
.venv/bin/python -m sphinx -E -a -W --keep-going -n -D nb_execution_mode=force -b html docs docs/_build/html
.venv/bin/python scripts/build_tutorials.py
.venv/bin/python scripts/check_links.py
.venv/bin/python -m http.server 8000 --bind 127.0.0.1 --directory docs/_build/html
```

打开 http://127.0.0.1:8000/ 。Windows 将 `.venv/bin/python` 换为 `.venv\Scripts\python`。

站点使用 Sphinx、Read the Docs 官方主题、MyST-NB 和 Mermaid。Notebook 在构建时执行；网页不是在线 Python 环境。Mermaid 11.12.2 与 MathJax 3.2.2 从 npm 官方注册表下载到忽略提交的目录，并随 HTML 部署，读者无需访问第三方 CDN。相应许可证随资源保留。下载脚本固定版本，但未做独立供应链完整性审计。

## 发布与维护

`.github/workflows/pages.yml` 在 main 分支更新后严格构建、强制执行计算、检查本地链接，再部署 GitHub Pages。PR 只构建验证。仓库 Pages 发布方式须设为 GitHub Actions。

正文使用 MyST Markdown。新增页面需登记在 `docs/index.md` 的目录中；引用数据时保留牌号、状态、温湿度、试验方向和资料版本。数据来源见 [docs/sources.md](docs/sources.md)。

修改计算假设时同时检查正文解释和断言。构建成功不代表外部链接长期可用或所有材料结论均经过实物试验。

## 电机结构图解

入口：[电机与三类减速器](docs/drives.md)。新增七张可缩放 SVG，包括电机本体端面图与行星、谐波、摆线针轮的结构图和概念爆炸图。均为教学模型，不对应具体产品型号。

图源可通过 `.venv/bin/python scripts/draw_drives.py` 重新生成；构建后打开 `docs/_build/html/drives.html`。资料来源位于各专题页，核对日期为 2026-11-16。
