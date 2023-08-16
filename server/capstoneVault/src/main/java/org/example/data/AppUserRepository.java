package org.example.data;

import org.example.models.AppUser;


public interface AppUserRepository {

    AppUser findByUsername(String username);

    AppUser create(AppUser user);

    void update(AppUser user);

}