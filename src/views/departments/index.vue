<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 组织架构内容- 头部 -->
      <el-card class="tree-card">
        <!-- 放置解构内容 -->
        <tree-tools :treeNode="company" :isRoot="true" @addDepts="addDepts" />
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 传入内容 插槽内容 -->
          <!-- 放置解构内容 -->
          <tree-tools
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <add-dept
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
      ref="addDept"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'

import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  name: '',
  components: { TreeTools, AddDept },
  props: {},
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name'
      },
      showDialog: false, // 控制添加弹框的显示与隐藏
      node: null // 记录当前点击的node节点
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDepartments()
  },
  mounted() {},
  methods: {
    // 获取组织架构的数据
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化成树形结构
      // console.log(result)
    },
    // 打开添加弹框
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    // 打开编辑对话框
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // 我们需要在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
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
