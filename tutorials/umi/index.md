# UMI 机器人示教

人用手持夹爪把杯子放到杯碟上，采集时机械臂可以留在实验室。回到实验室，机器人面对位置不同的杯子，还要决定接近方向、何时合爪、从哪里松开。**Universal Manipulation Interface（UMI，通用操作接口）** 把这两个场景接起来。人和机器人从相近的腕部视角观察物体，用同一套末端位姿和开度描述操作。[UMI 项目与取放杯实验](https://umi-gripper.github.io/)

```{figure} figures/gripper.svg
:width: 100%
:alt: 俯视手持夹爪，相机朝向带视觉标记的平行夹指，工具中心点位于两指之间。

沿图找到相机、夹指和工具中心点，依次读出观测图像、夹爪开度和工作点的位姿。图中省略了侧镜和传动件，尺寸只用于说明关系。
```

## 从一次取杯示教读起

| 读到哪里 | 跟着做什么 |
| --- | --- |
| [夹爪与传感器](hardware.md) | 区分视频里可见的东西、传感器的读数和后处理估计量 |
| [从录像到训练样本](reconstruction.md) | 沿官方管线找到一次示教的位姿、开度、图像和有效时间段 |
| [相对动作与策略执行](policy.md) | 画出两步目标共用的参考系，判断哪些动作抵达控制器时已经过期 |
| [计算实验与故障定位](lab.md) | 复算一次旋转后的位移，给时间错配造成的空间误差定量 |

阅读需要长度、角度和速度的基本知识。初次接触坐标变换时，可以先读图和毫米例子，再回看矩阵。课程对应 Chi 等人在 RSS 2024 发表的原始 UMI。脚本和字段按上游提交 `d095ba9` 核对。图和数值练习均为本站绘制或设定。[论文](https://roboticsproceedings.org/rss20/p045.pdf) · [对应代码版本](https://github.com/real-stanford/universal_manipulation_interface/tree/d095ba9590df789df5189eea5ee7e431689038a6)

```{toctree}
:maxdepth: 1
:caption: 课程目录

hardware
reconstruction
policy
lab
```

```{raw} html
<p><a href="../ego/index.html">另一门课 · Ego 第一人称操作学习</a>　<a href="../index.html">机器人知识库</a></p>
```
