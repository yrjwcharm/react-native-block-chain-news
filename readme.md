 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/3.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/4.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/5.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/6.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/7.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/8.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/9.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/10.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/11.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/12.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/13.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/14.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/15.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/16.jpg)
 
 ![image](https://github.com/yrjwcharm/react-native-block-chain-news/blob/master/screen/17.jpg)



####Android


┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ Zr8dxT--z5f8Vsk9TLyXnU0zfOTqb62e9b40-897b-4dce-a7e0-282e1d84166e │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ PP8DhQ8Aw7fulgkEBTwNb_k2iKUBb62e9b40-897b-4dce-a7e0-282e1d84166e │
└────────────┴──────────────────────────────────────────────────────────────────┘



####IOS


┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ 6jSZRlm0Sb-MrdCcwZbSU7d_ZIzBb62e9b40-897b-4dce-a7e0-282e1d84166e │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ i2SUCxtrQIEfE9_RNb3SgrhN7Hbfb62e9b40-897b-4dce-a7e0-282e1d84166e │
└────────────┴──────────────────────────────────────────────────────────────────┘


##### code-push  登录 token  
    6f6501cc0ca36048d7d5421d3abfd1030970336c
#####  添加项目 
  code-push app add BlOCK_Android android react-native
#####  清除热部署
  code-push deployment clear BlOCK_Android Production
  code-push deployment clear BlOCK_Android Staging
####  查询部署环境的 key
code-push deployment ls  BLOCK_Ios  -k
#### 删除项目: 
code-push app remove [app名称]
#### 列出账号下的所有项目:
code-push app list
#### 显示登录的token
 code-push access-key ls
#### 删除某个access-key
 code-push access-key rm <accessKey>
####  添加协作人员
 code-push collaborator add <appName> next@126.com
#### 部署一个环境
code-push deployment add <appName> <deploymentName>
#### 删除部署
code-push deployment rm <appName>
#### 列出应用的部署
 code-push deployment ls <appName>
#### 查看部署的历史版本信息
code-push deployment history <appName> <deploymentNmae>
#### 重命名一个部署
code-push deployment rename <appName> <currentDeploymentName> <newDeploymentName>
####  发布热更新
code-push release-react BlOCK_Android android --t 1.0.0 --dev false --d Staging --des "1.修复已知BUG\n2.优化操作流程" --m true
code-push release-react BlOCK_Ios ios --t 1.0.0 --dev false --d Staging --des "1.修复已知BUG\n2.优化操作流程" --m true



