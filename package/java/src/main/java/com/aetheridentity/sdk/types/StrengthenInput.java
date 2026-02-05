package com.aetheridentity.sdk.types;

/**
 * Strengthen authentication input.
 */
public class StrengthenInput {
    private String type;
    private String value;
    
    public static final String TYPE_TOTP = "totp";
    public static final String TYPE_EMAIL = "email";
    public static final String TYPE_SMS = "sms";
    
    public StrengthenInput() {}
    
    public StrengthenInput(String type, String value) {
        this.type = type;
        this.value = value;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getValue() {
        return value;
    }
    
    public void setValue(String value) {
        this.value = value;
    }
}
