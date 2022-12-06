"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_nav_header2 = common_vendor.resolveComponent("nav-header");
  _easycom_nav_header2();
}
const _easycom_nav_header = () => "../../components/nav-header/nav-header.js";
if (!Math) {
  _easycom_nav_header();
}
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const searchPage = () => {
      common_vendor.index.navigateTo({
        url: "/subPackages/search/search"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(searchPage)
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-92bb8f34"], ["__file", "C:/Users/Administrator/Desktop/netease-music-uniapp/pages/home/home.vue"]]);
wx.createPage(MiniProgramPage);
