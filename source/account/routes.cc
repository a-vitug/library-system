#include "crow.h"
#include "class/book.h" // Ensure this is included to use the User class
#include "routes.h"

void setup_routes(crow::SimpleApp& app) {
    
    // This MUST match the action="/login" in your HTML
    CROW_ROUTE(app, "/login").methods(crow::HTTPMethod::Post)([](const crow::request& req) {
        auto params = req.get_body_params();
        
        // These strings must match the 'name' attribute in your HTML <input> tags
        std::string role_str = params.get("role");
        std::string user_id = params.get("username");
        std::string password = params.get("password");

        int role = std::stoi(role_str);

        // Create your User object and call the logic we fixed earlier
        User currentUser;
// Inside your /login POST route in routes.cc
if (currentUser.web_login(role, user_id, password)) {
    return crow::response(200, "Success!");
} else {
    // This sends them back to the login page and triggers the red box
    crow::response res;
    res.redirect("/?failed=true");
    return res;
}
    });
}