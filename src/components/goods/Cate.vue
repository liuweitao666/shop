<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户区域 -->
    <el-card>
      <!-- 添加商品按钮 -->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="showaddformdialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品展示表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        class="treetable"
        show-index
        :expand-type="false"
        :selection-type="false"
        index-text="#"
        border
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen;" v-if="scope.row.cat_deleted===false"></i>
          <i class="el-icon-error" style="color:red;" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addfromdialogVisible" width="50%" @close="closeaddcate">
        <el-form :model="addForm" :rules="addfromrules" ref="addcateForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
              <!-- 级联选择器 options 指定数据源 -->
              <!-- props 指定数据规则 -->
              <!-- change 监听更改数据的事件 -->
              <!-- v-model 双向绑定选中的数据 -->
            <el-cascader
              v-model="selectedkeys"
              :options="cateparentslist"
              :props="cascaderProps"
              @change="cateparentChange"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addfromdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "Cate",
  data() {
    return {
      // 保存商品分类的数据，默认为空
      catelist: [],
      queryinfo: {
        type: 3,
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      addfromdialogVisible: false,
      //  添加分类数据
      addForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      // 验证添加类别表单的规则   
      addfromrules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      cateparentslist: [],
      cascaderProps:{
          expandTrigger: 'hover',
          label:'cat_name',
          children:'children',
          value:'cat_id'
      },
      // 保存父级类别的id   
      selectedkeys:[]
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    async getCatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryinfo
      })
      if (res.meta.status !== 200) return this.$message.error("获取数据失败")
      console.log(res)
      this.catelist = res.data.result
      this.total = res.data.total
      //   console.log(this.catelist)
    },
    //修改每页显示多少条数据
    handleSizeChange(newpagesize) {
      console.log(newpagesize)
      this.queryinfo.pagesize = newpagesize
      this.getCatelist()
    },
    //进行翻页操作的方法
    handleCurrentChange(newpagenum) {
      this.queryinfo.pagenum = newpagenum
      this.getCatelist()
    },
    //点击出现添加分类弹框
    showaddformdialog() {
      // 先获取父级分类的数据
      this.getparentcatelist()
      // 展示对话框
      this.addfromdialogVisible = true
    },
    async getparentcatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      })

      this.cateparentslist = res.data
      console.log(this.cateparentslist)
    },
    cateparentChange(){
        // 判断selectedkeys的length是否大于0
        
    if(this.selectedkeys.length>0){
        // if大于0则把最后数组中的组后一项的值（id）赋值给addFrom.cat_pid，
        this.addForm.cat_pid = this.selectedkeys[this.selectedkeys.length-1] 
        this.addForm.cat_level = this.selectedkeys.length
        return
    }else{
        // 否则令addFrom中的数值为0 
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
    }
    },
    addCate(){
        this.$refs.addcateForm.validate(async (valid)=>{
            if(valid){
               const {data:res} =await this.$http.post('categories',this.addForm)
               if(res.meta.status!==201) return this.$message.error("创建分类失败")
               this.$message.success(res.meta.msg)
               this.getCatelist()
               this.addfromdialogVisible = false
            }
        })
        
    },
    closeaddcate(){
        this.selectedkeys = []
        this.$refs.addcateForm.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.treetable {
  margin: 15px 0;
}
.el-cascader{
    width:100%
}
</style>