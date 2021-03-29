<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" prop="code" label="标识" />
        <el-table-column align="center" prop="description" label="描述" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <!-- 只有当type的值为1的时候才是访问权限,才可以添加 -->
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(2, row.id)"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑弹框 -->
    <el-dialog :visible="showDialog" :title="showText" @close="btnCancel">
      <el-form
        ref="permForm"
        :model="formData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="企业可见">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <!-- <el-form-item label="菜单顺序">
          <el-input style="width:90%" />
        </el-form-item>
        <el-form-item label="菜单icon">
          <el-input style="width:90%" />
        </el-form-item> -->
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-button size="small" @click="btnCancel">取 消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确 定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  updatePermission,
  addPermission,
  getPermissionDetail,
  delPermission,
  getPermissionList
} from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '添加权限'
    }
  },
  watch: {},
  created() {
    this.getPermissionList() // 获取所有权限点
  },
  mounted() {},
  methods: {
    // 获取权限列表
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    // 删除权限
    delPermission(id) {
      this.$confirm('确定删除吗?')
        .then(() => {
          return delPermission(id)
        })
        .then(() => {
          this.$message.success('删除成功!')
          this.getPermissionList()
        })
        .catch(() => {})
    },
    // 添加权限
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 确定添加或者修改
    btnOK() {
      this.$refs.permForm
        .validate()
        .then(() => {
          // 校验成功
          if (this.formData.id) {
            // 有id=>修改
            return updatePermission(this.formData)
          }
          // 无id=>新增
          return addPermission(this.formData)
        })
        .then(() => {
          // 添加成功
          this.$message.success('操作成功!')
          this.getPermissionList()
          this.showDialog = false
        })
        .catch(() => {})
    },
    // 取消添加或者修改
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.permForm.resetFields()
      this.showDialog = false
    },
    // 编辑=>获取数据
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style lang="less" scoped></style>
