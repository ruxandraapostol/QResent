package com.project.qresent.pojo;

public class Profile {

    private String ldap;
    private String role;

    public Profile(String ldap, String role) {
        this.ldap = ldap;
        this.role = role;
    }

    public String getLdap() {
        return ldap;
    }

    public void setLdap(String ldap) {
        this.ldap = ldap;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
