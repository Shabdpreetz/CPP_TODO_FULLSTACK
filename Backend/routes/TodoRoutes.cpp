#include "TodoRoutes.h"
#include "../controllers/TodoController.h"

#ifdef DELETE
#undef DELETE
#endif

void registerTodoRoutes(crow::SimpleApp& app)
{
    // GET ALL
    CROW_ROUTE(app, "/todos")
        .methods(crow::HTTPMethod::GET)
    ([]()
    {
        return TodoController::getAllTodos();
    });

    // CREATE
    CROW_ROUTE(app, "/todos")
        .methods(crow::HTTPMethod::POST)
    ([](const crow::request& req)
    {
        return TodoController::createTodo(req);
    });

    // GET BY ID
    CROW_ROUTE(app, "/todos/<int>")
         .methods(crow::HTTPMethod::GET)
    ([](int id)
   {
    return TodoController::getTodoById(id);
   });

    // UPDATE
    CROW_ROUTE(app, "/todos/<int>")
        .methods(crow::HTTPMethod::PUT)
    ([](const crow::request& req, int id)
    {
        return TodoController::updateTodo(req, id);
    });

    // DELETE
    CROW_ROUTE(app, "/todos/<int>")
        .methods(crow::HTTPMethod::DELETE)
    ([](int id)
    {
        return TodoController::deleteTodo(id);
    });

    // TOGGLE
    CROW_ROUTE(app, "/todos/<int>/toggle")
        .methods(crow::HTTPMethod::PATCH)
    ([](int id)
    {
        return TodoController::toggleTodo(id);
    });
}




