#pragma once

#include <pqxx/pqxx>
#include <memory>
#include <mutex>
using namespace std;



class Database
{
    public:
        static shared_ptr<pqxx::connection> getConnection();

        // libpqxx connections aren't thread-safe, and Crow runs each request
        // on its own thread — every controller method must hold this while
        // it touches the shared connection, or overlapping requests (e.g.
        // rapid double-clicks) can corrupt the connection's protocol state.
        static std::mutex& getMutex();
};