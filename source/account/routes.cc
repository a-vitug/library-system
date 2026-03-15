#include "crow.h"
#include "class/book.h"
#include "routes.h"
#include <fstream>
#include <sstream>
#include <iostream>

using namespace std;

void setup_routes(crow::SimpleApp& app) {

    // GET home page
    CROW_ROUTE(app, "/home")([](){
        ifstream file("front-end/templates/webpage.html");
        if(!file.is_open()) return crow::response(500, "webpage.html not found");
        stringstream buffer;
        buffer << file.rdbuf();
        return crow::response(buffer.str());
    });

    // GET create account
    CROW_ROUTE(app, "/create-account")([](){
        ifstream file("front-end/templates/create-account.html");
        if(!file.is_open()) return crow::response(500, "create-account.html not found");
        stringstream buffer;
        buffer << file.rdbuf();
        return crow::response(buffer.str());
    });

    // POST create account
    CROW_ROUTE(app, "/create-account").methods(crow::HTTPMethod::Post)([](const crow::request& req){
        auto params = req.get_body_params();

        string name = params.get("name");
        string user = params.get("username");
        string email = params.get("email");
        string phone = params.get("phone");
        string password = params.get("password");

        Member m;
        int status = m.create_account(name, user, email, phone, password);
        
        crow::response res;
        if(status == 0) {
            cout << "Account successfully created for: " << name << " (" << user << ")" << endl;
            res.redirect("/log-in?signup=success");             
        } else {
            res.redirect("/create-account?error=" + to_string(status));
        }

        return res;
    });

    // GET login page
    CROW_ROUTE(app, "/log-in")([](const crow::request& req){
        ifstream file("front-end/templates/log-in.html");
        if(!file.is_open()) return crow::response(500, "log-in.html not found");

        stringstream buffer;
        buffer << file.rdbuf();
        auto page = crow::mustache::compile(buffer.str());
        
        crow::mustache::context ctx;
        bool failed = (req.url_params.get("failed") != nullptr);
        ctx["error"] = failed;
        ctx["error_text"] = failed ? "Invalid ID or Password." : "";

        return crow::response(page.render(ctx));
    });

    // POST login page
    CROW_ROUTE(app, "/log-in").methods(crow::HTTPMethod::Post)([](const crow::request& req) {
        auto params = req.get_body_params();
        string role_str = params.get("role");
        string user_id = params.get("username");
        string password = params.get("password");

        User currentUser; 
        if (currentUser.web_login(stoi(role_str), user_id, password)) {
            crow::response res;
            res.redirect("/home"); 
            return res;
        } else {
            crow::response res;
            res.redirect("/log-in?failed=true");
            return res;
        }
    });

    // carousel
    CROW_ROUTE(app, "/books-carousel.html")([](){
        ifstream file("front-end/templates/books-carousel.html");
        stringstream buffer;
        buffer << file.rdbuf();
        return crow::response(buffer.str());
    });

    CROW_ROUTE(app, "/<string>")
    ([](std::string name){
        std::string path = "front-end/templates/genre/" + name + ".html";
        std::ifstream file(path);
        if(!file.is_open()) return crow::response(404, "Genre not found");
        
        std::stringstream buffer;
    buffer << file.rdbuf();
    
    crow::response res(buffer.str());
    res.set_header("Content-Type", "text/html");
    return res;
});

   
}