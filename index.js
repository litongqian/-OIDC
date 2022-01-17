// Fill in your client ID and client secret that you obtained
// while registering the application

//const clientID = '7e015d8ce32370079895'
//const clientSecret = '2b976af0e6b6ceea2b1554aa31d1fe94ea692cd9'

//dev环境飞书key
const clientID = 'dss-test'
const clientSecret = 'c8118052-be98-4f0d-9ed0-90c1e353625a'
const authorizationURI=`https://keycloak.dev.longbridge-inc.com/auth/realms/longbridge-inc/protocol/openid-connect/auth`;
const redirect_uri=`http://localhost:8080/api/rest_j/v1/user/oauth/auth`
const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');
const Base64=require("js-base64")
const qs= require('qs');

const app = new Koa();

const main = serve(path.join(__dirname + '/public'));

const oauth = async ctx => {
  debugger
  const requestToken = ctx.request.query.code;
  console.log('authorization code:', requestToken);



  let data={
    redirect_uri:redirect_uri,
    clientID:clientID,
    clientSecret:clientSecret,
    "grant_type":"authorization_code",
    code:requestToken
  }
  let token="Basic " +Base64.Base64.encode(clientID+":"+clientSecret);
  const tokenResponse = await axios({
    method: 'post',
    url: 'https://keycloak.dev.longbridge-inc.com/auth/realms/longbridge-inc/protocol/openid-connect/token',
    data:qs.stringify(data),
    headers: {
      accept: 'application/json',
      "content-type":"application/x-www-form-urlencoded",
      "Authorization":token,
    }
  });

  const accessToken = tokenResponse.data.access_token;
  console.log(`access token: ${accessToken}`);

  const result = await axios({
    method: 'post',
    url: `https://keycloak.dev.longbridge-inc.com/auth/realms/longbridge-inc/protocol/openid-connect/userinfo`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
  console.log(result.data);
  const name = result.data.name;

  ctx.response.redirect(`/welcome.html?name=${name}`);
};
debugger
app.use(main);
app.use(route.get('/api/rest_j/v1/user/oauth/auth', oauth));

app.listen(8080);








// val code :String= gatewayContext.getRequest.getQueryParams.get("code").head;
//     val state = gatewayContext.getRequest.getQueryParams.get("state");
        
//         var httpResponse = HttpRequest.post(GatewayConfiguration.BDP_SERVER_GATEWAY_TOKEN.getValue)
//           .form("grant_type","authorization_code")
//           .form("code",code)
//           .form(GatewayConfiguration.BDP_SERVER_GATEWAY_REDIRECT_URI.description, GatewayConfiguration.BDP_SERVER_GATEWAY_REDIRECT_URI.getValue)
//           .form(GatewayConfiguration.BDP_SERVER_GATEWAY_CLIENT_ID.description, GatewayConfiguration.BDP_SERVER_GATEWAY_CLIENT_ID.getValue)
//           .form(GatewayConfiguration.BDP_SERVER_GATEWAY_CLIENT_SECRET.description, GatewayConfiguration.BDP_SERVER_GATEWAY_CLIENT_SECRET.getValue)
//           .header("Content-Type","application/x-www-form-urlencoded")
//           .header("Authorization",token)
//           .execute();

//     val userToken = BDPJettyServerHelper.gson.fromJson(httpResponse.body(), classOf[java.util.Map[String, Object]])
    // var userInfo=fetchUserInfo(GatewayConfiguration.BDP_SERVER_GATEWAY_USERINFO.getValue,userToken.get("access_token").toString);
    // val feishuUser = BDPJettyServerHelper.gson.fromJson(userInfo, classOf[FeishuUser]);
    // val linkisUserDO = LinkisUserConverter.entity2DO(feishuUser);
    // var query = new LinkisUserQuery();
    // query.setEmail(linkisUserDO.getEmail);

    // //通过email查询用户列表,查看有没有用户
    // val userList: util.List[LinkisUserDO]= linkisUserService.searchLinkisUser(query);
    // if(CollectionUtils.isNotEmpty(userList)){
    //   val linkisUserSession = LinkisUserConverter.entity2DTO(userList.get(0));
    //   GatewaySSOUtils.setLoginUser(gatewayContext,linkisUserSession)
    // }else{
    //   linkisUserService.addLinkisUser(linkisUserDO);
    //   val linkisUserSession = LinkisUserConverter.entity2DTO(linkisUserDO);
    //   GatewaySSOUtils.setLoginUser(gatewayContext, linkisUserSession)
    // }

    // refreshRole(linkisUserDO.getEmail)

    // var message = Message.ok()
    //     message.setStatus(HttpServletResponse.SC_MOVED_TEMPORARILY)
    //     message
