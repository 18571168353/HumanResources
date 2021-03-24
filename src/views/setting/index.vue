<template>
  <div class="app-container">
    <el-card>
      <el-tabs>
        <el-tab-pane label="角色管理">
          <!-- 左侧内容 -->
          <el-row style="height: 60px">
            <el-button type="primary" size="small" @click="showDialog = true"
              ><i class="el-icon-plus" /> 新增角色</el-button
            >
          </el-row>
          <el-table border :data="list">
            <el-table-column
              align="center"
              label="序号"
              width="150px"
              type="index"
            />
            <el-table-column
              align="center"
              label="角色名"
              width="150px"
              prop="name"
            />
            <el-table-column align="center" label="描述" prop="description" />
            <el-table-column align="center" label="操作" width="250px">
              <template slot-scope="{ row }">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row.id)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteRole(row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height: 60px"
          >
            <!-- 分页组件 -->
            <el-pagination
              :current-page="page.page"
              :page-size="page.pagesize"
              :total="page.total"
              layout=" prev, pager, next"
              @current-change="handleCurrentChange"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息">
          <!-- 提示文本 -->
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <!-- 右侧内容 -->
          <el-form label-width="200px" style="margin-top:50px">
            <el-form-item label="企业名称">
              <el-input v-model="formData.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                v-model="formData.companyAddress"
                disabled
                style="width:400px"
              />
            </el-form-item>
            <el-form-item label="公司电话">
              <el-input
                v-model="formData.companyPhone"
                disabled
                style="width:400px"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                v-model="formData.mailbox"
                disabled
                style="width:400px"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="formData.remarks"
                type="textarea"
                :rows="3"
                disabled
                style="width:400px"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        :rules="rules"
        :model="roleForm"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole
} from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 5,
        total: 0 // 记录总数
      },
      formData: {}, // 公司信息
      showDialog: false, // 控制弹出层显示与隐藏
      roleForm: {
        name: '', // 名称
        description: '' // 详细信息
      }, // 表单数据
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      } // 验证规则
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    // 切换弹窗提示信息
    showTitle() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  watch: {},
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 查询企业的基本信息
  },
  mounted() {},
  methods: {
    // 获取列表数据
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
      // console.log(this.list)
    },
    // 分页跳转
    handleCurrentChange(newpage) {
      this.page.page = newpage // 页码刷新
      this.getRoleList() // 刷新页面
    },
    // 获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除用户
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除成功!')
      } catch (err) {
        // this.$message.error('取消删除!')
      }
      if (document.querySelectorAll('.el-card tbody tr').length === 1) {
        this.page.page = this.page.page > 1 ? this.page.page - 1 : 1
      }
    },
    // 编辑,表单获取数据
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      console.log(this.roleForm)
      this.showDialog = true // 为了不出现闪烁的问题 先获取数据 再弹出层
    },
    // 点击编辑弹窗确定按钮
    async btnOK() {
      try {
        await this.$refs.roleForm.validate() // 校验表单
        if (this.roleForm.id) {
          // 如果有id=>编辑
          await updateRole(this.roleForm)
        } else {
          // 没有id=> 新增
          // 新增业务
          await addRole(this.roleForm)
        }
        // 重新拉取数据
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (err) {
        console.log(err)
      }
    },
    // 点击取消按钮
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="less" scoped></style>
