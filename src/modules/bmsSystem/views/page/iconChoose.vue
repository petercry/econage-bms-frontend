<template>
  <div>
    <ul class="icon_lists" v-html="liArr+lastLi"></ul>
  </div>
</template>
<script>
import demoHtml from "raw-loader!@/modules/bmsSystem/assets/iconfont/demo_fontclass.html";
export default {
  components: {},
  data() {
    return {
      liArr: "",
      lastLi:
      `<li>
                <i class="icon el-icon-circle-close-outline" style=""></i>
                    <div class="name">无图标</div>
                    <div class="fontclass"></div>
                </li>`
                // `<li>
                // <i class="icon" style="line-height:70px;font-size: 16px;">无图标</i>
                //     <div class="name"></div>
                //     <div class="fontclass"></div>
                // </li>`
    };
  },
  created() {
    this.liArr = demoHtml.replace(
      /[\s\S]*<ul class="icon_lists clear">([\s\S]*?)<\/ul>[\s\S]*/,
      "$1"
    );
  },
  mounted() {
    document.querySelector(".icon_lists").addEventListener("click",function(e) {
      let elem = e.srcElement || e.target,
        liElem = elem.parentNode.tagName == "LI" ? elem.parentNode : elem;
      let doObj = {};
      doObj.action = "iconChooseCallBack";
      doObj.close = true;
      doObj.data = liElem.querySelector('.fontclass').innerText.slice(1)||'';
      parent.window.sysvm.callBackDialogFunc(doObj);
    },false);
  },
  methods: {},

  destroyed() {}
};
</script>
<style>
.icon_lists {
  width: 100% !important;
  font-size: 12px;
  user-select: none;
}

.icon_lists li {
  padding:0 5px;
  float: left;
  width: 80px;
  height: 80px;
  text-align: center;
  list-style: none !important;
  cursor: pointer;
}
.icon_lists .icon {
  font-size: 24px;
  line-height: 32px;
  margin: 5px 0;
  color: #333;
  display: inline-block;
}
.icon_lists li>div{
  line-height: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.icon_lists li:hover{
  font-weight: bold;
}
.icon_lists li:hover .icon{
  font-weight: bold;
}
</style>
