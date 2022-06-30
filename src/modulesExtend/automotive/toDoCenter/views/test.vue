<template>
  <eco-content top="0px" bottom="0px" type="tool">
    <button @click="ac">格式化</button>
    <el-dialog title="格式化" :visible.sync="sss">
      <xmp><div v-text="result"></div></xmp>
    </el-dialog>
  </eco-content>
</template>
<script>
var _self;
import ecoContent from "@/components/pageAb/ecoContent.vue";
export default {
  name: "selectIdPage",
  components: {
      ecoContent
  },
  computed: {},
  data() {
    return {
      result: null,
      sss: null
    };
  },
  created() {},
  mounted() {},
  methods: {
    ac(){
        this.sss=true;
        //此处xmls应该是后台给的xml字符串，这里是为了演示，直接给了固定的
        // var xmls='<?xml version="1.0" encoding="UTF-8"?><note> <to>love</to><from>ss</from> <heading>调用成功</heading> <body>你好</body> </note>';

        this.result= this.showXml(xmls);
    },
    showXml(str) {
      var that = this
      var text = str;
      //去掉多余的空格
      text =
        "\n" +
        text
          .replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
            return name + " " + props.replace(/\s+(\w+=)/g, " $1");
          })
          .replace(/>\s*?</g, ">\n<");

      //把注释编码
      text = text
        .replace(/\n/g, "\r")
        .replace(/<!--(.+?)-->/g, function ($0, text) {
          var ret = "<!--" + escape(text) + "-->";
          return ret;
        })
        .replace(/\r/g, "\n");

      //调整格式
      var rgx =
        /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/gm;
      var nodeStack = [];
      var output = text.replace(
        rgx,
        function (
          $0,
          all,
          name,
          isBegin,
          isCloseFull1,
          isCloseFull2,
          isFull1,
          isFull2
        ) {
          var isClosed =
            isCloseFull1 == "/" ||
            isCloseFull2 == "/" ||
            isFull1 == "/" ||
            isFull2 == "/";
          var prefix = "";
          if (isBegin == "!") {
            prefix = that.getPrefix(nodeStack.length);
          } else {
            if (isBegin != "/") {
              prefix = that.getPrefix(nodeStack.length);
              if (!isClosed) {
                nodeStack.push(name);
              }
            } else {
              nodeStack.pop();
              prefix = that.getPrefix(nodeStack.length);
            }
          }
          var ret = "\n" + prefix + all;
          return ret;
        }
      );
      var prefixSpace = -1;
      var outputText = output.substring(1);
      //把注释还原并解码，调格式
      outputText = outputText
        .replace(/\n/g, "\r")
        .replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
          if (prefix.charAt(0) == "\r") prefix = prefix.substring(1);
          text = unescape(text).replace(/\r/g, "\n");
          var ret =
            "\n" + prefix + "<!--" + text.replace(/^\s*/gm, prefix) + "-->";
          return ret;
        });
      //alert(outputText);
      outputText = outputText.replace(/\s+$/g, "").replace(/\r/g, "\r\n");
      return outputText;
    },
    getPrefix(prefixIndex) {
      var span = "    ";
      var output = [];
      for (var i = 0; i < prefixIndex; ++i) {
        output.push(span);
      }
      return output.join("");
    },
  },
  watch: {},
};
</script>
<style scoped>
.selectIdPage {
  color: #0f1419;
  /* min-width: 1200px; */
  position: relative;
  height: 94%;
  /* margin: 0 24px; */
  /* top: 2%; */
  overflow-y: auto;
  color: #0f1419;
}

.selectIdPage .plainBtn:first-of-type {
  margin-left: 20px;
}

.selectIdPage .searchInputLabel {
  font-size: 14px;
  margin-left: 8px;
}

.selectIdPage /deep/ .el-table__row.el-table__row--striped td {
  background: #f5f7fa !important;
}

.selectIdPage /deep/ .tableHeader th {
  background: #f5f7fa;
  color: #000;
  border-bottom-width: 0px;
}

.selectIdPage /deep/ .el-table__row td {
  border-bottom-width: 0px;
}

.selectIdPage /deep/ .el-table__row td,
.selectIdPage /deep/ .tableHeader th {
  border: 0px;
}

.btn {
  position: absolute;
  bottom: 10px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
}
</style>
