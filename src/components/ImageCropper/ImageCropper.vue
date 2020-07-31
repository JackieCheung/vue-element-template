<template>
  <div class="image-cropper">
    <template v-if="!progress.processing">
      <div
        v-show="step === 0"
        class="upload-container">
        <el-upload
          ref="uploader"
          :multiple="false"
          :show-file-list="false"
          :auto-upload="false"
          :accept="accept"
          :on-change="handleFileChange"
          action=""
          drag>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或 <em>点击选择文件</em></div>
        </el-upload>
      </div>
      <div
        v-if="step === 1"
        class="cropper-container">
        <Spin v-if="fileLoading" fix></Spin>
        <el-row
          :gutter="16"
          type="flex"
          justify="space-around">
          <el-col :span="18">
            <div class="cropper">
              <vue-cropper
                ref="imageCropper"
                :img="imgSrc"
                v-bind="attrs"
                v-on="listeners"></vue-cropper>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="previewer">
              <p class="my-0">图片预览：</p>
              <el-image
                :src="preview.url"
                :preview-src-list="[preview.url]"
                class="image"
                fit="contain">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <el-image
                :src="preview.url"
                :preview-src-list="[preview.url]"
                class="image circle"
                fit="cover">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row type="flex" justify="space-around">
          <div class="toolbar">
            <el-button
              :size="btnSize"
              type="danger"
              plain
              @click="handleReturnBack">
              返回
            </el-button>
            <el-button
              :size="btnSize"
              type="primary"
              plain
              @click="changeScale(1)">
              <font-awesome-icon icon="search-plus" />
            </el-button>
            <el-button
              :size="btnSize"
              type="primary"
              plain
              @click="changeScale(-1)">
              <font-awesome-icon icon="search-minus" />
            </el-button>
            <el-button
              :size="btnSize"
              type="primary"
              plain
              @click="rotateLeft">
              <font-awesome-icon icon="undo" />
            </el-button>
            <el-button
              :size="btnSize"
              type="primary"
              plain
              @click="rotateRight">
              <font-awesome-icon icon="redo" />
            </el-button>
            <el-button
              :size="btnSize"
              type="primary"
              @click="uploadImage">
              <font-awesome-icon icon="upload" />
              上传
            </el-button>
          </div>
        </el-row>
      </div>
    </template>
    <template v-else>
      <div class="progress-container">
        <p style="font-size: 20px; font-weight: bold; margin: 80px auto 60px;">
          {{ progress.percentage === 100 ? '上传成功！' : (progress.status === 'error' ? '上传失败！' : '正在上传....') }}</p>
        <el-progress
          :color="progressColor"
          :percentage="progress.percentage"
          :stroke-width="20"
          text-inside></el-progress>
      </div>
    </template>
    <div class="dialog-container">
      <el-dialog
        v-if="preview.url"
        :visible.sync="preview.dialogVisible"
        title="预览大图"
        width="40%"
        top="10vh"
        append-to-body>
        <img :src="preview.url" width="100%" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'
  /**
   * refer to https://github.com/xyxiao001/vue-cropper
   */
  import { VueCropper } from 'vue-cropper'

  export default {
    name: 'ImageCropper',
    components: {
      VueCropper
    },
    props: {
      // 裁剪图片的地址，默认值：空，可选值：url 地址 || base64 || blob
      img: {
        type: [String, Blob, null, File],
        default: ''
      },
      accept: {
        type: String,
        default: 'image/jpeg'
      },
      // 图片读取完成前回调
      beforeImageRead: {
        type: Function,
        default: null
      },
      // 图片读取完成后回调
      afterImageRead: {
        type: Function,
        default: null
      }
    },
    data () {
      return {
        btnSize: 'small',
        step: 0, // 0：选择图片，1：裁剪图片
        imgSrc: '', // 裁剪图片的地址，默认值：空，可选值：url 地址 || base64 || blob || file
        preview: {
          url: '', // 预览图片的 url 地址
          dialogVisible: false
        },
        progress: {
          processing: false,
          percentage: 0,
          status: ''
        },
        fileLoading: false
      }
    },
    computed: {
      attrs () {
        return Object.assign(
          {},
          {
            autoCrop: true,
            fixed: false,
            outputSize: 0.8,
            centerBox: true,
            full: true,
            high: false,
            infoTrue: true,
            maxImgSize: 2500
          },
          this.$attrs
        )
      },
      listeners () {
        return Object.assign(
          {},
          {
            imgLoad: this.handleImgLoad,
            realTime: this.handleRealTime,
            imgMoving: this.handleImgMoving,
            cropMoving: this.handleCropMoving
          },
          this.$listeners
        )
      },
      // 自定义进度条背景色
      progressColor () {
        if (this.progress.percentage < 100) {
          return this.progress.status === 'error' ? '#ff4949' : '#409eff'
        } else {
          return '#5cb87a'
        }
      }
    },
    watch: {
      img: {
        handler (newVal) {
          if (newVal) {
            this.imgSrc = newVal
          }
        },
        immediate: true
      }
    },
    methods: {
      // 图片移动事件回调
      handleImgMoving (obj) {
        this.$emit('imgMoving', obj)
        this.$emit('img-moving', obj)
      },
      // 截图框移动事件回调
      handleCropMoving (obj) {
        this.$emit('cropMoving', obj)
        this.$emit('crop-moving', obj)
      },
      // 图片加载后回调
      handleImgLoad (status) {
        this.fileLoading = false
        this.$emit('img-load', status === 'success')
        this.$emit('imgLoad', status === 'success')
      },
      handleRealTime: debounce(function (obj) {
        this.$refs.imageCropper.getCropData(data => { this.preview.url = data })
        this.$emit('realTime', obj)
        this.$emit('real-time', obj)
      }, 400),
      // 开始截图
      startCrop () {
        return this.$refs.imageCropper.startCrop()
      },
      // 停止截图
      stopCrop () {
        return this.$refs.imageCropper.stopCrop()
      },
      // 清除截图
      clearCrop () {
        return this.$refs.imageCropper.clearCrop()
      },
      // 修改图片大小 正数为变大 负数变小
      changeScale (num) {
        if (this.imgSrc) {
          return this.$refs.imageCropper.changeScale(num || 1)
        }
      },
      // 获取图片基于容器的坐标点
      getImgAxis () {
        return this.$refs.imageCropper.getImgAxis()
      },
      // 获取截图框基于容器的坐标点
      getCropAxis () {
        return this.$refs.imageCropper.getCropAxis()
      },
      // 自动生成截图框函数
      goAutoCrop () {
        return this.$refs.imageCropper.goAutoCrop()
      },
      // 向右边旋转90度
      rotateRight () {
        if (this.imgSrc) {
          return this.$refs.imageCropper.rotateRight()
        }
      },
      // 向左边旋转90度
      rotateLeft () {
        if (this.imgSrc) {
          return this.$refs.imageCropper.rotateLeft()
        }
      },
      // 获取截图的 base64 数据
      getCropBase64 (fn) {
        this.$refs.imageCropper.getCropData(fn)
      },
      // 获取截图的 blob 数据
      getCropBlob (fn) {
        this.$refs.imageCropper.getCropBlob(fn)
      },
      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      handleFileChange (file, fileList) {
        this.fileLoading = true
        this.progress = {
          processing: false,
          percentage: 0,
          status: ''
        }
        if (this.beforeImageRead) {
          if (this.beforeImageRead(file, fileList)) {
            const reader = new FileReader()
            reader.onload = e => {
              this.imgSrc = e.target.result
              this.step = 1
            }
            reader.readAsDataURL(file.raw)
          } else {
            this.imgSrc = ''
            this.step = 1
          }
        } else {
          const reader = new FileReader()
          reader.onload = e => {
            this.imgSrc = e.target.result
            this.step = 1
          }
          reader.readAsDataURL(file.raw)
        }
      },
      // 点击上传
      uploadImage () {
        this.$emit('uploadImage', {
          'getCropBase64': this.getCropBase64,
          'getCropBlob': this.getCropBlob
        })
        this.$emit('upload-image', {
          'getCropBase64': this.getCropBase64,
          'getCropBlob': this.getCropBlob
        })
      },
      // 返回
      handleReturnBack () {
        this.step = 0
        this.imgSrc = this.preview.url = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-cropper {
    position: relative;
    min-height: 392px;
    padding: 16px 12px;
    margin: 0 auto;
    border: 1px solid #e8eaec;
    border-radius: 2px;

    .upload-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      padding: 16px;

      ::v-deep {
        .el-upload {
          width: 100%;
        }

        .el-upload-dragger {
          width: 100%;
          height: 240px;
          background-color: #fbfdff;
          border: 1px dashed #c0ccda;

          &:hover, &:focus {
            border-color: #409eff;
            color: #409eff;
          }

          .el-icon-upload {
            margin-top: 70px;
          }
        }
      }
    }

    .cropper-container {
      position: relative;

      .cropper {
        height: 300px;
      }

      .previewer {
        height: 300px;

        ::v-deep .image-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: #f5f7fa;
          color: #909399;
          font-size: 24px;
        }

        .image {
          display: block;
          margin: 10px auto 0;
          padding: 3px;
          width: 128px;
          height: 128px;
          background-color: #f5f7fa;
          border: 1px dashed #c0ccda;

          &.circle {
            border-radius: 100%;

            ::v-deep img {
              border-radius: 100%;
            }
          }

          &:hover, &:focus {
            border-color: #409eff;
          }
        }
      }

      .el-divider--horizontal {
        margin-top: 12px;
        margin-bottom: 12px;
        background-color: unset;
        border-top: 1px dashed #dcdfe6;
      }

      .toolbar {
        width: 100%;
        text-align: center;

        .el-button + .el-button {
          margin-left: 20px;
        }
      }
    }

    .progress-container {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      padding: 35px;
      text-align: center;
      color: #8c939d;
      background-color: #fbfdff;
    }
  }
</style>
