<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 组织架构内容- 头部 -->
      <el-card class="tree-card">
        <!-- 放置解构内容 -->
        <tree-rools :treeNode="company" :isRoot="true" />
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 传入内容 插槽内容 -->
          <!-- 放置解构内容 -->
          <tree-rools slot-scope="{ data }" :treeNode="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeRools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  name: '',
  components: { TreeRools },
  props: {},
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDepartments()
  },
  mounted() {},
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化成树形结构
      console.log(result)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
