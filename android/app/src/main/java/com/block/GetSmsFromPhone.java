package com.block;

import android.Manifest;
import android.content.ContentResolver;
import android.content.DialogInterface;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.support.annotation.RequiresApi;
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

import java.text.SimpleDateFormat;
import java.util.Date;

import io.reactivex.functions.Consumer;

public class GetSmsFromPhone extends ReactContextBaseJavaModule {
    private AlertDialog dialog;
    private Uri SMS_INBOX = Uri.parse("content://sms/");
    private JSONObject object;  //JSONObject对象，处理一个一个的对象
    private JSONArray jsonArray;//JSONObject对象，处理一个一个集合或者数组
    private JSONObject jsonObject;  //JSONObject对象，处理一个一个的对象
    public GetSmsFromPhone(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    private static Handler mHandler = new Handler(Looper.getMainLooper());
    private static void runOnMainThread(Runnable task) {
        mHandler.post(task);
    }
    @Override
    public String getName() {
        return "GetSmsFromPhone";
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @ReactMethod
    public void getSms(final Callback successCallback) throws JSONException {
        runOnMainThread(new Runnable() {
            @Override
            public void run() {
                RxPermissions rxPermissions=new RxPermissions(getCurrentActivity());
                rxPermissions.requestEach(Manifest.permission.READ_SMS).subscribe(new Consumer<Permission>() {
                    @Override
                    public void accept(Permission permission) throws Exception {
                        if(permission.granted){
                            ContentResolver cr = getReactApplicationContext().getContentResolver();
                            String[] projection = new String[]{"_id", "address", "person", "body", "date", "type"};
                            Cursor cur = cr.query(SMS_INBOX, projection, null, null, "date desc");
                            if (null == cur) {
                                return;
                            }
                            String jsonString;
                            jsonArray = new JSONArray();
                            object = new JSONObject();
                            while (cur.moveToNext()) {
                                String number = cur.getString(cur.getColumnIndex("address"));//手机号
                                String body = cur.getString(cur.getColumnIndex("body"));//短信内容
                                String date = cur.getString(cur.getColumnIndex("date"));//短信时间
                                SimpleDateFormat sd = new SimpleDateFormat("yyyy&MM&dd&HH:mm:ss");
                                String sendTime = sd.format(new Date(Long.parseLong(date)));
                                jsonObject = new JSONObject();
                                //至此就获得了短信的相关的内容, 以下是把短信加入map中，构建listview,非必要。
                                try {
                                    jsonObject.put("sendNumber", number);
                                    jsonObject.put("sendTime", sendTime);
                                    jsonObject.put("messageContent", body);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                jsonArray.put(jsonObject);
                            }
                            try {
                                object.put("SmsList", jsonArray);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            jsonString = object.toString();
                            Log.i("短信内容是===>", jsonString);
                            if (!cur.isClosed()) {
                                cur.close();
                                cur = null;
                            }
                            successCallback.invoke(jsonString);
                        }else{
                            AlertDialog.Builder builder = new AlertDialog.Builder(getCurrentActivity());
                            //    设置Title的图标
                            builder.setIcon(R.drawable.warn);
                            builder.setCancelable(false);
                            //    设置Title的内容
                            builder.setTitle("开启短信权限");
                            //    设置Content来显示一个信息
                            builder.setMessage("短信权限已被禁止,请在权限管理中开启。现在设置?");
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
                            dialog = builder.create();
                            dialog.show();
                        }
                    }
                });

            }
        });

    }
}
