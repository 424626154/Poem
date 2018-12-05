'use strict'
/**
 * 用户协议
 * @flow
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView ,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import{
      StyleConfig,
      HeaderConfig,
      pstyles,
    } from '../AppUtil';

import{
      NavBack,
      }from '../custom/Custom';

const protocol = `在此特别提醒您（用户）在注册成为用户之前，请认真阅读本《用户协议》（以下简称“协议”），确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。除非您接受本协议所有条款，否则您无权注册、登录或使用本协议所涉服务。您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。本协议约定与用户之间关于此软件服务（以下简称“服务”）的权利义务。“用户”是指注册、登录、使用本服务的个人。本协议可由本app随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在本APP中查阅最新版协议条款。在修改协议条款后，如果用户不接受修改后的条款，请立即停止使用本app提供的服务，用户继续使用本app提供的服务将被视为接受修改后的协议。


一、账号注册

1、用户在使用本服务前需要注册一个账号。账号应当使用手机号码绑定注册，请用户使用尚未与账号绑定的手机号码，以及未被本app根据本协议封禁的手机号码注册账号。本app可以根据用户需求或产品需要对账号注册和绑定的方式进行变更，而无须事先通知用户。

2、用户注册时应当授权app公开及使用其个人信息方可成功注册账号。故用户完成注册即表明用户同意本app提取、公开及使用用户的信息。


二、用户个人隐私信息保护

1、如果本app发现或收到他人举报或投诉用户违反本协议约定的，本app有权不经通知随时对相关内容，包括但不限于用户资料、发贴记录进行审查、删除，并视情节轻重对违规账号处以包括但不限于警告、账号封禁 、设备封禁 、功能封禁 的处罚，且通知用户处理结果。

2、因违反用户协议被封禁的用户，可以自行与官方联系。其中，被实施功能封禁的用户会在封禁期届满后自动恢复被封禁功能。被封禁用户可提交申诉，官方将对申诉进行审查，并自行合理判断决定是否变更处罚措施。

3、用户理解并同意，本app有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应承担由此而产生的一切法律责任。

4、用户理解并同意，因用户违反本协议约定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，用户应当赔偿本app与合作公司、关联公司，并使之免受损害。


三、用户发布内容规范

1、本条所述内容是指用户使用本app的过程中所制作、上载、复制、发布、传播的任何内容，包括但不限于账号、名称、用户说明等注册信息及认证资料，或文字、语音、图片、视频、图文等发送、回复或自动回复消息和相关链接页面，以及其他使用账号或本服务所产生的内容。

2、用户不得利用账号或本服务制作、上载、复制、发布、传播如下法律、法规和政策禁止的内容：

(1) 反对宪法所确定的基本原则的；

(2) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；

(3) 损害国家荣誉和利益的；

(4) 煽动民族仇恨、民族歧视，破坏民族团结的；

(5) 破坏国家宗教政策，宣扬邪教和封建迷信的；

(6) 散布谣言，扰乱社会秩序，破坏社会稳定的；

(7) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；

(8) 侮辱或者诽谤他人，侵害他人合法权益的；

(9) 含有法律、行政法规禁止的其他内容的信息。

3、用户不得利用账号或本服务制作、上载、复制、发布、传播如下干扰正常运营，以及侵犯其他用户或第三方合法权益的内容：

(1) 含有任何性或性暗示的；

(2) 含有辱骂、恐吓、威胁内容的；

(3) 含有骚扰、垃圾广告、恶意信息、诱骗信息的；

(4) 涉及他人隐私、个人信息或资料的；

(5) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；

(6) 含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息。


四、使用规则

1、用户在本服务中或通过本服务所传送、发布的任何内容并不反映或代表，也不得被视为反映或代表本app的观点、立场或政策，本app对此不承担任何责任。

2、用户不得利用账号或本服务进行如下行为：

(1) 提交、发布虚假信息，或盗用他人头像或资料，冒充、利用他人名义的；

(2) 强制、诱导其他用户关注、点击链接页面或分享信息的；

(3) 虚构事实、隐瞒真相以误导、欺骗他人的；

(4) 利用技术手段批量建立虚假账号的；

(5) 利用账号或本服务从事任何违法犯罪活动的；

(6) 制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播，无论这些行为是否为商业目的；

(7) 其他违反法律法规规定、侵犯其他用户合法权益、干扰正常运营或未明示授权的行为。

3、用户须对利用账号或本服务传送信息的真实性、合法性、无害性、准确性、有效性等全权负责，与用户所传播的信息相关的任何法律责任由用户自行承担，与本app无关。

如因此给本app或第三方造成损害的，用户应当依法予以赔偿。

4、本app提供的服务中可能包括广告，用户同意在使用过程中显示本app和第三方供应商、合作伙伴提供的广告。除法律法规明确规定外，用户应自行对依该广告信息进行的交易负责，

对用户因依该广告信息进行的交易或前述广告商提供的内容而遭受的损失或损害，本app不承担任何责任。


五、其他

1、本app郑重提醒用户注意本协议中免除本app责任和限制用户权利的条款，请用户仔细阅读，自主考虑风险。未成年人应在法定监护人的陪同下阅读本协议。

2、本协议的效力、解释及纠纷的解决，适用于中华人民共和国法律。若用户和本app之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户同意将纠纷或争议提交遇本app住所地有管辖权的人民法院管辖。

3、本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效，对双方具有约束力。
`
// console.log(protocol)

type Props = {

};

type State = {

};

class ProtocolUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
        title:'用户协议',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(<View style={pstyles.nav_right}/>),
     });
    render(){
      return(
        <ScrollView style={pstyles.container}>
            <Text style={styles.protocol}>
              {protocol}
            </Text>
        </ScrollView>
      )
    }
}

const styles = StyleSheet.create({
    protocol:{
      padding:10,
      fontSize:18,
    }
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(ProtocolUI);
