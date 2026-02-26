#include <iostream>
#include <fstream>
#include <string>
#include <cctype>
#include "functions.h"

using namespace std;

void login(){
    string name, email, userId, phone, password, emp;
    string nameId, emailId, id, phoneNum, pass, empId, yn;

    bool member = false, employee = false, found = false;
    int acc;

    cout << "Enter (1) for member, Enter (2) for employee: ";
    cin >> acc;

    switch (acc)
    {
    case 1:
        member = true;

        for(int i = 5; i > 0; i--){
            cout << "Enter your username: ";
            cin >> userId;
            
            cout << "Enter your password: ";
            cin >> password;

            ifstream read("members.txt");
            if(read) {
                while(getline(read, nameId, '|') &&
                    getline(read, userId, '|') &&
                    getline(read, email, '|') &&
                    getline(read, phone, '|') &&
                    getline(read, password, '|')) {
                        id = userId;
                        pass = password;
                        if(userId == id && password == pass){
                            found = true;
                            cout << "Welcome back " << nameId;
                            break;
                        }
                }
            }
            read.close();

            if(found) break;
            else {
                cout << "Username or password is incorrect! " << i-1 << " tries left!\n";
                if (i == 1)
                {
                    cout << "Too many failed attempts. Exiting...\n";
                }                
            }
        }
        break;

    
    case 2:
        employee = true;

        for(int i = 3; i > 0; i--){
            cout << "Enter your employee ID: ";
            cin >> emp;
            
            cout << "Enter your password: ";
            cin >> password;

            ifstream read("employee.txt");
            if(read) {
                //read name, email, password, employee id
                while(getline(read, nameId, '|') &&
                    getline(read, emp, '|') &&
                    getline(read, email, '|') &&
                    getline(read, password, '|') &&
                    getline(read, empId, '|')) {
                        empId = emp;
                        pass = password;
                        if(empId == emp && password == pass){
                            found = true;
                            cout << "Welcome back " << nameId << "!\n";
                            break;
                        }
                }
            }

            read.close();

            if(found) break;
            else {
                cout << "Employee ID or password is incorrect! " << i-1 << " tries left!\n";
                if (i == 1)
                {
                    cout << "Too many failed attempts. Exiting...\n";
                }                
            }
        }
        break;

    default:
        break;
    }

/*

    if(member == true) {
        //access member login page
    }
    else if(employee == true) {
        //access employee login page
    }
*/

}