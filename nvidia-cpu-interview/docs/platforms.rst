Tegra、Vera 与产品场景
==========================================

正式职位把 Tegra / Vera 都列为诊断软件服务的平台。准备时，用 Jetson Linux 的公开资料练习 Tegra 侧的板级问题，用 Vera 架构资料练习服务器侧的 CPU、内存和 I/O 问题。具体产品分工、内部诊断环境以及个人能接触的板卡，需要在约谈中确认。 `NVIDIA 岗位说明 <https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/China-Shenzhen/Senior-System-Software-Engineer--CPU_JR2025929>`_

Tegra 方向：一块板如何开始工作
-------------------------------------------

以公开的 Jetson bring-up 指南为材料，顺着电源、复位、启动固件、内核、设备树和驱动绑定梳理启动路径。任选一个你熟悉的外设，说明引脚复用、总线枚举、时钟和电源域哪一步失败会产生什么可见现象。例如 I²C 上读不到器件 ID，可以先核对板级供电与复位释放，再看 pinmux、时钟、地址以及总线是否实际获得应答。Jetson 在这里是公开练习平台，车载产品细节应结合相应硬件资料。 `Jetson 模组适配与板级启动 <https://docs.nvidia.com/jetson/archives/r36.4/DeveloperGuide/HR/JetsonModuleAdaptationAndBringUp.html>`_ · `Jetson 时钟管理 <https://docs.nvidia.com/jetson/archives/r36.5/DeveloperGuide/SD/Clocks.html>`_

**自测：机器人冷启动偶尔看不到传感器，重启应用却能恢复。先取什么证据？** 同时保存成功和失败启动中供电就绪、复位、总线应答、驱动 probe 与应用首次访问的顺序。分别延后首次应用访问、检查驱动就绪通知，区分启动依赖与真实链路故障。能给出自己实际接触的板型、接口和观测工具，就是可用的项目材料。

Vera 方向：服务器 CPU 如何定位局部故障
----------------------------------------------

Vera 是 NVIDIA 的 Arm 兼容数据中心 CPU。Vera Rubin 平台可通过 NVLink-C2C 连接 CPU 与 GPU。先能说明核、缓存、内存、PCIe 设备以及一致性互连的位置，再挑一个数据错误或性能退化的例子，解释如何隔离故障域。 `NVIDIA Vera 与 Vera Rubin 平台指南 <https://docs.nvidia.com/dccpu/vera-perf-tuning-guide/vera-cpu-and-superchip.html>`_

**自测：压力测试偶发数据不符，你如何判断是否集中在某个核、内存区域或 I/O 路径？** 固定数据模式、软件与固件版本，逐次改变核绑定、内存分配位置和 I/O 参与情况，记录错误是否跟随某个变量。有 RAS（可靠性、可用性、可维护性）遥测时，关联可纠正或不可纠正错误、位置和时间。错误计数可以缩小范围，硬件归因还需要对照证据。 `Linux RAS 与错误分类 <https://docs.kernel.org/admin-guide/RAS/main.html>`_

两个方向如何分配时间
-------------------------------------------

* **两边都准备。** CPU 与设备地址、缓存与并发、可重复测试、软硬件责任边界、日志与版本、错误恢复。
* **偏车载时深入。** 在已有项目里找一次启动、传感器、功耗状态切换或时延抖动的问题。讲清最差时延怎么测，测试覆盖哪些运行状态。
* **偏数据中心时深入。** 准备多核和内存压力测试，理解拓扑、PCIe、RAS 与长稳测试。若团队负责 CPU 与加速器互连，再扩展到一致性互连和数据传输的诊断。
* **技术面的取舍。** 招聘说明没有指定 CUDA、ROS、某个车规标准或特定实验室工具的熟练程度。你熟悉这些领域时，用它们解释真实问题。把准备时间优先留给系统代码、硬件接口和定位证据。
