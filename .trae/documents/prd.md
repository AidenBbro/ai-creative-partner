## 1. Product Overview
MTC模式 vs Code模式 对比展示PPT - 一个精美的单页网页式PPT，用于直观对比两种工作模式的特点。
- 主要目的：清晰展示MTC模式和Code模式的差异，帮助用户选择合适的工作模式
- 目标用户：需要了解不同工作模式的团队成员和决策者

## 2. Core Features

### 2.1 Feature Module
1. **封面页**: 主标题、副标题、装饰元素
2. **对比详情页**: 两栏布局，并列展示MTC模式和Code模式的四个维度对比
3. **结尾页**: 总结语、行动号召

### 2.3 Page Details
| Page Name | Module Name | Feature description |
|-----------|-------------|---------------------|
| 封面页 | Hero section | 渐变背景、居中标题、副标题、底部信息 |
| 对比详情页 | Two-column layout | 左右两栏各展示一个模式，包含定位、权限、核心能力、终端支持 |
| 结尾页 | Closing section | 感谢语、装饰元素、补充说明 |

## 3. Core Process
用户打开网页 → 查看封面页 → 点击"下一页"或滑动查看对比详情页 → 查看结尾页 → 可以点击"上一页"返回

```mermaid
flowchart LR
    A[封面页] --> B[对比详情页]
    B --> C[结尾页]
    C --> B
    B --> A
```

## 4. User Interface Design
### 4.1 Design Style
- Primary color: 深蓝色 (rgb(30, 60, 114))
- Secondary color: 亮蓝色 (rgb(59, 130, 246))
- Background: 渐变背景 (linear-gradient(135deg,rgba(15,23,42,1) 0%,rgba(56,97,140,1) 100%))
- Layout style: 全屏卡片式布局，居中对齐
- Font: 现代无衬线字体，大标题用大号粗体，正文清晰易读
- Animation: 页面切换动画、元素入场动画

### 4.2 Page Design Overview
| Page Name | Module Name | UI Elements |
|-----------|-------------|-------------|
| 封面页 | Hero section | 渐变背景、大标题 (44px)、副标题 (20px)、装饰线条 |
| 对比详情页 | Two-column layout | 浅灰背景、两栏卡片、标题、要点列表、图标 |
| 结尾页 | Closing section | 渐变背景、感谢语、装饰线条、补充说明 |

### 4.3 Responsiveness
- Desktop-first, 支持响应式布局
- 移动端自动调整为单列布局
