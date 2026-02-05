package com.aetheridentity.sdk.modules;

import com.aetheridentity.sdk.core.SessionManager;
import com.aetheridentity.sdk.core.Transport;
import com.aetheridentity.sdk.errors.SessionExpiredError;
import com.aetheridentity.sdk.types.UserProfile;
import com.aetheridentity.sdk.types.UserRoles;

import java.util.Collections;
import java.util.List;

/**
 * User management module.
 */
public class UserModule {
    
    private final Transport transport;
    private final SessionManager session;
    
    /**
     * Creates a new UserModule.
     *
     * @param transport The transport instance
     * @param session The session manager
     */
    public UserModule(Transport transport, SessionManager session) {
        this.transport = transport;
        this.session = session;
    }
    
    /**
     * Gets the current user's profile.
     *
     * @return The user profile
     */
    public UserProfile profile() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        return transport.get("/api/v1/users/me", accessToken, UserProfile.class);
    }
    
    /**
     * Gets the current user's roles.
     *
     * @return The list of user roles
     */
    public List<UserRoles> roles() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        UserProfile user = transport.get("/api/v1/userinfo", accessToken, UserProfile.class);
        
        UserRoles role = new UserRoles();
        role.setId(user.getId());
        role.setName(user.getRole());
        role.setPermissions(Collections.emptyList());
        
        return Collections.singletonList(role);
    }
    
    /**
     * Checks if the user has a specific permission.
     *
     * @param permission The permission to check
     * @return true if the user has the permission
     */
    public boolean hasPermission(String permission) {
        List<UserRoles> roles = roles();
        
        for (UserRoles role : roles) {
            if (role.getPermissions() != null && role.getPermissions().contains(permission)) {
                return true;
            }
        }
        
        return false;
    }
}
