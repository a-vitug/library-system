#include <iostream>
#include <string>
#include <vector>
#include <cctype>
#include <fstream>
#include "book.h"

using namespace std;

//todo
void Member::genMemberId() {
    cout << "Generate Member ID\n";
};

int Member::create_account(string name, string user, string email, string phone, string password) {
    //getting ids
    string nameId, emailId, userId, phoneId, passId;

    ifstream read("members.txt");

    if(read) {
        //read name, username, email, phone number, password
        while(getline(read, nameId, '|') &&
              getline(read, userId, '|') &&
              getline(read, emailId, '|') &&
              getline(read, phoneId, '|') &&
              getline(read, passId)) {
                if (userId == user) {
                    return 1;
                }
                else if (emailId == email) {
                    return 2;
                }
                else if (phoneId == phone) {
                    return 3;
                }
        }
        read.close();
    } 

    ofstream write("members.txt", ios::app);

    if(write) {
        write << name << "|" << user << "|" << email << "|" << phone << "|" << password << endl;
        write.close();
        return 0; 
    }

    return -1;
};

void Member::access_member(const string& name, const string& memberId) {
    int choice;

    //cout << "\t--------------       WELCOME BACK " << name << "! MEMBER ID: " << memberId << "      --------------\n";

    do {
        cout << "\t               1. Loaned Books:\n";
        cout << "\t               2. Favorites:\n";
        cout << "\t               3. Check out book(s):\n";
        cout << "\t               4. Return book(s):\n";
        cout << "\t               5. Exit:\n";
        cout << "\t         Enter: ";
        cin >> choice;
        cin.ignore();
        cout << "\n";

        switch (choice) {
            case 1:
                cout << "Get loaned books\n";
                //getLoanedBook();
                break;
            case 2:
                //favorites[];
                cout << "Show Member's Favorite Books\n";
                break;
            case 3:
                checkout_book();
                break;
            case 4:
                return_book();
                break;
            case 5:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Error! Try again.\n";
                break;
        }        
    } while(choice != 5);
};

//todo
void Member::checkout_book() {
    cout << "Check out a book\n";
};
//todo
void Member::return_book() {
    cout << "Return a book\n";
};

void Librarian::access_librarian(const string& name, const string& empId) {
    int choice;

    //cout << "\t--------------       WELCOME BACK " << name << "! EMPLOYEE ID: " << empId << "      --------------\n";

    do {
        cout << "\t               1. TODO:\n";
        cout << "\t               2. TODO:\n";
        cout << "\t               3. Process Checking Out:\n";
        cout << "\t               4. Returning a Book:\n";
        cout << "\t               5. Exit:\n";
        cout << "\t         Enter: ";
        cin >> choice;
        cin.ignore();
        cout << "\n";

        switch (choice) {
            case 1:
                cout << "TODO";
                break;
            case 2:
                cout << "TODO";
                break;
            case 3:
                pCheckout_book();
                break;
            case 4:
                pReturn_book();
                break;
            case 5:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Error! Try again.\n";
                break;
        }        
    } while(choice != 5);
};

//todo
void Librarian::pCheckout_book() {
    cout << "Processing checking out a book\n";
};
//todo
void Librarian::pReturn_book() {
    cout << "Processing returning a book\n";
};


void Manager::create_employee() {
    //main
    string name, email, emp, phone, password;
    //getting ids
    string nameId, emailId, empId, phoneId, passId;

    cout << "\t--------------       REGISTER EMPLOYEE ACCOUNT       --------------\n";

    cout << "Enter employee's name: ";
    getline(cin, name);

    cout << "Enter employee's email: ";
    cin >> email;

    cout << "Enter employee's ID: ";
    cin >> emp;

    while(true) {
        cout << "Enter your employee's phone number: ";
        cin >> phone;
        
        if(phone.length() == 10) break;
        
        cout << "Phone number must be 10 digits long. Try again!\n";
    }

    cout << "Enter employee's password: ";
    cin >> password;
    cin.ignore();
  
    ifstream read("employee.txt");

    if(read) {
        //read name, employee id, email, phone number, password
        while(getline(read, nameId, '|') &&
              getline(read, empId, '|') &&
              getline(read, emailId, '|') &&
              getline(read, phoneId, '|') &&
              getline(read, passId)) {
                if (empId == emp) {
                    cout << "Employee ID already exists!\n";
                    return;
                }
                else if (emailId == email) {
                    cout << "Email already exists!\n";
                    return;
                }
                else if (phoneId == phone) {
                    cout << "Phone number already exists!\n";
                    return;
                }
        }
        read.close();
    } 

    ofstream write("employee.txt", ios::app);
    if(write) {
        write << name << "|" << emp << "|" << email << "|" << phone << "|" << password << endl;   

        cout << "Account created successfully!\n";

        write.close();
        login();   
    }
}

void Manager::create_manager() {
    string name, email, mgr, phone, password;
    string nameId, emailId, mgrId, phoneId, passId;

    cout << "\t--------------       REGISTER MANAGER ACCOUNT       --------------\n";

    cout << "Enter manager's name: ";
    getline(cin, name);

    cout << "Enter manager's email: ";
    cin >> email;

    cout << "Enter manager's ID: ";
    cin >> mgr;

    while(true) {
        cout << "Enter your manager's phone number: ";
        cin >> phone;
        
        if(phone.length() == 10) break;
        
        cout << "Phone number must be 10 digits long. Try again!\n";
    }

    cout << "Enter manager's password: ";
    cin >> password;
    cin.ignore();
  
    ifstream read("manager.txt");

    if(read) {
        //read name, manager id, email, phone number, password
        while(getline(read, nameId, '|') &&
              getline(read, mgrId, '|') &&
              getline(read, emailId, '|') &&
              getline(read, phoneId, '|') &&
              getline(read, passId)) {
                if (mgrId == mgr) {
                    cout << "Manager ID already exists!\n";
                    return;
                }
                else if (emailId == email) {
                    cout << "Email already exists!\n";
                    return;
                }
                else if (phoneId == phone) {
                    cout << "Phone number already exists!\n";
                    return;
                }
        }
        read.close();
    } 

    ofstream write("manager.txt", ios::app);
    if(write) {
        write << name << "|" << mgr << "|" << email << "|" << phone << "|" << password << endl;
        cout << "Account created successfully!\n";

        write.close();
        login();   
    }
}

void Manager::access_manager(const string& name, const string& mgrId) {
    int choice;

    do {
        cout << "\t               1. Create Employee Profile:\n";
        cout << "\t               2. Sales Report:\n";
        cout << "\t               3. Add Book:\n";
        cout << "\t               4. Remove Book:\n";
        cout << "\t               5. Exit:\n";
        cout << "\t         Enter: ";
        cin >> choice;
        cin.ignore();
        cout << "\n";

        switch (choice) {
            case 1:
                create_employee();
                break;
            case 2:
                //sales();
                break;
            case 3:
                //addBook();
                break;
            case 4:
                //removeBook();
                break;
            case 5:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Error! Try again.\n";
                break;
        }        
    } while(choice != 5);
}

bool User::login() {
    //main
    string name, email, user, phone, password, emp, mgr;
    //when getting ids
    string nameId, emailId, userId, phoneId, passId, empId, mgrId;

    bool found = false;
    int acc;

    cout << "\t--------------       LOGIN       --------------\n";
    cout << "\t               1. Login as Manager:\n";
    cout << "\t               2. Login as Employee:\n";
    cout << "\t               3. Login as Member:\n";
    cout << "\t               4. Exit:\n";
    cout << "\t         Enter: ";
    cin >> acc;
    cin.ignore();

    switch (acc)
    {
        case 1: //manager
            setRole(1);

            for(int i = 5; i > 0; i--){
                cout << "Enter your manager ID: ";
                cin >> mgrId;
                
                cout << "Enter your password: ";
                cin >> passId;
                cin.ignore();

                ifstream read("manager.txt");
                if(read) {
                    //read name, manager id, email, phone number, password
                    while(getline(read, name, '|') &&
                          getline(read, mgr, '|') &&
                          getline(read, email, '|') &&
                          getline(read, phone, '|') &&
                          getline(read, password)) {
                            if(mgrId == mgr && passId == password){
                                found = true;
                                cout << "\t--------------       WELCOME BACK " << name << "! MANAGER ID: " << mgrId << "      --------------\n";
                                break;
                            }
                    }
                }

                read.close();

                if(found) 
                    break;
                else {
                    cout << "Manager ID or password is incorrect! " << i-1 << " tries left!\n";
                    if (i == 1)
                    {
                        cout << "Too many failed attempts. Exiting...\n";
                        return false;
                    }               
                }
            }
            break;

        case 2: //employee
            setRole(2);

            for(int i = 5; i > 0; i--){
                cout << "Enter your employee ID: ";
                cin >> empId;
                
                cout << "Enter your password: ";
                cin >> passId;

                ifstream read("employee.txt");
                if(read) {
                    //read name, employee id, email, phone number, password
                    while(getline(read, name, '|') &&
                        getline(read, emp, '|') &&
                        getline(read, email, '|') &&
                        getline(read, phone, '|') &&
                        getline(read, password)) {
                            if(empId == emp && password == passId){
                                found = true;
                                cout << "\t--------------       WELCOME BACK " << name << "! EMPLOYEE ID: " << empId << "      --------------\n";
                                break;
                            }
                    }
                }

                read.close();

                if(found) 
                    break;
                else {
                    cout << "Employee ID or password is incorrect! " << i-1 << " tries left!\n";
                    if (i == 1)
                    {
                        cout << "Too many failed attempts. Exiting...\n";
                        return false;
                    }               
                }
            }
            break;

        case 3: //member
            setRole(3);

            for(int i = 5; i > 0; i--){
                cout << "Enter your username: ";
                cin >> userId;
                
                cout << "Enter your password: ";
                cin >> passId;

                ifstream read("members.txt");
                if(read) {
                    while(getline(read, name, '|') &&
                        getline(read, user, '|') &&
                        getline(read, email, '|') &&
                        getline(read, phone, '|') &&
                        getline(read, password)) {
                            if(user == userId && password == passId){
                                found = true;
                                cout << "\t--------------       WELCOME BACK " << name << "! MEMBER ID: " << user << "      --------------\n";
                                break;
                            }
                    }
                }
                read.close();

                if(found) 
                    break;
                else {
                    cout << "Username or password is incorrect! " << i-1 << " tries left!\n";
                    if (i == 1)
                    {
                        cout << "Too many failed attempts. Exiting...\n";
                        return false;
                    }               
                }
            }
            break;

        default:
            break;
    }

   return found;
}

bool User::web_login(int role, string inputId, string inputPass) {
    string name, id, email, phone, pass;
    string filename;

    if (role == 1) filename = "manager.txt";
    else if (role == 2) filename = "employee.txt";
    else filename = "members.txt";

    ifstream read(filename);
    if (!read) {
        std::cout << "DEBUG: Could not open file " << filename << std::endl;
        return false;
    }

    while (getline(read, name, '|') &&
           getline(read, id, '|') &&
           getline(read, email, '|') &&
           getline(read, phone, '|') &&
           getline(read, pass)) {
        
        if (id == inputId && pass == inputPass) {
            this->setId(id);
            this->setRole(role);
            read.close();
            return true;
        }
    }
    read.close();
    return false;
}