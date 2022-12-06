"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "search",
  setup(__props) {
    const inputValue = common_vendor.ref("");
    common_vendor.ref(true);
    const searchValue = () => {
      console.log(inputValue.value);
    };
    common_vendor.onMounted(() => {
      const res = common_vendor.index.getMenuButtonBoundingClientRect && common_vendor.index.getMenuButtonBoundingClientRect();
      console.log(res);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(searchValue),
        b: inputValue.value,
        c: common_vendor.o(($event) => inputValue.value = $event.detail.value),
        d: common_vendor.o(searchValue),
        e: common_vendor.p({
          type: "search"
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Administrator/Desktop/netease-music-uniapp/subPackages/search/search.vue"]]);
wx.createPage(MiniProgramPage);
