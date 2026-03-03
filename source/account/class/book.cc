#include <iostream>
#include <string>
#include <vector>
#include <cctype>
#include <fstream>

using namespace std;

// ------------------------------ INDEPENDENT CLASS  ------------------------------
class Book {
    public:
        string title;
        string author;
        string isbn;
        string genre;
        int bookId;
        bool isAvailable;
        Book() : bookId(0), isAvailable(true) {};
};

// ------------------------------ PARENT CLASS  ------------------------------
class User {
    public:
        User()  : userId(-1), role(-1) {};
        User(int newUserId) : userId(newUserId), role(0) {};


        void setName(string newName) { name = newName; };
        string getName() { return name; };


        void setEmail(string newEmail) { email = newEmail; };
        string getEmail() { return email; };


        void setPassword(string newPass) { password = newPass; };
        string getPassword() { return password; };


        void setRole(int newRole) { role = newRole; };
        int getRole() { return role; };


        bool login();


        /*
            void updateProfile();
            bool login();
            void logout();
        */
  
    protected:
        string name;
        string email;
        string password;
        int role;
        int userId;
};

// ------------------------------ CHILDREN CLASS  ------------------------------

/*
class Manager : public User {
   public:
       Manager() { int role = 1; };

   protected:
       int employeeId;
       int sales() { return 0; };
};
*/

class Librarian : public User {
    public:
        Librarian() : employeeId(0) { role = 2;};
        void setLibrarianId(int newEmployeeId) { employeeId = newEmployeeId; };
        int getLibrarianId() const { return employeeId; };

    private:
        int employeeId;
};

class Member : public User {
    public:
        int phone;
        vector<string> favorites;
        Member() { role = 3; };
        void create_account();

    private:
        double balance;
        
        void setBalance(int newBalance) { balance = newBalance; };
        double getBalance() { return balance; };

        //void setBooksCurrCheckedOut(int newBooks) {}
        /*
            string getBooksCurrCheckedOut() {};
            int getCurrBooksCheckecOut() {};
            int penalty() {};
        */
};

void Member::create_account() {
    string name, email, userId, phone, password;
    string nameId, emailId, id, phoneNum, pass, yn;
    bool exists = false;

    cout << "\t               REGISTER ACCOUNT\n";

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
};

bool User::login() {
    string name, email, userId, phone, password, emp;
    string nameId, emailId, id, phoneNum, pass, empId, yn;

    bool member = false, employee = false, found = false;
    int acc;

    cout << "\t               LOGIN\n";
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
                        return false;
                    }               
                }
            }
            break;

        case 2:
            employee = true;

            for(int i = 5; i > 0; i--){
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
                        return false;
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
   return true;
}