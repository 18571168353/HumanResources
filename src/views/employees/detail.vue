<template>
  <div class="app-container">
    <!-- 放置一个el-card -->
    <el-card>
      <el-tabs>
        <el-tab-pane label="登陆账户设置">
          <el-row>
            <el-col>
              <el-form
                ref="userForm"
                :model="userInfo"
                :rules="rules"
                label-width="120px"
                style="margin-left: 120px; margin-top:30px"
              >
                <el-form-item label="姓名" prop="username">
                  <el-input v-model="userInfo.username" style="width:300px" />
                </el-form-item>
                <el-form-item label="密码" prop="password2">
                  <el-input
                    v-model="userInfo.password2"
                    style="width:300px"
                    type="password"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="saveUser"
                    >更新</el-button
                  >
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <el-row type="flex" justify="end">
            <el-tooltip content="打印个人基本信息">
              <router-link :to="`/employees/print/${userId}?type=personal`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
          </el-row>
          <!-- <user-info /> -->
          <component :is="UserComponent" />
          <!-- 动态组件可以切换组件 -->
        </el-tab-pane>
        <el-tab-pane label="岗位信息">
          <el-row type="flex" justify="end">
            <el-tooltip content="打印岗位信息">
              <router-link :to="`/employees/print/${userId}?type=job`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
          </el-row>
          <job-info />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user' // 获取用户基本信息
import { saveUserDetailById } from '@/api/employees' // 保存用户基本信息
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  name: '',
  components: { UserInfo, JobInfo },
  props: {},
  data() {
    return {
      UserComponent: 'UserInfo',
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据
      userInfo: {
        //   专门存放基本信息
        username: '',
        password2: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getUserDetailById()
  },
  mounted() {},
  methods: {
    // 获取基本信息
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 更新基本信息
    async saveUser() {
      try {
        // 校验
        await this.$refs.userForm.validate()
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2
        }) // 将新密码的值替换原密码的值
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
