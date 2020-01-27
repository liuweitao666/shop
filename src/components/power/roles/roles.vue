<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card包含区域 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-col class="addAvotar">
        <el-row>
          <el-button type="primary">添加角色</el-button>
        </el-row>
      </el-col>
      <!-- 角色表格区域 -->
      <el-table :data="roleslist" style="width: 100%" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand" closable>
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              class="bdbottom venter"
              :class="i1 === 0? 'bdtop':'bdbottom'"
              v-for="(item,i1) in scope.row.children"
              :key="item.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightByid(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row v-for="(item2,i2) in item.children" :key="item2.id" class="venter">
                  <el-col :span="6" :class="i2===0?'':'bdtop'">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightByid(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13" :class="i2===0?'':'bdtop'">
                    <!-- 三级权限 -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightByid(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editroles(scope.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeroles(scope.row.id)"
            >删除</el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showrightsdialogs(scope.row)"
              >分配权限</el-button>
            </el-tooltip>
            <!-- 分配权限对话框 -->
            <el-dialog title="权限分配" :visible.sync="showrightsdialog" width="35%" @close="shutdialog">
              <el-tree
                :data="rightslist"
                show-checkbox
                node-key="id"
                :default-checked-keys="defkeys"
                :props="trueProps"
                default-expand-all
                ref="treeref"
              ></el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="shutdialog">取 消</el-button>
                <el-button type="primary" @click="settreelist">确 定</el-button>
              </span>
            </el-dialog>
          </template>

          <!-- <el-button type="danger" plain>危险按钮</el-button> -->
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "roles",
  data() {
    return {
      roleslist: [],
      rightslist: [],
      trueProps:{
          children:'children',
          label:'authName'
      },
      showrightsdialog: false,
      defkeys:[],
      rolesid:''
    }
  },
  created() {
    //   发送数据请求
    this.getRoleslist()
  },
  methods: {
    //   获取角色列表
    async getRoleslist() {
      const { data: res } = await this.$http.get("/roles")
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败")
      //  把获取到的数据赋值给组件私有数组保存
      this.roleslist = res.data
      console.log( this.roleslist)
    },
    editroles() {},
    removeroles() {},
    async removeRightByid(role, rightid) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err) // 抓取错误消息
      // console.log(confirmresult)
      // 点击cancel，判断返回的result值取消操作
      if (confirmresult == "cancel") return this.$message("已取消操作")
      //   console.log("删除成功")id
      //   // 通过调用API接口删除数据
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      )
      //   // 判断返回的状态码，不是200则删除失败
      if (res.meta.status !== 200) return this.$message.error("删除失败")
      this.$message.success("删除成功")
      //   重新发送数据请求
      role.children = res.data
    },
    // 点击展示权限列表对话框
    async showrightsdialogs(role) {
      this.rolesid = role.id  
      this.showrightsdialog = true
      // 发送API接口获取权限数据
      const { data: res } = await this.$http.get("/rights/tree")
      if (res.meta.status !== 200) return this.$message.error("获取数据失败")
      // 调用获取id的方法
      this.getrolesid(role,this.defkeys)
      this.rightslist = res.data
    },
    getrolesid(node,arr){
        // 如果node节点中不包含children,则向数组中添加id值
        if(!node.children) return arr.push(node.id)
        node.children.forEach(element => {
            this.getrolesid(element,arr)
        });
    },
    shutdialog(){
        this.showrightsdialog = false
        this.defkeys = []
    },
    async settreelist(){
       //    获取想要修改权限的id值
       const keys = [...this.$refs.treeref.getCheckedKeys(),...this.$refs.treeref.getHalfCheckedKeys()]
       //    根据API文档的要求,把数组对象变成字符串对象  
       const keystr = keys.join(',')
       //    发送请求,修改权限
       const {data:res} = await this.$http.post(`/roles/${this.rolesid}/rights`,{rids:keystr})
       //    判断是否修改失败
       if(res.meta.status!==200) return this.$message.error("修改权限失败")
       //    提示用户修改成功
       this.$message.success("修改权限成功")
       //    关闭对话框
       this.showrightsdialog = false
       //    修改成功重新获取权限列表
       this.getRoleslist()
    },
    
  }
}
</script>
<style lang="scss">
.addAvotar {
  margin-bottom: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: solid 1px #eeeeee;
}
.bdbottom {
  border-bottom: solid 1px #eeeeee;
}
.venter {
  display: flex;
  align-items: center;
}
</style>