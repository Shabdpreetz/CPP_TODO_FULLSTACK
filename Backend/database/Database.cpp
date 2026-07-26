#include "Database.h"
#include "../env.h"
using namespace std;

std::shared_ptr<pqxx::connection> Database::getConnection()
{
    static shared_ptr<pqxx::connection> conn = nullptr;

    if (!conn)
    {
        conn = std::make_shared<pqxx::connection>(
            Env::get("DATABASE_URL")
        );
    }

    return conn;
}