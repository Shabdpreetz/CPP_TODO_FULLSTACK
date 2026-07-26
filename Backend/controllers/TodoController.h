#pragma once

#include <crow.h>

class TodoController
{
public:
    static crow::response getAllTodos();

     static crow::response getTodoById(int id);


    static crow::response createTodo(const crow::request& req);


     static crow::response updateTodo(
        const crow::request& req,
        int id
    );

    static crow::response deleteTodo(int id);

    static crow::response toggleTodo(int id);

};