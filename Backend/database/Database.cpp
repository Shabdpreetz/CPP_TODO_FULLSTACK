#include "Database.h"
#include "../env.h"
using namespace std;

std::shared_ptr<pqxx::connection> Database::getConnection()
{
    // Not locked here: every call site already holds Database::getMutex()
    // for the whole request (see TodoController), and std::mutex isn't
    // reentrant, so locking again here would deadlock the calling thread.
    static shared_ptr<pqxx::connection> conn = nullptr;

    if (!conn)
    {
        conn = std::make_shared<pqxx::connection>(
            Env::get("DATABASE_URL")
        );
    }

    return conn;
}

std::mutex& Database::getMutex()
{
    static std::mutex mutex;
    return mutex;
}