#include "crow/mustache.h"
#include "crow.h"
#include "routes.h"
#include <iostream>
#include <string>

using namespace std;

int main() {
    crow::SimpleApp app;

    crow::mustache::set_base("."); 

    // 1. Main Home Page
    CROW_ROUTE(app, "/home")([](){
        ifstream file("front-end/templates/webpage.html");
        if(!file.is_open()) {
            return crow::response(500, "Webpage not found");
        }
        stringstream buffer;
        buffer << file.rdbuf();
        return crow::response(buffer.str());
    });

    // 2. Carousel Page
    CROW_ROUTE(app, "/books-carousel.html")([](){
        ifstream file("front-end/templates/books-carousel.html");
        if(!file.is_open()) {
            return crow::response(500, "Carousel file not found");
        }
        stringstream buffer;
        buffer << file.rdbuf();
        return crow::response(buffer.str());
    });

    // 3. Login Page
    CROW_ROUTE(app, "/log-in")([](const crow::request& req){
        ifstream file("front-end/templates/log-in.html");
        // ... rest of mustache logic for error handling ...
        stringstream buffer;
        buffer << file.rdbuf();
        auto page = crow::mustache::compile(buffer.str());
        crow::mustache::context ctx;
        bool failed = (req.url_params.get("failed") != nullptr);
        ctx["error"] = failed;
        ctx["error_text"] = failed ? "Invalid ID or Password." : "";
        return crow::response(page.render(ctx));
    });
    
    setup_routes(app);
    app.port(18080).run();
    return 0;
}