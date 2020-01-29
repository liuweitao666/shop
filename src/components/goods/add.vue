<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeindex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 导航区域 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeindex"
          :tab-position="'left'"
          :before-leave="beforeleaveTabs"
          @tab-click="tabClicked"
        >
          <!-- 商品基本信息 -->
          <el-tab-pane label="基本信息" name="0" class="basemsg">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cascaderProps"
                @change="cateChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数区域 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in paramslist" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals" @change="Tagchange(item)">
                <el-checkbox
                  :label="vals"
                  border
                  size="medium"
                  v-for="(vals,i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性区域 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlytable" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="Uploadurl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerobj"
              :on-success="handlesuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-dialog title="图片预览" :visible.sync="dialogimgVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="addForm.goods_introduce"
              ref="myQuillEditor"
            ></quill-editor>
            <el-button type="primary" class="btnadd" @click="Add">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  
  name: "add",
  data() {
    return {
      activeindex: "0",
      // 商品基本信息数据
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce:'',
        attr:[]
      },
      // 商品基本信息验证规则
      addFormrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [{ required: true, message: "不能为空", trigger: "blur" }],
        goods_weight: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        goods_cat: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ]
      },
      // 商品分类数据
      catelist: [],
      // 级联选择器的规则
      cascaderProps: {
        value: "cat_id",
        expandTrigger: "hover",
        children: "children",
        label: "cat_name"
      },
      // 动态参数的列表
      paramslist: [],
      // 商品属性列表
      onlytable: [],
      // 上传图片的url地址
      Uploadurl: "https://www.liulongbin.top:8888/api/private/v1/upload",
      // 上传图片的请求头
      headerobj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      dialogimgVisible: false,
      dialogImageUrl: ""
    }
  },
  created() {
    // 获取分类的数据
    this.getCatelist()
  },
  methods: {
    // 获取分类数据的方法
    async getCatelist() {
      const { data: res } = await this.$http.get("categories")
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据失败")
      this.catelist = res.data
    },
    // 监听商品分类数据的改变
    cateChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 点击标签页跳转之前
    beforeleaveTabs(activeName, oldActiveName) {
      if (oldActiveName == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类")
        return false
      }
    },
    // tabs的点击事件
    tabClicked() {
      //  获取商品参数的数据
      if (this.activeindex === "1") {
        this.getparams()
        console.log(this.paramslist)
      } else if (this.activeindex === "2") {
        this.getManual()
      }
    },
    // 获取参数列表的请求
    async getparams() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateid}/attributes`,
        {
          params: { sel: "many" }
        }
      )
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败")
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
      })
      this.paramslist = res.data
    },
    // 获取属性的方法请求
    async getManual() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateid}/attributes`,
        {
          params: { sel: "only" }
        }
      )
      if (res.meta.status !== 200)
        return this.$message.error("获取属性列表失败")

      this.onlytable = res.data
      console.log(this.onlytable)
    },
    // 删除参数的方法
    async Attrvalues(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateid}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      )
      if (res.meta.status !== 200) return this.$message.error("添加失败")
      this.$message.success(res.meta.msg)
    },
    // 监听参数值的改变
    Tagchange(row) {
      this.Attrvalues(row)
    },
    // 图片预览的业务逻辑
    handlePreview(file) {
      console.log(file)
      this.dialogImageUrl = file.response.data.url
      this.dialogimgVisible = true
    },
    // 移除图片的事件
    handleRemove(file) {
      // 获取将要删除图片的临时路径
      const path = file.response.data.tmp_path
      // 从数组中找到对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pcs === path)
      // 用splice方法删除数组pcs中对应的地址
      this.addForm.pics.splice(i, 1)
    },
    // 上传图片成功的方法
    handlesuccess(response) {
      this.$message.success(response.meta.msg)
      this.addForm.pics.push(response.data)
      // console.log(this.addForm)
    },
    Add(){
      this.$refs.addFormref.validate(async valid=>{
        if(!valid){
          return this.$message.error('请输入合法的数据')
        }
       const from =  _.cloneDeep(this.addForm)
       from.goods_cat = from.goods_cat.join(',') 
       this.paramslist.forEach(item=>{
         const newinfo ={
           attr_id :item.attr_id,
           attr_value:item.attr_vals.join(' ')
         }
         from.attr.push(newinfo)
       })
       this.onlytable.forEach(item=>{
         const newonly = {
           attr_id : item.attr_id,
           attr_value : item.attr_vals
         }
         from.attr.push(newonly)
       })
       
       
       const {data:res} = await this.$http.post('goods',from)
       console.log(from,res)
       if(res.meta.status!==201) return this.$message.error(res.meta.msg)
       this.$message.success(res.meta.msg)
       this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateid() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.params {
  margin-bottom: 15px;
}
.el-checkbox {
  margin: 5px;
}
.btnadd{
  margin:15px 0; 
}
</style>