package com.lndapp;

import lndmobile.Callback;
//import lndbindings.Lndbindings;

/**
 * Created by parth on 05/06/2018.
 */

public class lndcallbackinterface implements Callback {
    private final String TAG_RESPONSE = "LND_CALLED_BACK_WITH_DATA:";
    private final String TAG_ERROR = "LND_ERROR_CALLED_BACK_WITH_DATA";

    public void onResponse(byte[] p0){
        System.out.println(TAG_RESPONSE + p0);
    };

    public void onError(java.lang.Exception p0){
        System.out.println(TAG_ERROR + p0);
    };
}
