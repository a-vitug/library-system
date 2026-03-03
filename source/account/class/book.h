#ifndef BOOK_H
#define BOOK_H

#include <iostream>
#include <string>
#include <vector>

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

class Manager : public User {
   public:
       Manager() : employeeId(9) { int role = 1; };
       void create_employee();
       
   protected:
       int employeeId;
       int sales() { return 0; };
};

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

#endif