#include <iostream>
#include <string>
#include "functions.h"

using namespace std;

int main() {

    string member{"john doe"},
        userId,
        password,
        yn{""};

    cout << "\t--------------       Welcome to the Library!       --------------\n";
    cout << "\t               Do you have an account with us?(y/n) ";
    cin >> yn;
    cout << "\n";
    
    if (yn == "n" || yn == "N") {
        create_account();
    }
    else {
        cout << "Welcome " << member << "! ";
    }

    return 0;
}