## **🍻欢迎使用pms-api**

光棱前端接口请求工具,为方便复用封装

##### **🍺安装**

```
yarn add pms-api
```

##### **🍺初始化**

```
export const PMSAPI = creatNetTool('这里填写uaid,例如10001', '这里填写apiSecret', 'http://192.168.10.88:8000/api');
```

##### **🍺使用**

```
PMSAPI.setToken('这里是用户的token');
```

```
const ret = await PMSAPI.net('/login', 'post', { code:'参数code' });
```


