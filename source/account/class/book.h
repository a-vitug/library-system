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
        User()  : role(-1) {}
        User(const string& newId) : id(newId), role(-1) {}

        void setName(const string& newName) { name = newName; };
        string getName() const { return name; };

        void setEmail(const string& newEmail) { email = newEmail; };
        string getEmail() const { return email; };

        void setPassword(const string& newPass) { password = newPass; };
        string getPassword() const { return password; };

        void setRole(int newRole) { role = newRole; };
        int getRole() { return role; };

        void setId(const string& newId) { id = newId; };
        string getId() const { return id; };

        void setPhone(const string& newPhone) { phone = newPhone; };
        string getPhone() const { return phone; };

        virtual bool login();
        virtual bool web_login(int role, string inputId, string inputPass);

        virtual ~User() = default;
        /*
            void updateProfile();
            bool login();
            void logout();
        */
  
    protected:
        string name, email, password, id, phone;
        int role;
};

// ------------------------------ CHILDREN CLASS  ------------------------------

class Manager : public User {
    public:
        Manager() { 
            role = 1;
            id = "MGR0000";
        };

        string getManagerId() const { return managerId; };
        void setManagerId(const string& newManagerId) { managerId = newManagerId; };

        void create_employee();
        void create_manager();
        void access_manager(const string& name, const string& managerId);
    private:
        string managerId;
        /*
            Sales();
            void addBook(int bookId) {};
            int getBook() const { return bookId; };
            void setBook(int newBookId) { bookId = newBookId; };
        */
};

class Librarian : public User {
    public:
        Librarian() { 
            role = 2;
            id = "EMP0000";
        };

        void setEmployeeId(const string& newEmployeeId) { employeeId = newEmployeeId; };
        string getEmployeeId() const { return employeeId; };

        void access_librarian(const string& name, const string& employeeId);
        void pCheckout_book();
        void pReturn_book();

    private:
        string employeeId;
};

class Member : public User {
    public:
        Member() { 
            role = 3; 
            id = "username";
        };

        void create_account();
        void access_member(const string& name, const string& memberId);
        void checkout_book();
        void return_book();

        void setLoanedBook(string newLoanedBook) { loanedBooks = newLoanedBook; };
        string getLoanedBook() const { return loanedBooks; };

        void setBalance(double newBalance) { balance = newBalance; };
        double getBalance() { return balance; };

        void setMemberId(const string& newMemberId) { memberId = newMemberId; };
        string getMemberId() const { return memberId; };

        void genMemberId();

        vector<string> favorites;
        string loanedBooks, memberId;

    private:
        double balance{0.0};

        //void setBooksCurrCheckedOut(int newBooks) {}
        /*
            string getBooksCurrCheckedOut() {};
            int getCurrBooksCheckecOut() {};
            int penalty() {};
        */
};

#endif