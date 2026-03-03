#include <iostream>
#include <string>
#include <vector>
#include <cctype>
#include <fstream>
#include "book.h"

using namespace std;

void Member::create_account() {
    //main
    string name, email, user, phone, password;
    //getting ids
    string nameId, emailId, userId, phoneId, passId;

    cout << "\t--------------       REGISTER ACCOUNT       --------------\n";

    cout << "Enter your name: ";
    getline(cin, name);

    cout << "Enter your email: ";
    cin >> email;

    cout << "Enter your username: ";
    cin >> user;

    while(true) {
        cout << "Enter your phone number: ";
        cin >> phone;
        
        if(phone.length() == 10) break;
        
        cout << "Phone number must be 10 digits long. Try again!\n";
    }

    cout << "Enter your password: ";
    cin >> password;
    cin.ignore();
  
    ifstream read("members.txt");

    if(read) {
        //read name, username, email, phone number, password
        while(getline(read, nameId, '|') &&
              getline(read, userId, '|') &&
              getline(read, emailId, '|') &&
              getline(read, phoneId, '|') &&
              getline(read, passId)) {
                if (userId == user) {
                    cout << "Username already exists!\n";
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

    ofstream write("members.txt", ios::app);
    if(write) {
        write << name << "|" << user << "|" << email << "|" << phone << "|" << password << endl;   

        cout << "Account created successfully!\n";

        write.close();
        login();   
    }
};

//void Member::access_member() {};

//void Librarian::access_librarian(const string& name, const string& empId) {};

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

    cout << "\t--------------       WELCOME BACK " << name << "! Manager ID: " << mgrId << "      --------------\n";

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