package com.block;

import android.Manifest;
import android.content.DialogInterface;
import android.database.Cursor;
import android.os.Handler;
import android.os.Looper;
import android.provider.ContactsContract;
import android.support.v7.app.AlertDialog;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.linsh.utilseverywhere.IntentUtils;
import com.linsh.utilseverywhere.Utils;
import com.tbruyelle.rxpermissions2.Permission;
import com.tbruyelle.rxpermissions2.RxPermissions;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.reactivex.functions.Consumer;

/**
 * Created by fandongyang on 2018/3/2.
 */

public class PhoneMailList extends ReactContextBaseJavaModule {
    /**
     * 得到手机通讯录联系人信息
     **/
    private JSONObject object;  //JSONObject对象，处理一个一个的对象
    private JSONObject object2;
    private JSONArray jsonArray;//JSONObject对象，处理一个一个集合或者数组
    private static Handler mHandler = new Handler(Looper.getMainLooper());
    private AlertDialog dialog;
    private static void runOnMainThread(Runnable task) {
        mHandler.post(task);
    }

    public PhoneMailList(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PhoneMailList";
    }

    @ReactMethod
    public void getMailList(final Callback successCallback) throws JSONException {
        runOnMainThread(new Runnable() {
            @Override
            public void run() {
                RxPermissions rxPermissions=new RxPermissions(getCurrentActivity());
                rxPermissions.requestEach(Manifest.permission.READ_CONTACTS).subscribe(new Consumer<Permission>() {
                    @Override
                    public void accept(Permission permission) throws Exception {
                        if(permission.granted){
                            List<Map<String, String>> list = new ArrayList<Map<String, String>>();
                            //获取手机联系人
                            Cursor cursor = getCurrentActivity().getContentResolver().query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null, null, null, null);
                            JSONObject json = new JSONObject();
                            String jsonString = null;
                            jsonArray = new JSONArray();
                            object = new JSONObject();

                            while (cursor.moveToNext()) {

                                Map<String, String> map = new HashMap<String, String>();

                                int indexPeopleName = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME);    // people name
                                int indexPhoneNum = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER);            // phone number

                                String strPeopleName = cursor.getString(indexPeopleName);
                                String strPhoneNum = cursor.getString(indexPhoneNum);

                                object2 = new JSONObject();
                                try {
                                    object2.put("peopleName", strPeopleName);
                                    object2.put("phoneNum", strPhoneNum.replace(" ", "").replace("-", ""));
                                    jsonArray.put(object2);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            }

                            try {
                                object.put("ContactList", jsonArray);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            jsonString = object.toString();
                            Log.e("联系人列表", jsonString);
                            System.out.print("通讯录数据==>" + jsonString);
                            successCallback.invoke(jsonString);
                        }else{
                            AlertDialog.Builder builder = new AlertDialog.Builder(getCurrentActivity());
                            //    设置Title的图标
                            builder.setIcon(R.drawable.warn);
                            builder.setCancelable(false);
                            //    设置Title的内容
                            builder.setTitle("开启通讯录权限");
                            //    设置Content来显示一个信息
                            builder.setMessage("通讯录权限已被禁止,请在权限管理中开启。现在设置?");
                            //    设置一个PositiveButton
                            builder.setPositiveButton("设置", new DialogInterface.OnClickListener()
                            {
                                @Override
                                public void onClick(DialogInterface dialog, int which)
                                {
                                        Utils.init(getReactApplicationContext());
                                        IntentUtils.gotoPermissionSetting();
                                        dialog.dismiss();
                                }
                            });
                            //    设置一个NegativeButton
                            builder.setNegativeButton("取消", new DialogInterface.OnClickListener()
                            {
                                @Override
                                public void onClick(DialogInterface dialog, int which)
                                {
//                                    Toast.makeText(mActivity, "negative: " + which, Toast.LENGTH_SHORT).show();
                                }
                            });
                            //    设置一个NeutralButton
//                            builder.setNeutralButton("忽略", new DialogInterface.OnClickListener()
//                            {
//                                @Override
//                                public void onClick(DialogInterface dialog, int which)
//                                {
//                                    Toast.makeText(mActivity, "neutral: " + which, Toast.LENGTH_SHORT).show();
//                                }
//                            });
                            //    显示出该对话框
                            dialog=builder.create();
                            dialog.show();
                        }
                    }
                });
            }
        });


    }
}
