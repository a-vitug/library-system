#include "crow/mustache.h"
#include "crow.h"
#include "routes.h"

int main() {
    crow::SimpleApp app;
    crow::mustache::set_base("."); 
    
    // Call the function from routes.cc to load all URL paths and connects the login, home, and registration logic
    setup_routes(app);

    cout << "Library Server running on http://localhost:18080/home" << endl;
    app.port(18080)
       .multithreaded()
       .run();

    return 0;
}