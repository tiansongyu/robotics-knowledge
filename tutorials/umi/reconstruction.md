# 从录像到训练样本

要教机器人把杯子放回碟上，训练样本需要把某一时刻的图像与随后夹爪的运动配对。示教设备没有机械臂编码器。采集端用视频和惯性测量估计相机相对场景的轨迹，再把相机轨迹换到工具中心点。[官方数据处理入口](https://github.com/real-stanford/universal_manipulation_interface/blob/d095ba9590df789df5189eea5ee7e431689038a6/run_slam_pipeline.py)

```{mermaid}
:alt: 建图录像产生场景地图，示教录像与惯性数据产生相机轨迹，指上标记独立产生开度，最后与视频帧合成示教回合。
flowchart TD
  M[场景建图录像] --> A[共享场景地图]
  V[示教录像与 IMU] --> P[相机定位]
  A --> P
  P --> T[TCP 轨迹]
  V --> F[指上标记与开度标定]
  T --> E[选择共同有效的时间段]
  F --> E
  E --> D[图像、末端位姿与开度]
```

## 先建图，再定位

**同步定位与建图**（SLAM）同时估计传感器轨迹和可重复识别的环境特征。UMI 先拍场景建图序列，在含有足够静态纹理、视角变化的片段中建立地图。随后各段示教在同一地图里定位。双手示教时，两条轨迹因此有共同的空间参考，可以求一只手相对于另一只手的位置。[原论文，HD4 与 PD2.3](https://roboticsproceedings.org/rss20/p045.pdf)

图像提供跨帧特征约束，IMU 提供短时间运动约束，并在合适的运动激励下帮助恢复公制尺度。快速挥动时画面可能模糊，长时间只看到无纹理桌面也可能丢失跟踪。若地图只覆盖桌面左侧，示教从右侧起步就可能无法重定位。用已经建立的地图回放一遍，检查轨迹覆盖范围比只看录像是否流畅更直接。[UMI SLAM 实现与示例说明](https://github.com/real-stanford/universal_manipulation_interface/blob/d095ba9590df789df5189eea5ee7e431689038a6/README.md)

## 把相机轨迹移到夹指之间

以 $^{A}T_B$ 表示把 B 系坐标变换到 A 系的刚体变换。设 W 是选定的场景参考系，C 是相机，E 是 TCP。定位给出 $^{W}T_C(t)$，机械安装给出 $^{C}T_E$。工具轨迹为

$$
{}^{W}T_E(t) = {}^{W}T_C(t)\,{}^{C}T_E .
$$

读乘法顺序时，从最右侧的 E 往左追到 W。若 TCP 位于相机前方 100 mm，相机转动时这段偏距也随之转动。直接给世界坐标某一轴加上 100 mm，会把工具点固定在错误的方向上。官方数据计划脚本先将相机位姿换到标记参考系，再右乘 `tx_cam_tcp`。[数据计划中的变换](https://github.com/real-stanford/universal_manipulation_interface/blob/d095ba9590df789df5189eea5ee7e431689038a6/scripts_slam_pipeline/06_generate_dataset_plan.py)

## 跟读官方示例

下面两条命令在**上游 UMI 仓库**根目录执行。需要先按该版本 README 配好 UMI 的 Python 环境和容器，并解压官方 `example_demo_session`。只阅读本教程或运行末章的计算实验，用本站环境即可。[上游安装与示例数据](https://github.com/real-stanford/universal_manipulation_interface/blob/d095ba9590df789df5189eea5ee7e431689038a6/README.md)

```bash
python run_slam_pipeline.py example_demo_session
python scripts_slam_pipeline/07_generate_replay_buffer.py \
  -o example_demo_session/dataset.zarr.zip example_demo_session
```

1. 在建图目录找 `map_atlas.osa`。这说明建图阶段写出了地图。接着看示教段的跟踪状态，确认有效轨迹覆盖“接近、合拢、提起、放下”的区间。
2. 查看 `dataset_plan.pkl` 对应的生成日志。**回合**（episode）是一段时间连续的示教。生成计划时，脚本检查跟踪状态、相机时间重叠和有效区段，为保留的回合配对帧与状态。
3. 第二条命令按计划将数组打包为 Zarr 存储。对单臂样本，可沿公共帧索引查看下表。训练加载器再按回合边界选出历史与未来窗口，窗口不可跨过两次独立示教的分界。[打包脚本](https://github.com/real-stanford/universal_manipulation_interface/blob/d095ba9590df789df5189eea5ee7e431689038a6/scripts_slam_pipeline/07_generate_replay_buffer.py) · [训练数据集实现](https://github.com/real-stanford/universal_manipulation_interface/blob/d095ba9590df789df5189eea5ee7e431689038a6/diffusion_policy/dataset/umi_dataset.py)

| 数组名 | 每个时刻的内容 | 回放时检查 |
| --- | --- | --- |
| `camera0_rgb` | 腕部彩色图像 | 杯沿是否在闭合前进入两指之间 |
| `robot0_eef_pos` | 三维末端位置，m | 提起杯子时，沿场景竖直方向是否有位移 |
| `robot0_eef_rot_axis_angle` | 三分量旋转向量，模长为转角，rad | 转动方向和画面是否相符 |
| `robot0_gripper_width` | 夹爪开度，m | 闭合时开度是否减小，是否出现长段缺测 |

**自查。** 两只夹爪各自重建了平滑轨迹。能直接把左右坐标相减吗？先核对两条轨迹的时间和参考系。独立建立的地图可以有不同的原点和轴向。同一信号在两个时刻也可能取不同值。统一地图和时间后，才能计算有物理意义的相对位姿。
