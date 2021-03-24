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
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry" />
        <el-table-column label="账户状态" sortable="" prop="enableState" />
        <el-table-column label="操作" fixed="right" width="280">
          <template>
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small">删除</el-button>
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
        </el-pagination></el-row>
    </el-card>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
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
      this.total = total
      this.loading = false
    },
    // 分页
    handleCurrentChange(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="less" scoped></style>
