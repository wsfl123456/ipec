import { observable } from "mobx";

export class BaseStore {
  @observable userInfo: any;

  constructor() {
    const user = localStorage.getItem('user');
    this.userInfo = JSON.parse(user);
  }
}
