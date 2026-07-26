#include <crow.h>
#include <iostream>

#include "crow/middlewares/cors.h"
#include "env.h"
#include "database/Database.h"
#include "routes/TodoRoutes.h"

using namespace std;

int main()
{
    // =========================
    // Load Environment Variables
    // =========================
    if (!Env::load())
    {
        cerr << "❌ Failed to load .env file." << endl;
        return 1;
    }

    // =========================
    // Connect to NeonDB
    // =========================
    try
    {
        auto conn = Database::getConnection();

        if (!conn || !conn->is_open())
        {
            cerr << "❌ Failed to connect to NeonDB." << endl;
            return 1;
        }

        cout << "✅ Connected to NeonDB Successfully!" << endl;

        pqxx::work tx(*conn);

        auto result = tx.exec("SELECT version();");

        cout << "PostgreSQL Version:" << endl;
        cout << result[0][0].c_str() << endl;

        tx.commit();
    }
    catch (const exception &e)
    {
        cerr << "Database Error: " << e.what() << endl;
        return 1;
    }

    // =========================
    // Crow Web Server
    // =========================
    crow::App<crow::CORSHandler> app;

    // Allow the Next.js dev server to call this API from the browser
    auto& cors = app.get_middleware<crow::CORSHandler>();
    cors
        .global()
        .origin("http://localhost:3000")
        .methods("GET"_method, "POST"_method, "PUT"_method, "DELETE"_method, "PATCH"_method, "OPTIONS"_method)
        .headers("Content-Type")
        .max_age(3600);

    // Home Route
    CROW_ROUTE(app, "/")([]()
    {
        return "🚀 Todo Backend is Running!";
    });

    // Register Todo Routes
    registerTodoRoutes(app);

    cout << "===================================" << endl;
    cout << "🚀 Server Started Successfully" << endl;
    cout << "🌐 http://localhost:18080 || Railway port" << endl;
    cout << "===================================" << endl;

    // app.port(18080).multithreaded().run();


    int port = 18080;

    const char* railwayPort = std::getenv("PORT");

    if (railwayPort)
    {
        port = std::stoi(railwayPort);
    }

    app.port(port).multithreaded().run();

    return 0;
}