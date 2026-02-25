#include <iostream>
#include <fstream>
#include <string>
#include <cctype>
#include "functions.h"

using namespace std;

void create_account() {
    string email, userId, phone, password;
    string emailId, id, phoneNum, pass, yn;
    bool exists = false;

    cout << "Enter your email: ";
    cin >> email;

    cout << "Enter your username: ";
    cin >> userId;

    while(true) {
        cout << "Enter your phone number: ";
        cin >> phone;
        
        if(phone.length() == 10)
            break;
        
        cout << "Phone number must be 10 digits long. Try again!\n";
    }

    cout << "Enter your password: ";
    cin >> password;

    ifstream read("members.txt");

    while(read >> id >> emailId >> phoneNum >> pass) {
        if (userId == id && email == emailId && phone == phoneNum && password == pass) {
            exists = true;
            cout << "Username already exists!\n";
            return;
        }
        else if (email == emailId) {
            exists = true;
            cout << "Email already exists!\n";
            return;
        }
        else if (phone == phoneNum) {
            exists = true;
            cout << "Phone number already exists!\n";
            return;
        }
    }

    read.close();

    id = userId;
    emailId = email;
    phoneNum = phone;
    pass = password;       

    ofstream write("members.txt", ios::app);
    write << id << " " << emailId << " " << phoneNum << " " << pass << endl;
    
    cout << "Account created successfully!\n";

    write.close();
   
}