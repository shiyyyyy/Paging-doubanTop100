let app = new Vue({
    el: '#app',
    data: {
        // 总表
        items: [],
        // 每次显示的列表项目总数
        section: 9,
        // 点击的序列号
        count: 0,
        // 表示需要多少个分页符在初始化时候由init()产生 只多不少
        // 默认是10 等待后方数据修改
        pageCount: 10,
        // 确认是否需要给第二个分页之后加class
        ispreWait: false,
        // 确认是否需要给倒数第二个分页之后加class
        isnextWait: true,
        // 跳转页数
        confirmNumber: 1
    },
    created: function () {
        // 初始化
        this.init()
    },
    methods: {
        // 判断影片的index是否位于需要显示的区间 有的话 显示
        // 返回 true 或是 false 给v-if做判断
        judge: function (index) {
            let count = this.count
            let section = this.section
            return index >= count * section && index < (count + 1) * section
        },
        // 前面的按钮 点击减一
        calculateDown: function () {
            if (this.count <= 0) return
            this.count = this.count - 1
            this.confirmNumber = this.count + 1
        },
        // 后面的按钮 点击加一
        calculateUp: function () {
            // this.pageCount - 1 代表最后一页 0是 第一页
            if (this.count >= this.pageCount - 1) return
            this.count = this.count + 1
            this.confirmNumber = this.count + 1
        },
        // 点击每一个小的按钮
        pointClick: function (index) {
            this.count = index
            this.confirmNumber = index + 1
        },

        // 每一个分页标签监视此函数的执行
        // 此处的index记录的是真实的分页标签序号
        // index最小是0
        check: function (index) {

            // 下面2个判断与是否加上省略号有关
            // 初始条件下分页标签有7个紧挨着
            // 判断标签多余7个的时候 是否给2之后加上省略号
            if (this.count >= 5) { this.ispreWait = true } else { this.ispreWait = false }
            // 判断是否给最后标签加上省略号
            if (this.count >= this.pageCount - 3) { this.isnextWait = false } else { this.isnextWait = true }

            // 下面3个判断是对该函数执行结果的显式返回
            // 不管条件如何 第1,2个标签始终是显示的
            if (index === 0 || index === 1) { return true }

            // 点击1-5 前面的冒号都不会出现
            if (index <= 6 && this.count <= 4) {
                return true
            }
            // 分页够多的话 两个省略号之间是有5个分页的
            // 点击了index那么index之前两个 之后两个 都要显示
            if (index >= this.count - 2 && index <= this.count + 2) {
                return true
            }
        },
        // 点击了第一个分页符
        boBeFirst: function () {
            this.count = 0
            this.confirmNumber = 1
        },
        // 点击了最后一个分页符
        boBeLast: function () {
            this.count = this.pageCount - 1
            this.confirmNumber = this.pageCount
        },
        // 按输入的数字跳转执行的确认函数
        confirm: function () {
            // 获取输入框绑定的confirmNumber
            // 注意数据类型转换
            let getNumber = Number(this.confirmNumber)
            // 输入的数字必须是在下列范围是内
            if (getNumber >= 1 && getNumber <= this.pageCount) {
                this.count = getNumber - 1
            }
        },
        init: function () {

            let that = this
            JSONP.get('http://api.douban.com/v2/movie/top250?start=0&count=100', {}, function (response) {
                that.items = response.subjects
                if (that.items) {
                    getPageCount()
                }
            })
            // 产生分页符个数
            function getPageCount() {
                that.pageCount = Math.ceil(that.items.length / that.section)
            }
        }
    }
})