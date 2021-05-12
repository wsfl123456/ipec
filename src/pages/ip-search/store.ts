import { action, observable } from 'mobx';
import { reqIpSearch } from '@utils/api';
import _isEmpty from 'lodash/isEmpty';
import _uniqWith from 'lodash/uniqWith';
import _isEqual from 'lodash/isEqual';

class SearchList {
  @observable searchResult = {
    ipData: [],
    caseData: [],
    enterData: [],
    totalCount: 0,
    ipCount: 0,
    caseCount: 0,
    enterCount: 0,
    pageSize: 20,
  };
  @observable keywords: string = '';
  @observable ipIsLoading: boolean = false;
  @observable caseIsLoading: boolean = false;
  @observable enterIsLoading: boolean = false;
  @observable noMore: boolean = false;
  @observable seeMore: boolean = false;
  @observable noMore2: boolean = false;
  @observable seeMore2: boolean = false;
  @observable noMore3: boolean = false;
  @observable seeMore3: boolean = false;

  @action
  changeKeyWords(params: string) {
    this.keywords = params;
  }

  @action
  clearKeyword() {
    this.keywords = '';
  }

  @action
  setLoading(ipFlag: boolean, caseFlag: boolean, enterFlag: boolean) {
    this.ipIsLoading = ipFlag;
    this.caseIsLoading = caseFlag;
    this.enterIsLoading = enterFlag;
  }

  @action
  async IpSearch(param) {
    const { keyword, currentPage, pageSize, userGuid, type }: { keyword: string, currentPage: number, pageSize: number, userGuid: undefined, type: undefined } = param;
    const { errorCode, result }: any = await reqIpSearch(keyword, currentPage, pageSize, userGuid, type);

    this.setLoading(false, false, false);
    if (errorCode === "200") {
      // 搜索IP
      if (!_isEmpty(result.ipRoomDataVOs)) {
        currentPage === 1 ? this.searchResult.ipData = result.ipRoomDataVOs : this.searchResult.ipData = _uniqWith([...this.searchResult.ipData, ...result.ipRoomDataVOs], _isEqual);

        if ((result.ipRoomDataVOs).length < pageSize) {
          this.noMore = true;
          this.seeMore = false;
        } else {
          this.seeMore = true;
          this.noMore = false;
        }
      } else {
        if (currentPage === 1) {
          this.searchResult.ipData = [];
          this.noMore = false;
        } else {
          this.noMore = true;
        }
        this.ipIsLoading = false;
        this.seeMore = false;
      }

      // 搜索案例
      if (!_isEmpty(result.portalPostVOs)) {
        currentPage === 1 ? this.searchResult.caseData = result.portalPostVOs : this.searchResult.caseData = _uniqWith([...this.searchResult.caseData, ...result.portalPostVOs], _isEqual);

        if ((result.portalPostVOs).length < pageSize) {
          this.noMore2 = true;
          this.seeMore2 = false;
        } else {
          this.seeMore2 = true;
          this.noMore2 = false;
        }

      } else {
        if (currentPage === 1) {
          this.searchResult.caseData = [];
          this.noMore2 = false;
        } else {
          this.noMore2 = true;
        }
        this.seeMore2 = false;
        this.caseIsLoading = false;
      }

      // 搜索企业
      if (!_isEmpty(result.companyVOs)) {
        currentPage === 1 ? this.searchResult.enterData = result.companyVOs : this.searchResult.enterData = _uniqWith([...this.searchResult.enterData, ...result.companyVOs], _isEqual);

        if ((result.companyVOs).length < pageSize) {
          this.noMore3 = true;
          this.seeMore3 = false;
        } else {
          this.seeMore3 = true;
          this.noMore3 = false;
        }
      } else {
        if (currentPage === 1) {
          this.searchResult.enterData = [];
          this.noMore3 = false;
        } else {
          this.noMore3 = true;
        }
        this.seeMore3 = false;
        this.enterIsLoading = false;
      }
      if (currentPage === 1) {
        this.searchResult.ipCount = result.ipCount || 0;
        this.searchResult.caseCount = result.portalPostCount || 0;
        this.searchResult.enterCount = result.companyCount || 0;
        this.searchResult.totalCount = result.ipCount + result.portalPostCount + result.companyCount;
      }

    }
  }
}

export default new SearchList();
