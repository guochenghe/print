

# 解答题区域缩放情况
#### 向下拉升的情况 ===>> 当前需要缩放的模块是否拉到当前分页底部
1. 还没有滚动到底部
    - 后面是否有模块超出
        * 没有
        * 有模块超出的时候，超出的模块新开一页
        * ==>>继续递归判断新开的一页是否有模块超出
2. 滚动到了底部
    - 直接鼠标自动弹起，在下一页新建固定高度的模块为当前模块补充超出的部分（当前部分需要有**删除按钮**），其余后面的模块依次依序的排到后面，当前鼠标控制缩放的模块隐藏缩放按钮，其补充部分可以缩放
        * 如果此时所需补充的模块，上面还有模块可以缩放的话，向上拉升，补充模块消失，所需补充的模块显示缩放按钮，如果向上拉升的足够多的话，下面的模块依次上去，不存在补充模块
        ===>>然后依次递归判断后续模块是否有模块超出
        * 点击补充部分的缩放按钮，当前补充模块删除，所需要补充的模块，显示缩放按钮
    - ==>>继续递归判断新开的一页是否有模块超出
#### 向上缩放的情况
1. 
### 一个大题里面多个小题
    
