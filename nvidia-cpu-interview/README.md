# NVIDIA CPU 系统软件面试手册

[在线阅读](https://tiansongyu.github.io/robotics-knowledge/nvidia-cpu-interview/) · [机器人知识库](https://tiansongyu.github.io/robotics-knowledge/#software)

针对 NVIDIA Senior System Software Engineer, CPU（JR2025929，上海 / 深圳）的中文学习站。首页对照招聘要求和自测标准，八章涵盖系统编程、内核、Arm 与 SoC、驱动、诊断、排障、平台差异和项目深挖。岗位依据见 [NVIDIA 官方职位说明](https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/China-Shenzhen/Senior-System-Software-Engineer--CPU_JR2025929)。

## 本地阅读

先按下方“修改与重建”生成 `docs/_build/html/index.html`，再从本目录启动 HTTP 服务，查看手册和搜索结果。

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory docs/_build/html
```

浏览器打开 [本地学习站](http://127.0.0.1:8765/)。若该端口已被本学习站占用，直接打开地址即可。

## 修改与重建

正文位于 `docs/*.rst`，示例源码位于 `docs/examples/completion.c`。构建依赖 Python 3.10 或更高版本，在本目录运行以下命令。

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-docs.txt
.venv/bin/python -m sphinx -W --keep-going -n -b html docs docs/_build/html
```

在“诊断软件与测试设计”章可下载 C11 练习，也可以直接编译仓库内的示例。

```sh
cc -std=c11 -Wall -Wextra -Werror docs/examples/completion.c -o /tmp/cpu-completion
/tmp/cpu-completion
```

正常运行应输出四个通过项，末行是 `PASS: 4 checks`。
