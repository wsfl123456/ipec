// 提交后的用户信息
import * as React from 'react';
import icon_warn from '@assets/images/user/information/icon_warning@2x.png';
import { Link} from 'react-router-dom';

interface  IBasicInfoProps {
  company: any;
  person: any;
  changeIsEdit: any;
  accountType: number;
}
const purposeObj = {
  1: "有IP授权",
  2: "找IP合作",
  3: "产品设计接单",
};
export default class BasicInfo extends React.Component<IBasicInfoProps, any>{

  render(){
   const { company, person, accountType } = this.props;
   const personType = accountType === 1;
   const companyType = accountType === 2;
   const purpose = personType ? person.purpose : company.purpose;
   const haveIp = personType ? person.haveIp : company.haveIp;
   const  worksWebsite = companyType ? company.worksWebsite : person.worksWebsite;
   const  worksUrl = companyType ? company.worksUrl : person.worksUrl;
   const  designType = companyType ? company.designType : person.designType;
   const adept = companyType ? company.adept : person.adept;
   const mobile = companyType ? company.mobile : person.mobile;
   // const mobile = companyType ? company.mobile : person.mobile;
   // console.log(purpose);
   return(
     <div className="basic-info-content">
         <div className="row-item">
            <span>账户号码</span>
           <div className="item-right">{mobile}</div>
         </div>
       <div className="row-item">
         <span>账户性质</span>
         <div className="item-right">{accountType === 1 ?  '个人账户' : '企业账户' }</div>
       </div>
       { companyType &&
         <div>
           <div className="row-item">
             <span>企业名称</span>
             <div className="item-right">{company.companyName}</div>
           </div>
           <div className="row-item">
             <span>行业分类</span>
             <div className="item-right">{company.companyIndustry}</div>
           </div>
           <div className="row-item">
             <span>企业经营的业务/产品</span>
             <div className="item-right">{company.companyProduct}</div>
           </div>
         </div>
       }
       { personType &&
       <div>
         <div className="row-item">
           <span>姓名</span>
           <div className="item-right">{person.userRealName}</div>
         </div>
         <div className="row-item">
           <span>联系方式</span>
           <div className="item-right">{person.contactInfo}</div>
         </div>
         <div className="row-item">
           <span>所属企业</span>
           <div className="item-right">{person.companyName}</div>
         </div>
       </div>
       }

       <div className="row-item">
         <span>来平台目的</span>
         <div className="item-right">{purposeObj[purpose]}</div>
       </div>
       {
         companyType &&
         <div className="row-item">
           <span>合作联系人</span>
           <div className="item-right">
             {
               company.cooperativeContacts && company.cooperativeContacts.map((item, idx) => {
                 return <p key={idx}>姓名：{item.name}/职位： {item.position}/联系方式： {item.contactInfo}</p>
               })
             }
           </div>
         </div>
       }
       <div className="row-item">
         <span>拥有/代理的IP</span>
         <div className="item-right">
           {
             haveIp && haveIp.map((item, idx) => {
               return <p key={idx}>IP名：{item.name}/类型：{item.ipType}/授权品类:{item.authorizeType}</p>
             })
           }
         </div>
       </div>
       {
         purpose === 3 &&
         <div>
           <div className="row-item">
             <span>证明企业实力的作品链接</span>
             <div className="item-right">{worksWebsite}</div>
           </div>
           <div className="row-item">
             <span>设计作品</span>
             <div className="item-right">{worksUrl}</div>
           </div>
           <div className="row-item">
             <span>承接设计类型</span>
             <div className="item-right">{designType}</div>
           </div>
           <div className="row-item">
             <span>擅长领域</span>
             <div className="item-right">{ adept}</div>
           </div>
         </div>
        }

       {
        companyType && purpose !== 3 &&
         <div className="row-item">
           <span>是否已有IP合作案例</span>
           <div className="item-right">
             {company.hasCooperate === 1 ? '是' : '否'}
           </div>
         </div>
       }
       {
         companyType &&
         <div>
           <div className="row-item">
             <span>企业地址</span>
             <div className="item-right">
               {company.companyAddress}
             </div>
           </div>
           <div className="row-item">
             <span>企业简介</span>
             <div className="item-right">
               {company.companyDesc}
             </div>
           </div>
           <div className="row-item">
             <span>企业风采</span>
             <div className="item-right">
               {
                 company.exhibitionUrl && company.exhibitionUrl.split(',').map(i => {
                   return  <img key={i} src={i} alt=""/>
                 })}
             </div>
           </div>
         </div>
       }
       {
         personType &&
         <div className="row-item">
           <span>个人简介</span>
           <div className="item-right">
             {person.userDesc}
           </div>
         </div>
       }

       <div className="row-item">
         <button onClick={() => this.props.changeIsEdit(true)}>修改资料</button>
       </div>
       <div className="warning-text">
         <img src={icon_warn} alt=""/>
         进行账号认证后，您将升级为优质三星用户，用户星级越高，越容易获得更多商务合作机会，立即进行 <Link to="/user/2">立即认证</Link>
       </div>

     </div>
   )
 }
}
