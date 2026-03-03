#include <iostream>
#include <string>
#include "class/book.h"

using namespace std;

int main() {
    Member m;
    Librarian l;
    Manager o;
    User u;

    int choice;

    do {
        cout << "\t--------------       Welcome to the Library!       --------------\n";
        cout << "\t               1. Register as Member:\n";
        cout << "\t               2. Login:\n";
        cout << "\t               4. Exit:\n";
        cout << "\t         Enter: ";
        cin >> choice;
        cin.ignore();
        cout << "\n";

        switch (choice) {
            case 1:
                m.create_account();
                break;

            case 2:
                if(u.login()) {
                    int role{u.getRole()};
                    string name{u.getName()};
                    string id{u.getId()};

                    if(role == 1) {
                        o.setManagerId(id);
                        o.access_manager(name, id);
                    } else if(role == 2) {
                        l.setEmployeeId(id);
                        //l.access_librarian(name, id);
                    } else if(role == 3) {
                        //m.access_member();
                    }

                    break;
                } else {
                    cout << "Login failed! Try again.\n";
                }
                break;

            case 4:
                cout << "Exiting...\n";
                break;

            default:
                cout << "Error! Try again.\n";
                break;
        }
    } while(choice != 4);

    return 0;
}