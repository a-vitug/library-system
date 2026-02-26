#include <iostream>
#include <fstream>
#include <string>
#include <cctype>
#include "functions.h"

using namespace std;

void create_account() {
    string name, email, userId, phone, password;
    string nameId, emailId, id, phoneNum, pass, yn;
    bool exists = false;

    cout << "\t               Register account\n";

    cout << "Enter your name: ";
    getline(cin, name);

    cout << "Enter your email: ";
    cin >> email;

    cout << "Enter your username: ";
    cin >> userId;

    while(true) {
        cout << "Enter your phone number: ";
        cin >> phone;
        
        if(phone.length() == 10) break;
        
        cout << "Phone number must be 10 digits long. Try again!\n";
    }

    cout << "Enter your password: ";
    cin >> password; 
    
    ifstream read("members.txt");
    if(read) {
        while(read >> nameId >> id >> emailId >> phoneNum >> pass) {
            if (userId == id) {
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
    }  

    ofstream write("members.txt", ios::app);
    if(write){
        write << name << "|" << userId << "|" << email << "|" << phone << "|" << password << endl;    

        cout << "Account created successfully!\n"; 

        read.close();
        write.close();
        login();    
    }
    //access member page or go to login page

}