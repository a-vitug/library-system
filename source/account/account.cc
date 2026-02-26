#include <iostream>
#include <string>
#include "functions.h"

using namespace std;

int main() {

    string userId, password, yn;

    cout << "\t--------------       Welcome to the Library!       --------------\n";
    cout << "\t               Do you have an account with us?(y/n) ";
    cin >> yn;

    cin.ignore();
    
    if (yn == "n" || yn == "N") {
        create_account();
    }
    else {
        login();
    }

    return 0;
}