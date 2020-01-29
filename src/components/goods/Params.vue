<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 警告提示框 -->
    <el-card>
      <el-alert title="注意：只允许为第三级的分类设置参数" type="warning" show-icon></el-alert>
      <!-- 选择分类部分 -->
      <el-row class="selectedcate">
        <el-col>
          <span>选择分类：</span>
          <el-cascader
            v-model="selectedkeys"
            :options="catelist"
            :props="cascaderProps"
            @change="cateChange"
            clearable
            size="small"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 选择配置参数 -->
      <el-tabs v-model="tabsactiveName" @tab-click="handletabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数的面板 -->
          <el-button type="primary" size="small" :disabled="isopt" @click="addattribute">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="Catemanytable" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleclose(i,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="showeditdialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="removeparams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的面板 -->
          <el-button type="primary" size="small" :disabled="isopt" @click="addattribute">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="Cateonlytable" border>
            <el-table-column type="expand" closable>
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleclose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="showeditdialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="removeparams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加属性对话框 -->
      <el-dialog
        :title="addattr"
        :visible.sync="addattributedialog"
        width="50%"
        @close="adddialogclose"
      >
        <el-form :model="addatrForm" ref="addatrForm" label-width="100px" :rules="addatrrules">
          <el-form-item :label="attrname" prop="attr_name">
            <el-input v-model="addatrForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addattributedialog = false">取 消</el-button>
          <el-button type="primary" @click="addparams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑属性的对话框 -->
      <el-dialog
        :title="editattr"
        :visible.sync="editattributedialog"
        width="50%"
        @close="editdialogclose"
      >
        <el-form :model="editatrForm" ref="editatrForm" label-width="100px" :rules="addatrrules">
          <el-form-item :label="editattr" prop="attr_name">
            <el-input v-model="editatrForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editattributedialog = false">取 消</el-button>
          <el-button type="primary" @click="editparams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "params",
  data() {
    return {
      tabsactiveName: "many",
      selectedkeys: [],
      catelist: [],
      //   联级菜单的数据规则
      cascaderProps: {
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        value: "cat_id",
      },
      isopt: true,
      //   保存动态参数的id值
      Catemanytable: [],
      //   保存静态属性的id值
      Cateonlytable: [],
      // 控制添加属性对话框的显示和隐藏
      addattributedialog: false,
      //   保存添加表单的属性名
      addatrForm: {
        attr_name: ""
      },
      // 添加表单的验证规则
      addatrrules: {
        attr_name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ]
      },
      // 控制编辑对话框的显示与隐藏
      editattributedialog: false,
      editatrForm: {
        attr_name: ""
      }
    }
  },
  computed: {
    cateid() {
      if (this.selectedkeys.length === 3) {
        return this.selectedkeys[2]
      }
      return null
    },
    attrname() {
      if (this.tabsactiveName === "many") {
        return "参数名称"
      } else {
        return "属性名称"
      }
    },
    addattr() {
      if (this.tabsactiveName === "many") {
        return "添加参数"
      } else {
        return "添加属性"
      }
    },
    editattr() {
      if (this.tabsactiveName === "many") {
        return "动态参数"
      } else {
        return "静态属性"
      }
    }
  },
  created() {
    this.gecatelist()
  },
  methods: {
    async gecatelist() {
      // 发送分类数据网络请求
      const { data: res } = await this.$http.get("categories", { type: 3 })
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据失败")
      this.catelist = res.data
    },
    handletabClick() {
      // 点击tabs按钮发送数据请求
      if (this.selectedkeys.length === 0) {
        console.log(this.selectedkeys)
        return this.$message.warning("请选择分类")
      }
      this.getCateattribute()
    },
    // 监听联级菜单数据的变化
    cateChange() {
      if (this.selectedkeys.length !== 3) {
        this.selectedkeys = []
        this.Catemanytable =[]
        this.Cateonlytable=[]
        this.isopt = true
        // console.log(this.cateid)
        return
      }

      this.isopt = false
      this.getCateattribute()
    },
    // 获取参数属性的方法
    async getCateattribute() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateid}/attributes`,
        {
          params: { sel: this.tabsactiveName }
        }
      )
      // console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error("获取参数数据失败")

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
        // 控制添加tag标签和input的切换显示
        item.inputVisible = false
        // 保存taginput的值
        item.inputValue = ""
      })
      console.log(res.data)
      if (this.tabsactiveName === "many") {
        this.Catemanytable = res.data
      } else {
        this.Cateonlytable = res.data
      }
    },
    // 点击弹出添加属性和参数对话框
    addattribute() {
      this.addattributedialog = true
    },
    // 监听添加属性对话框关闭事件
    adddialogclose() {
      this.$refs.addatrForm.resetFields()
    },
    // 添加参数的事件
    addparams() {
      this.$refs.addatrForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `categories/${this.cateid}/attributes`,
            {
              attr_name: this.addatrForm.attr_name,
              attr_sel: this.tabsactiveName
            }
          )
          if (res.meta.status !== 201)
            return this.$message.error("添加参数失败")
          this.$message.success("添加参数属性成功")
          this.getCateattribute()
          this.addattributedialog = false
        }
      })
    },
    // 控制编辑的对话框
    async showeditdialog(attr_id) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cateid}/attributes/${attr_id}`,
        { params: { attr_sel: this.tabsactiveName } }
      )
      if (res.meta.status !== 200) return this.$message.error("获取数据失败")
      // 给通过id获取数据并赋值
      this.editatrForm = res.data
      this.editattributedialog = true
    },
    editdialogclose() {
      this.$refs.editatrForm.resetFields()
    },
    // 点击确定编辑数据
    editparams() {
      this.$refs.editatrForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `categories/${this.cateid}/attributes/${this.editatrForm.attr_id}`,
            {
              attr_name: this.editatrForm.attr_name,
              attr_sel: this.tabsactiveName
            }
          )
          if (res.meta.status != 200) {
            return this.$message.error("修改数据失败")
          }
          this.$message.success(res.meta.msg)
          this.getCateattribute()
          this.editattributedialog = false
        }
      })
    },
    // 删除参数的点击事件
    async removeparams(attr_id) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err)
      if (confirmresult !== "confirm") {
        return this.$message("已取消删除")
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateid}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) return this.$message.error("删除失败")
      this.$message.success(res.meta.msg)
      this.getCateattribute()
    },
    getAttrvalues(attr_id) {
      console.log(attr_id)
    },
    async handleInputConfirm(row) {
   
      // 判断数据是否为空，trim()方法取出字符串两端的空格
      if (row.inputValue.trim().length===0) {
        row.inputValue = ""
        row.inputVisible = false
        return
      }
      // 如果属于的内容合法在执行后续业务逻辑
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ""
      // 发送请求添加attr_vals
      this.Attrvalues(row)
    },
    // 点击按钮展示文本输入框
    // $nextTick方法，当页面上的元素重新渲染之后，才调用回调函数
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleclose(i,row){
      row.attr_vals.splice(i,1)
      this.Attrvalues(row)
    },
    // 修改attr_vals的数据请求
    async Attrvalues(row){
        const {data:res} = await this.$http.put(`categories/${this.cateid}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status!==200) return this.$message.error("添加失败")
      this.$message.success(res.meta.msg)
      row.inputVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.selectedcate {
  margin: 15px 0;
}
.input-new-tag {
  width: 120px;
}
</style>