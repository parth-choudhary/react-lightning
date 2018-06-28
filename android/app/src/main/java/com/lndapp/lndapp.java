package com.lndapp;

/**
 * Created by parth on 04/06/2018.
 */


import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.google.protobuf.ByteString;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;
import java.util.Arrays;

import lnrpc.Rpc;


public class lndapp extends ReactContextBaseJavaModule
{
    public lndapp(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return "lnd";
    }
//    @ReactMethod
//public void bench(final Callback successCallback){
//    go.primer.Primer.bench();
//    successCallback.invoke();
//}
//    @ReactMethod
//    public void processImage(String path, int iters, int size, int workers, int mode, final Callback successCallback) {
//        lndmobile.Lndmobile.start(appDir, callback){
//
//        };
//        go.primer.Primer.process(path, iters, size, workers, mode, new go.primer.OnIterationDone(){
//            @Override
//            public void do_() {
//                successCallback.invoke();
//            }
//        });
//    }

    private byte[] hextobyte(String appDir) {
        int len = appDir.length();
        byte[] datanew = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            datanew[i / 2] = (byte) ((Character.digit(appDir.charAt(i), 16) << 4)
                    + Character.digit(appDir.charAt(i+1), 16));
        }
        return datanew;
    }

    private final static char[] hexArray = "0123456789ABCDEF".toCharArray();
    private  String bytesToHex(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        for ( int j = 0; j < bytes.length; j++ ) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = hexArray[v >>> 4];
            hexChars[j * 2 + 1] = hexArray[v & 0x0F];
        }
        return new String(hexChars);
    }

    @ReactMethod
    public void Start(String appDir, final Callback successCallback, final Callback errorCallback) {
        final String TAG = "LND";

        final String TAG_START = "LND_HAS_BEEN_STARTED";
        Log.d(TAG, appDir);
        System.out.println(appDir);
        System.out.println(successCallback);
//        lndmobile.Lndmobile

        try {
            lndmobile.Lndmobile.start(appDir, new lndcallbackinterface(){
                @Override
                public void onResponse(byte[] p0) {
                    System.out.println(new String(p0));
                    successCallback.invoke(new String(p0));
                }
                @Override
                public void onError(java.lang.Exception p0) {
                    System.out.println(p0);
                    errorCallback.invoke();
                }
            });
//            successCallback.invoke(TAG_START);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void getInfo(String appDir, final Callback successCallback, final Callback errorCallback) {
        final String TAG_START = "LND_HAS_BEEN_STARTED";
        System.out.println(appDir);
        byte[] datanew = hextobyte(appDir);


        Rpc.NewAddressRequest.Builder das = Rpc.NewAddressRequest.newBuilder();
        das.setType(Rpc.NewAddressRequest.AddressType.NESTED_PUBKEY_HASH);
        byte[] ssd = das.build().toByteArray();


        try {
            lndmobile.Lndmobile.newAddress(ssd, new lndcallbackinterface(){
                @Override
                public void onResponse(byte[] p0) {
                    final String TAG_START = "UTF-8";
//                    byte[] byteArr = appDir.getBytes();
                    System.out.println(Arrays.toString(p0));
                    System.out.println(new String(p0));
                    try {
                        System.out.println(Rpc.GetInfoResponse.parseFrom(p0).toString());
                    } catch (IOException e){
                        System.out.println(e);
                    }
                    successCallback.invoke(Arrays.toString(p0));
                }
                @Override
                public void onError(java.lang.Exception p0) {
                    System.out.println(p0);
                    errorCallback.invoke();
                }
            });
//
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }


    @ReactMethod
    public void reflection(final String methodName, String parameter, final Callback successCallback, final Callback errorCallback) {
        final String TAG_START = "LND_HAS_BEEN_STARTED";
        final String FUNCTION_CALL_STARTED = "FUNCTION_CALL_STARTED";
        System.out.println(FUNCTION_CALL_STARTED);
        byte[] param = hextobyte(parameter);

        try {
            Method method = lndmobile.Lndmobile.class.getDeclaredMethod(methodName, byte[].class, lndmobile.Callback.class);
            System.out.println(TAG_START);
            System.out.println(methodName);
            method.invoke(null, param,  new lndcallbackinterface(){
                @Override
                public void onResponse(byte[] p0) {
                    final String TAG_START = "UTF-8";
//                    byte[] byteArr = appDir.getBytes();
                    System.out.println(Arrays.toString(p0));
//                    System.out.println(new String(p0));
                    if(p0 == null){
                        successCallback.invoke(methodName + ": executed");
                    } else {
                        String hex = bytesToHex(p0);
                        successCallback.invoke(methodName + ":" + hex);
                    }
                }
                @Override
                public void onError(java.lang.Exception p0) {
                    System.out.println(p0);
                    errorCallback.invoke();
                }
            });
        } catch (Exception e) {
            System.out.println(e);
            errorCallback.invoke(e.getMessage());
        }
    }


    @ReactMethod
    public void newAddress(String appDir, final Callback successCallback, final Callback errorCallback) throws UnsupportedEncodingException {
        final String TAG_START = "LND_HAS_BEEN_STARTED";


        Rpc.NewAddressRequest.Builder das = Rpc.NewAddressRequest.newBuilder();
        das.setType(Rpc.NewAddressRequest.AddressType.NESTED_PUBKEY_HASH);
        byte[] ssd = das.build().toByteArray();

        System.out.println(das.toString());
        System.out.println(Arrays.toString(ssd));
        System.out.println(new String(ssd));

//        lndmobile.Lndmobile.getNetworkInfo();
        Rpc.GenSeedRequest.Builder seed = Rpc.GenSeedRequest.newBuilder();
        ByteString chi = ByteString.copyFrom("password", "utf8");
        seed.setAezeedPassphrase(chi);
        seed.setSeedEntropy(chi);
        byte[] seeds = seed.build().toByteArray();
        System.out.println(seeds);
        System.out.println(chi);
        System.out.println(Arrays.hashCode(seeds));






        Rpc.InitWalletRequest.Builder init = Rpc.InitWalletRequest.newBuilder();
        init.setWalletPassword(ByteString.copyFrom("password", "utf8"));
        init.setAezeedPassphrase(ByteString.copyFrom("password", "utf8"));
//        init.setCipherSeedMnemonic(1, seeds);
        byte [] initbyte = init.build().toByteArray();
//        unlock.se
//        byte[] ssd = unlock.build().toByteArray();

//        System.out.println(ssd);
//        System.out.println(Arrays.toString(ssd));
//        System.out.println(new String(ssd));
//
//
        System.out.println(init.toString());
//        byte[] datanew = hextobyte(appDir);
//        System.out.println(Arrays.toString(datanew));




//        System.out.println(byteArr);
//        byte[] bit = {'8', '1'};
//        System.out.println(new String(bit));
//        lndcallbackinterface.class.on
        Rpc.UnlockWalletRequest.Builder tat = Rpc.UnlockWalletRequest.newBuilder();
        tat.setWalletPassword(ByteString.copyFrom("password", "utf8"));
        Rpc.WalletBalanceRequest.Builder wallreq = Rpc.WalletBalanceRequest.newBuilder();
//        wallreq.
//        lndmobile.Lndmobile.n


        try {
            lndmobile.Lndmobile.initWallet(initbyte, new lndcallbackinterface(){
                @Override
                public void onResponse(byte[] p0) {
//                    System.out.println(new String(p0));
                    System.out.println(TAG_START);
                    try {
                        System.out.println(Rpc.GenSeedResponse.parseFrom(p0));
                        successCallback.invoke(Rpc.GenSeedResponse.parseFrom(p0).toString());
                    } catch(IOException e){
                        System.out.println(e);
                    }

                    System.out.println(Arrays.toString(p0));
                    System.out.println(TAG_START);
                    successCallback.invoke(p0);
                }
                @Override
                public void onError(java.lang.Exception p0) {
                    System.out.println(p0);
                    errorCallback.invoke();
                }
            });
//            successCallback.invoke(TAG_START);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }

    }
}
//    Method[] allMethods = lndmobile.Lndmobile.class.getDeclaredMethods();
//            System.out.println(allMethods);
//                    for (Method m : allMethods) {
//                    String mname = m.getName();
//
//                    if (mname.startsWith("unlockWallet")) {
//                    System.out.println(m.getParameterTypes().toString());
//                    System.out.println(mname);
//                    Type[] pType = m.getGenericParameterTypes();
//                    for (Type t : pType) {
//                    String pname = t.toString();
//                    System.out.println(pname);
//                    }
//                    }
//
//
//                    }