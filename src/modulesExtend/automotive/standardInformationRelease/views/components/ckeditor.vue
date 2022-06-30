<template>
  <div v-loading="loading" v-bind:style="styleObj">
    <textarea ref="ckeditor" :name="name" v-show="complete"></textarea>
  </div>
</template>

  <script>
import { EcoUtil } from "@/components/util/main.js";
const imgPreviewUrl =
  "/api/file-manager/safe/preview?mt-token=[mtToken]&file-header-Id=[fileHeaderId]";
export default {
  name: "ckeditor",
  components: {},
  data() {
    return {
      name: EcoUtil.getUID(),
      ckeditor: {},
      loading: true,
      complete: false,
      autoTimer: null,
      styleObj: {},
      parentVm: {},
    };
  },
  props: {
    content: {
      type: String,
      default() {
        return "";
      },
    },
    toolbar: {
      type: String,
      default() {
        return "RSF";
      },
    },
    width: {
      type: String,
      default() {
        return "100%";
      },
    },
    height: {
      type: String,
      default() {
        return "450px";
      },
    },
  },
  created() {
    let that = this;
    this.styleObj = {
      height: parseInt(this.height) + 73 + "px",
      width: this.width,
    };
    window.EcoToken = this.$ecoToken;
    document.onreadystatechange = function () {
      if (document.readyState == "complete") {
        let ckeditorJs = "/assets/ckeditor/ckeditor.js"; //默认加载正式环境下的js

        that.loadJs(ckeditorJs);
      }
    };
  },
  activated() {},

  mounted() {
    if (document.readyState == "complete") {
      let ckeditorJs = "/assets/ckeditor/ckeditor.js"; //默认加载正式环境下的js
      this.loadJs(ckeditorJs);
    }
  },

  computed: {},

  methods: {
    loadJs(url) {
      let that = this;

      if (window.CKEDITOR && window.CKEDITOR.status == "loaded") {
        //如果已加载ckeditor 则直接引用
        that.initCkeditor();
        return;
      }
      var script = document.createElement("script");
      script.type = "text/javascript";

      script.onload = function () {
        if (window.CKEDITOR) {
          that.ckeditor = window.CKEDITOR;
        } else {
          //先移除已加载的js
          document.getElementsByTagName("head")[0].removeChild(script);
          //如果不存在在加载开发环境的js
          that.loadJs("/static/ckeditor/ckeditor.js");
        }
      };

      script.src = url;

      document.getElementsByTagName("head")[0].appendChild(script);
    },
    initCkeditor() {
      this.complete = true;
      this.loading = false;
      console.log("ckeditor 初始化");
      if (CKEDITOR.instances[this.name]) {
        CKEDITOR.instances[this.name].destroy();
      }

      CKEDITOR.replace(this.$refs["ckeditor"], {
        height: this.height,
        width: this.width,
        toolbar: this.toolbar,
      });
      if (this.content) {
        let _html = this.transData(this.content);
        CKEDITOR.instances[this.name].setData(_html);
      }
      this.$emit("on-success");
    },
    transData(value) {
      return value.replace(
        /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
        function (match, capture) {
          let fileHeaderId = capture;
          let mtToken = EcoToken.fileManager.getTempToken();
          let imgSrc = imgPreviewUrl
            .replace("[mtToken]", mtToken)
            .replace("[fileHeaderId]", fileHeaderId);
          let imgHtml = match.replace(capture, imgSrc);
          return imgHtml;
        }
      );
    },
    getCkeditorData() {
      let value = CKEDITOR.instances[this.name].getData();
      return value.replace(
        /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
        function (match, capture) {
          let fileHeaderId = capture.substring(
            capture.indexOf("file-header-Id=") + 15
          );
          let imgHtml = match.replace(capture, fileHeaderId);
          return imgHtml;
        }
      );
    },
    setCkeditorData(data) {
      let _html = this.transData(data);
      this.loading = true;
      setTimeout(() => {
        CKEDITOR.instances[this.name].setData(_html);
        this.loading = false;
      }, 500);
    },
  },

  watch: {
    "ckeditor.status": {
      handler(value) {
        if (value == "loaded") {
          this.initCkeditor();
        }
      },
    },
    "$parent.opened"(value) {
      //解决ckeditor与elementUi的dialog appendToBody属性为true的时候
      //会导致ckeditor无法正常点击使用
      //所以监听dialog的打开状态以及判断appendToBody是否为true
      if (value && this.$parent.appendToBody) {
        if (window.CKEDITOR && CKEDITOR.status == "loaded") {
          this.initCkeditor();
        }
      }
    },
    "$parent.$parent.opened"(value) {
      //解决ckeditor与elementUi的dialog appendToBody属性为true的时候
      //会导致ckeditor无法正常点击使用
      //所以监听dialog的打开状态以及判断appendToBody是否为true
      if (value && this.$parent.$parent.appendToBody) {
        if (window.CKEDITOR && CKEDITOR.status == "loaded") {
          this.initCkeditor();
        }
      }
    },
    "$parent.$parent.$parent.opened"(value) {
      //解决ckeditor与elementUi的dialog appendToBody属性为true的时候
      //会导致ckeditor无法正常点击使用
      //所以监听dialog的打开状态以及判断appendToBody是否为true
      if (value && this.$parent.$parent.$parent.appendToBody) {
        if (window.CKEDITOR && CKEDITOR.status == "loaded") {
          this.initCkeditor();
        }
      }
    },
    "$parent.$parent.$parent.$parent.opened"(value) {
      //解决ckeditor与elementUi的dialog appendToBody属性为true的时候
      //会导致ckeditor无法正常点击使用
      //所以监听dialog的打开状态以及判断appendToBody是否为true
      if (value && this.$parent.$parent.$parent.$parent.appendToBody) {
        if (window.CKEDITOR && CKEDITOR.status == "loaded") {
          this.initCkeditor();
        }
      }
    },
    content(newValue, oldValue) {
      if (newValue == null) newValue = "";
      //console.log("newValue:"+newValue);
      //console.log("oldValue:"+oldValue);
      if (newValue != oldValue) {
        this.setCkeditorData(newValue);
      }
    },
  },
  destroyed() {
    if (CKEDITOR.instances[this.name]) {
      CKEDITOR.instances[this.name].destroy();
    }
  },
};
</script>

  <style scoped>
</style>
