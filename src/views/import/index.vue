<template>
  <div>
    <!-- 公共导入组件 -->
    <upload-excel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async success({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          // key是当前的中文名 找到对应的英文名
          if (
            userRelations[key] === 'timeOfEntry' ||
            userRelations[key] === 'correctionTime'
          ) {
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], '/')
            ) // 只有这样, 才能入库
            return
          }
          userInfo[userRelations[key]] = item[key]
        })
        // 最终userInfo变成了全是英文
        arr.push(userInfo)
      })
      try {
        await importEmployee(arr) // 调用导入接口
        this.$message.success('导入成功')
        this.$router.back()
      } catch (error) {
        this.$message.error('导入电话号码重复!')
      }
    },
    // 转化excel日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>

<style lang="less" scoped></style>
