<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户区域 -->
    <el-card class="box-card">
      <el-row :gutter="15">
        <el-col :span="8">
          <div>
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryinfo.query"
              clearable
              @clear="getuserslist"
            >
              <el-button slot="append" icon="el-icon-search" @click="getuserslist"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据显示表格 -->
      <el-table :data="userslist" style="width: 100%" stripe border>
        <!-- <el-table-column prop="create_time" label="日期" ></el-table-column> -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="statechange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editUser(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeusers(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

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
      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="adddialogClosed">
        <!-- 表单消息填写区域 -->
        <div class="from">
          <el-form
            :model="addForm"
            :rules="rulesFrom"
            ref="addForm"
            label-width="75px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile" size="medium"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户的对话框 -->
      <el-dialog title="编辑用户" :visible.sync="editdialogVisible" width="50%" @close="resetedit">
        <!-- 表单消息填写区域 -->
        <div class="from">
          <el-form
            :model="editusers"
            :rules="rulesFrom"
            ref="editForm"
            label-width="75px"
            class="demo-ruleForm"
            
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editusers.username" size="medium" value="" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editusers.email" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="editusers.mobile" size="medium"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "users",
  data() {
    // 验证邮箱的规则
    var cheakemail = (rule,value,callback)=>{
      // 邮箱验证的正则
      const regemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.([a-zA-Z0-9_-])+/
      // console.log(regemail.test(value))
      if (regemail.test(value)) return callback()
      callback(new Error("请输入合法的邮箱"))
      };
      var checkmodile = (rule,value,callback)=>{
      // 邮箱手机的正则
      const regmodile = /^1(3|4|5|7|8)\d{9}$/
      // console.log(regmodile.test(value))
      if (regmodile.test(value)) return callback()
      callback(new Error("请输入合法的手机号"))
      };
    return {
      queryinfo: {
        query: "",
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2
      },
      userslist: [],
      total: 0,
      dialogVisible: false,
       // 添加表单的数据
      addForm:{
          username:'',
          password:'',
          email:'',
          mobile:'',
      },
      // 查询到的用户信息对象
      editusers:{},
      // 邮箱校验
      rulesFrom:{
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: cheakemail, trigger: 'blur'}
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkmodile, trigger: 'blur'}
          ],
      },
      editdialogVisible:false,
    }
  },
  created() {
    this.getuserslist()
  },
  methods: {
    //获取用户列表数据
    async getuserslist() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryinfo
      })
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败")
      // console.log(res)
      this.userslist = res.data.users
      this.total = res.data.total
    },
    //修改每页显示多少条数据
    handleSizeChange(newpagesize) {
      this.queryinfo.pagesize = newpagesize
      this.getuserslist()
    },
    //进行翻页操作的方法
    handleCurrentChange(newpagenum) {
      this.queryinfo.pagenum = newpagenum
      this.getuserslist()
    },
    //修改状态的方法
    async statechange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) return this.$message.error("更新状态失败")
      this.$message.success("更新状态成功")
    },
    adddialogClosed(){
      this.$refs.addForm.resetFields()
    },
    // 添加用户的前校验数据是否合法
    addUser(){
      this.$refs.addForm.validate(async valid=>{
      //  valid为true则数据合法
        if(valid){
          const {data:res} =await this.$http.post('users',this.addForm)
          if(res.meta.status !==201) return this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')
          // 隐藏添加用户的对话框
          this.dialogVisible = false
          // 重新获取用户的数据
          this.getuserslist()
        }
      })
      
    },
    async editUser(id){
      const {data:res} =await this.$http.get('users/'+id)
      if(res.meta.status !==200)return this.$message.error('查询用户失败')
      this.editusers = res.data
      this.editdialogVisible = true
    },
    editSubmit(){
      this.$refs.editForm.validate(async (valid)=>{
        // console.log(valid)
        if(!valid) return
        // 发送修改数据请求
        const {data:res}= await this.$http.put('users/'+this.editusers.id,{email:this.editusers.email,mobile:this.editusers.mobile})
        if(res.meta.status!==200) return this.$message.error("更新失败")
        
        // 隐藏弹出框
        this.editdialogVisible =false
        // 重新获取用户的数据
        this.getuserslist()
        // 提示修改成功
        this.$message.success(res.meta.msg)
      })
    },
    resetedit(){
      this.$refs.editForm.resetFields()
      // this.editdialogVisible = false
    },
    async removeusers(id){
      // 弹出删除确认提示框
      const confirmresult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)  // 抓取错误消息
        // console.log(confirmresult)
        // 点击cancel，判断返回的result值取消操作
      if(confirmresult=='cancel') return this.$message("已取消操作")
      // 通过调用API接口删除数据
      const {data:res} = await this.$http.delete('users/'+id)
      // 判断返回的状态码，不是200则删除失败
      if(res.meta.status !== 200) return this.$message.error("删除失败")
      this.$message.success("删除成功")
      // 重新获取用户的数据
      this.getuserslist()
    }
  }
}
</script>
<style lang="scss">
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-table {
  margin: 15px 0;
}
.from {
  width: 85%;
}
</style>