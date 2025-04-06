package com.edulink.taskmanagement.payload.response;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String role;

    public UserResponse(Long id, String username, String email, String name, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.role = role;
    }
}