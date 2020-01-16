package com.block;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.database.CursorIndexOutOfBoundsException;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.provider.ContactsContract;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.linsh.utilseverywhere.IntentUtils;
import com.linsh.utilseverywhere.Utils;

/**
 * Created by hurong_pc111 on 2018/9/19.
 */

public class NaviModule extends ReactContextBaseJavaModule {
    private static final String TAG = "MoxieSDK";
    private  static Activity mActivity;
    private static Handler mHandler = new Handler(Looper.getMainLooper());
    private Promise contactPromise;
    private final ActivityEventListener activityEventListener=new BaseActivityEventListener(){
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            super.onActivityResult(activity, requestCode, resultCode, data);
            try{
                if (requestCode==200&&resultCode == Activity.RESULT_OK) {
                    if (data!=null){
                        Uri uri=data.getData();
                        String[] contact=getPhoneContacts(uri);
                        if (contact!=null){
                                Log.d("444",contact[0]);
                                contactPromise.resolve(contact[0]+","+contact[1].replaceAll(" ",""));
                        }else{
                            contactPromise.resolve("");
                        }
                    }else{
                        contactPromise.resolve("");
                    }
                }
            }catch (Exception e){
                Log.d("333",e.getMessage());
                contactPromise.resolve("");
            }

        }
    };
    private String[] getPhoneContacts(Uri uri) {
        try {
            String[] contact = new String[2];
            //得到ContentResolver对象
            ContentResolver cr = getCurrentActivity().getContentResolver();
            //取得电话本中开始一项的光标
            Cursor cursor = cr.query(uri, null, null, null, null);
            if (cursor != null) {
                cursor.moveToFirst();
                //取得联系人姓名
                int nameFieldColumnIndex = cursor.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME);
                contact[0] = cursor.getString(nameFieldColumnIndex);
                //取得电话号码
                String ContactId = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts._ID));
                Cursor phone = cr.query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null, ContactsContract.CommonDataKinds.Phone.CONTACT_ID + "=" + ContactId, null, null);
                if (phone != null) {
                    phone.moveToFirst();
                    contact[1] = phone.getString(phone.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
                }
                phone.close();
                cursor.close();
            } else {
                return null;
            }
            return contact;
        } catch (CursorIndexOutOfBoundsException e) {
            return null;
        }
    }
    public NaviModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.d("ddddddd",reactContext+"");
        reactContext.addActivityEventListener(activityEventListener);
    }

    public static void initActivity(Activity activity) {
        mActivity = activity;
    }
    private static void runOnMainThread(Runnable task) {
        mHandler.post(task);
    }

    @Override
    public String getName() {

        return "NaviModule";
    }
    @ReactMethod
    public void openSettings(){
        Utils.init(getReactApplicationContext());
        IntentUtils.gotoPermissionSetting();
    }
    @ReactMethod
    public void openContact(final Promise promise){
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject("", "Activity don't exist");
            return;
        }

        // Store the promise to resolve/reject when picker returns data
        contactPromise = promise;

        try {
            Intent intent = new Intent(Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI);
            currentActivity.startActivityForResult(intent,200);
        } catch (Exception e) {
            contactPromise.reject("", e.getMessage());
            contactPromise = null;
        }

    }

    /**
     * js页面跳转到activity 并传数据
     * @param name
     */
    @ReactMethod
    public void startActivityByClassName(String name){
        try{
            Activity currentActivity = getCurrentActivity();
            if(null!=currentActivity){
                Class aimActivity = Class.forName(name);
                Intent intent = new Intent(currentActivity,aimActivity);
                currentActivity.startActivity(intent);
            }
        }catch(Exception e){

            throw new JSApplicationIllegalArgumentException(
                    "无法打开activity页面: "+e.getMessage());
        }
    }
    @ReactMethod
    public void callPhone(String number) {
        //用intent启动拨打电话
        Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + number));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mActivity.startActivity(intent);
    }

}
