<template>
  <div class="app-container">
    <page-tools :show-before="true">
      <!-- 左侧 =>总记录数-->
      <!-- <span slot="before">共16条记录</span> -->
      <template v-slot:before> 共{{ total }}条记录 </template>
      <!-- 右侧 -->
      <template v-slot:after>
        <el-button size="mini" type="success">excl导入</el-button>
        <el-button size="mini" type="danger">excl导出</el-button>
        <el-button size="mini" type="primary">新增员工</el-button>
      </template>
    </page-tools>
    <el-card v-loading="loading">
      <!-- 表格组件 -->
      <el-table border :data="list">
        <el-table-column label="序号" sortable="" type="index" align="center" />
        <el-table-column
          label="姓名"
          sortable=""
          prop="username"
          align="center"
        />
        <el-table-column
          label="工号"
          sortable=""
          prop="workNumber"
          align="center"
        />
        <el-table-column
          label="聘用形式"
          sortable=""
          align="center"
          :formatter="formatEmployment"
          prop="formOfEmployment"
        />
        <el-table-column
          label="部门"
          sortable=""
          prop="departmentName"
          align="center"
        />
        <el-table-column label="入职时间" sortable="" align="center">
          <template slot-scope="{ row }">{{
            row.timeOfEntry | formatDate
          }}</template>
        </el-table-column>
        <el-table-column
          label="账户状态"
          align="center"
          sortable=""
          prop="enableState"
        >
          <template slot-scope="{ row }">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="page.page"
          :page-size="page.size"
          :total="total"
          @current-change="handleCurrentChange"
        >
          />
        </el-pagination></el-row
      >
    </el-card>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1,
        size: 10
      },
      total: 0
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getEmployeeList()
  },
  mounted() {},
  methods: {
    // 获取员工列表数据
    async getEmployeeList() {
      this.loading = true
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      console.log(this.list)
      this.total = total
      this.loading = false
    },
    // 分页
    handleCurrentChange(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定要删除该员工吗?')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除该员工成功!')
      } catch (error) {
        console.log(error)
      }
      if (document.querySelectorAll('.el-card tbody tr').length === 1) {
        this.page.page = this.page.page > 1 ? this.page.page - 1 : 1
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
