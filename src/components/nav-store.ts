import { action, observable } from "mobx";
import { reqNavList, listMainType } from "@utils/api";

class HeaderStore {
  @observable headerNav: any[] = [];
  @observable footerNav: any[] = [];
  @observable ipTypes: any[] = [];

  @action
  async navList() {
    const nowdate = new Date().getTime();
    const waytime = 1000 * 60 * 60 * 24 * 30;
    let storage = window.localStorage;
    let user = JSON.parse(storage.getItem('user'));
    if (!localStorage.getItem("user")) {
      if (user === null || (nowdate - user.time) > waytime) {
        localStorage.removeItem('contastList');
        localStorage.removeItem('ipTypeSuperiorNumber');
      } else {
        localStorage.setItem("user", user.user);
        location.reload();
      }
    }
    let data: any = await reqNavList({ playformType: 2 });
    let mediaType: any = await listMainType();
    this.ipTypes = mediaType && mediaType.result;
    const { errorCode, result }: { errorCode: string, result: any[] } = data;
    if (errorCode === "200") {
      let headNav: any[] = [];
      let footNav: any[] = [];
      result.forEach(item => {
        let type = item.navAdd;
        let special = item.navName;
        if (type === "1") {
          headNav.push(item);
        } else if (type === "2" && special !== "联系客服") {
          footNav.push(item);
        }
      });
      headNav.forEach(item => {
        if (item.navName === 'IP库') {
          item.sublist = this.ipTypes;
        }
      });
      this.headerNav = headNav;
      this.footerNav = footNav;
    }
  }
}

export default new HeaderStore();
