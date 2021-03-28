<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width:180px" />
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5' // 引入cos包
const cos = new COS({
  SecretId: 'AKIDM81d1BErIRsZ6breGfz2txlJI8B5d4A5',
  SecretKey: 'pOuUbfSyn0MSHLjogKp46AAdCWaPxJNC'
})
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '', // 上传图片的地址
      currentFileUid: null,
      percent: 0, // 记录当前百分比
      showPercent: false
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 删除文件
    handleRemove(file) {
      // file是点击删除的文件
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 添加文件
    // 修改文件时触发
    // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
    // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
    // [] => [...fileList] [] => fileList.map()
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    // 上传前
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true // 最后一定要reture true
    },
    upload(params) {
      // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: 'yang-1305395396',
            Region: 'ap-chengdu', // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            onProgress: progress => {
              this.percent = progress.percent * 100
            }
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            console.log(err || data)
            if (!err && data.statusCode === 200) {
              //  说明上传成功
              // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
              // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
              // 需要知道当前上传成功的是哪一张图片
              this.fileList = this.fileList.map(item => {
                if (item.uid === this.currentFileUid) {
                  return { url: 'http://' + data.Location, upload: true }
                  // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
                }
                return item
              })
              setTimeout(() => {
                // 关闭进度条 重置百分比
                this.showPercent = false
                this.percent = 0
              }, 1000)
            }
          }
        )
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
