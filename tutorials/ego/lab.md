---
file_format: mystnb
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---

# 计算实验与自测

下面用教学片段复算三种误差。单元仅依赖 Python 标准库，网页展示构建时的实际输出。示例不需要下载 Ego4D 视频，也不产生官方 benchmark 分数。先写下每个结果应使用的单位，再看代码。

## 选错了几帧

片段从来源视频第 900 帧开始。假设无重采样、恒定 30 帧/秒、片段从 0 编号，预测第 36 帧为 PNR，人工标注是片段第 30 帧。计算绝对时间误差前，先把两者放到同一时间基准。

```{code-cell} ipython3
from math import isclose, hypot

fps = 30
clip_origin = 900
reference_parent = 930
predicted_clip = 36
predicted_parent = clip_origin + predicted_clip
error_s = abs(predicted_parent - reference_parent) / fps
print(f"来源视频预测帧 = {predicted_parent}，时间误差 = {error_s:.2f} s")
assert predicted_parent == 936 and isclose(error_s, 0.2)
```

如果直接计算 `abs(36 - 930)`，得到的 29.8 s 甚至超过这个片段的长度。先核对 `parent`／`clip`，再检查帧率和裁剪。若是可变帧率，改用两帧各自的时间戳求差。[标注基准说明](https://ego4d-data.org/docs/data/annotations-schemas/)

## 区间重叠与关键帧误差

假设开盖动作被标成时间区间 [1.0, 2.0) s，模型给出 [1.2, 2.2) s。用**时间交并比**（temporal IoU，tIoU）评价区间，交集时长除以并集时长。它适用于有起止边界的区间，单个 PNR 帧仍按上一题的时间误差评价。

```{code-cell} ipython3
def temporal_iou(reference, prediction):
    start_a, end_a = reference
    start_b, end_b = prediction
    assert start_a < end_a and start_b < end_b
    overlap = max(0, min(end_a, end_b) - max(start_a, start_b))
    union = (end_a - start_a) + (end_b - start_b) - overlap
    return overlap / union

score = temporal_iou((1.0, 2.0), (1.2, 2.2))
print(f"时间交并比 = {score:.3f}")
assert isclose(score, 2 / 3)
assert temporal_iou((0, 1), (1, 2)) == 0
```

0.8 s 的重叠除以 1.2 s 的并集，得到约 0.667。即使预测区间包含正确的 PNR，预测边界过宽仍会降低 tIoU。

## 把三维指尖投回图像

使用已去畸变的教学针孔镜头。设焦距为 400 px，主点为 (320, 240) px，相机系下的指尖为 (0.10, 0.05, 0.50) m，对应人工二维标记为 (403, 284) px。计算预测像素以及它与人工标记的欧氏距离。

```{code-cell} ipython3
x, y, z = 0.10, 0.05, 0.50
assert z > 0
u, v = 400 * x / z + 320, 400 * y / z + 240
residual_px = hypot(u - 403, v - 284)
print(f"投影 = ({u:.0f}, {v:.0f}) px，重投影误差 = {residual_px:.1f} px")
assert (u, v) == (400, 280) and isclose(residual_px, 5)
```

把三维坐标全部乘 2，投影与残差仍相同。要区分这两种深度，需引入另一视角或独立深度测量。在真实 Aria 数据上使用对应镜头模型，并检查图像旋转、尺度与可见性。[官方相机投影示例](https://docs.ego-exo4d-data.org/tutorials/pose/)

**验收练习。** 将预测 PNR 改为片段第 24 帧。绝对误差仍为 0.20 s，但这次预测提前了。如果要分析模型总是提早还是落后，应额外保留带符号的误差（预测减标注）。再把第二题的预测区间改成 [2.1, 2.4) s，预期 tIoU 为 0。两项结果反映的是不同类型的失败。
