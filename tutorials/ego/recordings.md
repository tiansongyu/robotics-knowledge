# 选择视角与数据单元

回放开盒视频，如果画面中盒子整体向左移，可能是盒子在桌上滑动，也可能是佩戴者向右转头。相机自身的运动称为**自运动**（ego-motion）。判断物体是否移动时，可以看盖相对盒身的运动，再看盒身相对桌面的运动。只凭一个像素的位移，很难把这三层运动分开。

## Ego4D 和 Ego-Exo4D 各提供什么

| 问题 | 可选资料 | 从哪里找证据 |
| --- | --- | --- |
| “手碰过什么，哪个物体改变了状态？” | Ego4D 的 Forecasting + Hands & Objects（FHO）标注 | 找发生变化的物体、关键帧和对应的框 |
| “同一动作从外面看是什么样？” | Ego-Exo4D 同一次 take 的佩戴者与外部相机录像 | 找时间对齐的视频流，在相同的 take 帧号查看两个视角 |
| “手指在三维空间哪里？” | 含 EgoPose 手姿标注的 Ego-Exo4D 样本 | 找所需时刻的三维关节、相机标定、视角和可见性 |

两者是分别采集的数据集。此处用同一个开盒教学案例比较任务，不存在跨这两个数据集通用的片段编号。Ego4D 内也要按任务选择标注子集，不能假定每个视频都有手框或关键帧。[Ego4D 标注指南](https://ego4d-data.org/docs/data/annotation-guidelines/) · [Ego-Exo4D 数据与标注](https://docs.ego-exo4d-data.org/overview/)

## 在 Ego4D 中定位一个标注

`video_uid` 标识来源视频，`clip_uid` 标识从视频中剪出的片段。任务标注还能引用片段内更小的动作区间。拿到帧号，要先读字段说明，区分相对于来源视频、标准片段还是任务样本。以状态变化任务为例，`parent_pnr_frame` 和 `clip_pnr_frame` 都描述状态变化的关键帧，使用的时间原点不同。[Ego4D 任务标注 Schema](https://ego4d-data.org/docs/data/annotations-schemas/)

教学设定中，一个等帧率片段直接从来源视频第 900 帧开始裁剪，首帧编号为 0，没有重采样。片段第 30 帧对应来源第 930 帧。若打开原视频却跳到第 30 帧，看到的会是另一段内容。实际文件若经过抽帧、重新编码或裁掉开头，要按该数据产品的时间映射找帧。可变帧率视频需读取显示时间戳（PTS）。

## 在 Ego-Exo4D 中成对打开视频

1. 在 `takes.json` 找一次 **take**（一段任务执行），记录其 `take_uid`、`take_name` 和所属 **capture**（一次连续录制）。一个 capture 可以切出多个 take。
2. 读该 take 的 `frame_aligned_videos`，选 Aria 的 `rgb` 流和一部外部相机的 RGB 流，通过各自 `relative_path` 找 MP4。官方对齐版视频的第 $i$ 帧对应同一 take 时刻，原始传感器视频有各自的帧号。
3. 如果还要取 Aria 设备姿态，按 take 的时间范围在 capture 的 `timesync.csv` 查到对应设备采集时间，再查相应轨迹。检查元数据是否提供轨迹及所需标注。图像对齐说明了帧之间的对应关系，物理曝光仍有测量误差。[Takes 与时间同步](https://docs.ego-exo4d-data.org/data/takes/) · [元数据字段](https://docs.ego-exo4d-data.org/data/metadata/) · [MPS 轨迹与标定](https://docs.ego-exo4d-data.org/data/mps/)

**动手读一个真实例子。** 打开官方姿态教程，搜索 `cmu_bike01_5`。找到选择 take 的代码、读取时间戳的代码和绘制关键点的结果图。观察示例如何从 `take_name` 找文件，再沿 `take_uid` 关联姿态标注。若以裁剪后的视频第 0 帧直接查询整段 capture 的第 0 条轨迹，就会把两种时间起点混用。[官方手姿投影教程](https://docs.ego-exo4d-data.org/tutorials/pose/)

**自查。** 给同一 take 的两个原始视频分别每隔十帧取一张图，就能做跨视角配对吗？应先确定时间基准和采样率。即使两路名义帧率相同，启动时刻或丢帧情况也可能不同。优先用官方对齐视频，或根据同步记录配对。
