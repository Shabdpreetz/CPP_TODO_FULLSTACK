#include "TodoController.h"
#include "../database/Database.h"
using namespace std;



crow::response TodoController::getAllTodos()
{
    try
    {
        auto conn = Database::getConnection();

        pqxx::work tx(*conn);

        auto result = tx.exec(
            "SELECT id, title, completed, created_at FROM todos ORDER BY id;"
        );

        crow::json::wvalue json;

        // Create an array
        json["todos"] = crow::json::wvalue::list(result.size());

        int index = 0;

        for (const auto& row : result)
        {
            json["todos"][index]["id"] = row["id"].as<int>();
            json["todos"][index]["title"] = row["title"].c_str();
            json["todos"][index]["completed"] = row["completed"].as<bool>();
            json["todos"][index]["created_at"] = row["created_at"].c_str();

            index++;
        }

        return crow::response(json);
    }
    catch (const std::exception &e)
    {
        return crow::response(500, e.what());
    }
}




crow::response TodoController::createTodo(const crow::request& req)
{
    try
    {
        auto body = crow::json::load(req.body);

        if (!body)
        {
            return crow::response(400, "Invalid JSON");
        }

        if (!body.has("title"))
        {
            return crow::response(400, "Title is required");
        }

        std::string title = body["title"].s();

        auto conn = Database::getConnection();

        // Create transaction (YOU WERE MISSING THIS)
        pqxx::work tx(*conn);

        auto result = tx.exec_params(
            R"(
                INSERT INTO todos(title)
                VALUES($1)
                RETURNING id, title, completed, created_at;
            )",
            title
        );

        tx.commit();

        crow::json::wvalue json;

        json["id"] = result[0]["id"].c_str();
        json["title"] = result[0]["title"].c_str();
        json["completed"] = std::string(result[0]["completed"].c_str()) == "t";
        json["created_at"] = result[0]["created_at"].c_str();

        return crow::response(201, json);
    }
    catch (const std::exception& e)
    {
        return crow::response(500, e.what());
    }
}




crow::response TodoController::getTodoById(int id)
{
    try
    {
        auto conn = Database::getConnection();

        pqxx::work tx(*conn);

        auto result = tx.exec_params(
            R"(
                SELECT id,title,completed,created_at
                FROM todos
                WHERE id=$1;
            )",
            id
        );

        if(result.empty())
        {
            return crow::response(404,"Todo not found");
        }

        crow::json::wvalue json;

        json["id"] = result[0]["id"].as<int>();
        json["title"] = result[0]["title"].c_str();
        json["completed"] = result[0]["completed"].as<bool>();
        json["created_at"] = result[0]["created_at"].c_str();

        return crow::response(json);
    }
    catch(const std::exception& e)
    {
        return crow::response(500,e.what());
    }
}








crow::response TodoController::updateTodo(
    const crow::request& req,
    int id)
{
    try
    {
        auto body = crow::json::load(req.body);

        if (!body)
            return crow::response(400, "Invalid JSON");

        std::string title = body["title"].s();

        auto conn = Database::getConnection();

        pqxx::work tx(*conn);

        auto result = tx.exec_params(
            R"(
                UPDATE todos
                SET title=$1
                WHERE id=$2
                RETURNING id,title,completed,created_at;
            )",
            title,
            id
        );

        tx.commit();

        if (result.empty())
            return crow::response(404, "Todo not found");

        crow::json::wvalue json;

        json["id"] = result[0]["id"].as<int>();
        json["title"] = result[0]["title"].c_str();
        json["completed"] = result[0]["completed"].as<bool>();
        json["created_at"] = result[0]["created_at"].c_str();

        return crow::response(json);
    }
    catch (const std::exception& e)
    {
        return crow::response(500, e.what());
    }
}




crow::response TodoController::deleteTodo(int id)
{
    try
    {
        auto conn = Database::getConnection();

        pqxx::work tx(*conn);

        auto result = tx.exec_params(
            "DELETE FROM todos WHERE id=$1 RETURNING id;",
            id
        );

        tx.commit();

        if (result.empty())
            return crow::response(404, "Todo not found");

        crow::json::wvalue json;

        json["message"] = "Todo deleted";

        return crow::response(json);
    }
    catch (const std::exception& e)
    {
        return crow::response(500, e.what());
    }
}





crow::response TodoController::toggleTodo(int id)
{
    try
    {
        auto conn = Database::getConnection();

        pqxx::work tx(*conn);

        auto result = tx.exec_params(
            R"(
                UPDATE todos
                SET completed = NOT completed
                WHERE id=$1
                RETURNING id,title,completed,created_at;
            )",
            id
        );

        tx.commit();

        if (result.empty())
            return crow::response(404, "Todo not found");

        crow::json::wvalue json;

        json["id"] = result[0]["id"].as<int>();
        json["title"] = result[0]["title"].c_str();
        json["completed"] = result[0]["completed"].as<bool>();
        json["created_at"] = result[0]["created_at"].c_str();

        return crow::response(json);
    }
    catch (const std::exception& e)
    {
        return crow::response(500, e.what());
    }
}



