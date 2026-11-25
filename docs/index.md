# 机器人知识库

**让材料知识落到一个能加工、能装配、能长期工作的机器人零件上。**

这套中文学习文档面向准备自己制造机器人的学习者。先建立力学与材料组织的基础，再认识金属、塑料和复合材料，最后用选材表、计算和实验验证设计。无需先学完整的材料学课程；涉及公式时会解释单位、假设和适用边界。

```{note}
材料没有脱离工况的“最强排名”。同一牌号的热处理、产品形态、打印方向、温度和湿度，都可能改变结论。这里的材料候选是学习与初筛建议；制造时需要具体供应商的数据表和样件验证。
```

## 从这里开始

| 你现在想解决的问题 | 阅读入口 | 学完后的产出 |
|---|---|---|
| 不知道机器人材料学该学什么 | [学习路线](roadmap.md) | 一份自己的知识与实践计划 |
| 分不清强度、刚度、硬度、韧性 | [力学基础](mechanics.md) | 能解释“没断，但精度已经不合格” |
| 想选铝、镁、钢或铁 | [铝与镁](light-metals.md)、[钢与铸铁](steels.md) | 带牌号和状态的候选清单 |
| 想用 PLA、PETG、TPU 打机器人 | [塑料](polymers.md)、[增材制造](printing.md) | 材料、方向、连接方式的试验方案 |
| 已经有零件，要做取舍 | [选材方法](selection.md)、[案例](cases.md) | 一页可追溯的选材记录 |
| 想动手算、动手测 | [计算实验](calculations.md)、[验证实验](testing.md) | 质量与挠度估算、实测记录 |

## 电机与减速器图解

新增[结构学习专题](drives.md)：电机本体、行星、谐波和摆线针轮，配七张结构图与概念爆炸图、减速比示例及 RV 区分。

```{toctree}
:maxdepth: 2
:caption: 电机与传动结构

drives
```

## 机器人示教与第一人称操作学习

```{raw} html
<ul>
  <li><a href="umi/index.html">UMI 机器人示教教程</a>。跟随手持夹爪的一次取杯示教，从腕部相机追到末端动作。</li>
  <li><a href="ego/index.html">Ego 第一人称操作学习教程</a>。用开盒片段学习关键帧标注，再用多视角记录检查三维手姿。</li>
</ul>
```

## 本站的证据约定

- **材料事实**：贴近正文链接大学课程、制造商数据表、官方技术手册。
- **工程推导**：说明模型与假设，避免把计算结果当成测试结论。
- **教学假设**：用于比较的尺寸、载荷和部分参数不是某台机器人的实测值。
- **采购与验收**：以订单指定的标准、版本、牌号、状态和批次为准。

资料核对日期：2026-11-16。完整来源及进一步阅读见[资料索引](sources.md)。

```{toctree}
:maxdepth: 2
:caption: 先建立判断能力

roadmap
mechanics
microstructure
```

```{toctree}
:maxdepth: 2
:caption: 认识机器人材料

light-metals
steels
polymers
composites
```

```{toctree}
:maxdepth: 2
:caption: 把材料变成零件

printing
manufacturing
selection
cases
```

```{toctree}
:maxdepth: 2
:caption: 计算、实验与查阅

calculations
testing
glossary
sources
```
