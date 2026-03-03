#include <iostream>
#include <string>
#include "class/book.h"

using namespace std;

int main() {
    string userId, password;
    int choice, choice2;
    Member m;
    Librarian l;
    Manager o;
    User u;

    cout << "\t--------------       Welcome to the Library!       --------------\n";
    cout << "\t               1. Register as Member:\n";
    cout << "\t               2. Login:\n";
    cout << "\t               4. Exit:\n";
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
        u.login();

        if(u.getRole() == 1) {
            cout << "Accessing manager page...\n";
            o.access_manager();
            break;
        }
        else if(u.getRole() == 2) {
            //l.access_librarian();
            break;
        }
        else if(u.getRole() == 3) {
            cout << "Access denied. Exiting...\n";
            break;
        }
        else
            break;

    case 4:
        cout << "Exiting...\n";
        break;

    default:
        break;
    }

    return 0;
}