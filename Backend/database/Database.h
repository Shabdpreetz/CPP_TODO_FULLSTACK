#pragma once

#include <pqxx/pqxx>
#include <memory>
using namespace std;



class Database
{
    public:
        static shared_ptr<pqxx::connection> getConnection();
};