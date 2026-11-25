---
file_format: mystnb
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---

# 计算实验与故障定位

假设腕部已在桌面内转过 90°，相对工具“向前 20 mm”在世界系里指向哪里？先在纸上画出局部轴，再运行下面两个 Python 单元。它们只用标准库，网页中的输出由构建时执行生成。数据均为教学假设，长度用 mm，时间用 ms。

## 把目标移回世界坐标

在俯视平面里令世界 X 向右、Y 向上，正角逆时针。参考 TCP 位于 (300, 200)，其局部 x 轴与世界 X 轴夹角为 90°。两个目标在局部系内依次为 (20, 0) 和 (40, 0)，姿态不变。把位移先旋转到世界轴，再加上参考点位置。

```{code-cell} ipython3
from math import cos, sin, radians, dist

def world_target(origin_mm, yaw_deg, local_mm):
    angle = radians(yaw_deg)
    dx, dy = local_mm
    return (origin_mm[0] + cos(angle) * dx - sin(angle) * dy,
            origin_mm[1] + sin(angle) * dx + cos(angle) * dy)

origin = (300, 200)
targets = [world_target(origin, 90, (step, 0)) for step in (20, 40)]
for i, target in enumerate(targets, start=1):
    print(f"目标 {i} 的世界坐标 = ({target[0]:.0f}, {target[1]:.0f}) mm")
assert dist(targets[0], (300, 220)) < 1e-8
assert dist(targets[1], (300, 240)) < 1e-8
assert abs(dist(*targets) - 20) < 1e-8
```

如果第二个目标算成 (300, 260)，说明把 40 mm 又累加到了第一个目标上。如果得到 (340, 200)，则遗漏了参考系的旋转。两种错误在夹爪朝向恰好与世界坐标轴一致、或只检查第一步时都容易漏过。[相对轨迹原理](policy.md)

## 删去哪几个时间目标

沿用上一章的曝光、推理和执行时刻。为便于判断，假设延迟已知且固定，保守地只保留晚于最早响应时刻的动作。另设夹爪匀速运动，计算把错时的位姿配给图像时，沿运动方向会产生多大的偏差。

```{code-cell} ipython3
capture_ms, inference_done_ms, actuator_delay_ms = 1000, 1070, 25
earliest_ms = inference_done_ms + actuator_delay_ms
planned_ms = [capture_ms + offset for offset in (0, 50, 100, 150)]
usable_ms = [t for t in planned_ms if t > earliest_ms]

speed_mm_s, mismatch_ms = 250, 60
offset_mm = speed_mm_s * mismatch_ms / 1000
print(f"最早响应 {earliest_ms} ms，可用目标 {usable_ms} ms")
print(f"匀速 {speed_mm_s} mm/s，错时 {mismatch_ms} ms → 偏差 {offset_mm:.1f} mm")
assert usable_ms == [1100, 1150] and offset_mm == 15
```

把速度改为零，错时产生的平移偏差也会归零。因此只用静止画面对齐两个系统，容易遗漏动态任务中的错时。这里的 15 mm 来自匀速模型，实际动作还会包含加速、旋转和控制跟踪误差。[UMI 延迟匹配方法](https://umi-gripper.github.io/umi.pdf)

## 为什么夹得准，放杯却总偏

| 回放现象 | 优先检查的证据 | 区分原因的小实验 |
| --- | --- | --- |
| 转腕后偏差随朝向改变 | 相机到 TCP 的外参和矩阵方向 | 用夹爪绕固定尖点旋转，查看重建 TCP 是否也固定在该点 |
| 动得越快，杯沿与开度变化越不同步 | 图像曝光、状态时间、动作生效时间 | 用慢速和快速演示同一动作，比对偏差与速度是否近似成比例 |
| 一段示教中位姿突然跳变 | SLAM 跟踪状态、重定位前后参考系 | 回放跳变前后的静态背景，找出丢失或重定位区间 |
| 放杯位置正确，松手后仍滑落 | 合爪宽度、指垫与物体的接触画面 | 对照已知宽度物体，分别记录空夹、接触、抬升三个阶段 |

**验收练习。** 把第一题参考角改为 180°，再把时间错配改为 20 ms。先写预测，再修改代码与断言。两个世界目标应为 (280, 200)、(260, 200) mm，匀速偏差应为 5 mm。前一题检验坐标方向，后一题检验 ms 到 s 的换算。要核对真实记录，还需给出坐标系、时钟来源及误差范围。
