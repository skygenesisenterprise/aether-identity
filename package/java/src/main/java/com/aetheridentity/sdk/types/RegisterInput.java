package com.aetheridentity.sdk.types;

/**
 * Registration input.
 */
public class RegisterInput {
    private String email;
    private String password;
    private String name;
    
    public RegisterInput() {}
    
    public RegisterInput(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    public RegisterInput(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
