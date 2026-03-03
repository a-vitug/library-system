#include <iostream>
#include <string>
#include "class/book.h"

using namespace std;

int main() {
    /*
        User users;
        users.setName("John Doe");
        cout << "Hello, " << users.getName() << "!\n";

        users.setRole(3);
        cout << users.getRole();
    */
   
    string userId, password;
    int choice;
    Member m;
    Librarian l;
    Manager o;

    cout << "\t--------------       Welcome to the Library!       --------------\n";
    cout << "\t               1. Register as Member:\n";
    cout << "\t               2. Login as Member:\n";
    cout << "\t               3. Login as Employee:\n";
    cout << "\t               4. Create Employee Profile:\n";
    cout << "\t               5. Exit:\n";

    cout << "\t         Enter: ";
    cin >> choice;
    cin.ignore();
    cout << "\n";

    switch (choice)
    {
    case 1:
        m.create_account();
        break;

    case 2:
        m.login();
        break;

    case 3:
        l.login();
        break;

    case 4:
        // needs manager id to access
        o.create_employee();
        break;

    case 5:
        cout << "Exiting...\n";
        break;

    default:
        break;
    }

    return 0;
}