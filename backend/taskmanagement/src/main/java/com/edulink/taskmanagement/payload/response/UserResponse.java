package com.edulink.taskmanagement.payload.response;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String role;

    public UserResponse(Long id, String email, String name, String role) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }
}