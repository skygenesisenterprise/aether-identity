package com.aetheridentity.sdk.types;

import java.util.List;

/**
 * User roles information.
 */
public class UserRoles {
    private String id;
    private String name;
    private List<String> permissions;
    
    public UserRoles() {}
    
    public UserRoles(String id, String name, List<String> permissions) {
        this.id = id;
        this.name = name;
        this.permissions = permissions;
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public List<String> getPermissions() {
        return permissions;
    }
    
    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}
