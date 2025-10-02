#ifndef UNUSED_H
#define UNUSED_H

// Symbole, die aber in main.cpp NICHT benutzt werden
const int UNUSED_CONSTANT = 123;

struct UnusedStruct {
    int x;
    void doSomething();
};

void unusedFunction();

#endif // UNUSED_H
