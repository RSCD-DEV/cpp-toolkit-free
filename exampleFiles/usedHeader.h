#ifndef USED_H
#define USED_H

// Symbole, die aber in main.cpp NICHT benutzt werden
const int USED_CONSTANT = 123;

struct UsedStruct {
    int x;
    void doSomething();
};

void usedFunction();

#endif // USED_H
