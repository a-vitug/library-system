#include "crow/mustache.h"
#include "crow.h"
#include "routes.h"
#include <iostream>

int main() {
    crow::SimpleApp app;

    // 1. Set the base to the root of your project folder
    crow::mustache::set_base("."); 

    CROW_ROUTE(app, "/")([](const crow::request& req){
        // 1. Manually read the file from disk using standard C++
        std::ifstream file("front-end/templates/log-in.html");
        if(!file.is_open()) {
            return crow::response(500, "C++ cannot find the file at front-end/templates/log-in.html");
        }

        std::stringstream buffer;
        buffer << file.rdbuf();
        std::string html_content = buffer.str();

        // 2. Feed that string into the Mustache engine manually
        auto page = crow::mustache::compile(html_content);
        
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