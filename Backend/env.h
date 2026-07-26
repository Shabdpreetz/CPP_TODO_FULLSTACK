#pragma once

#include <fstream>
#include <string>
#include <unordered_map>

class Env {
public:
    static std::unordered_map<std::string, std::string> vars;

    static bool load(const std::string& filename = ".env") {
        std::ifstream file(filename);

        if (!file.is_open())
            return false;

        std::string line;

        while (std::getline(file, line)) {

            if (line.empty() || line[0] == '#')
                continue;

            size_t pos = line.find('=');

            if (pos == std::string::npos)
                continue;

            std::string key = line.substr(0, pos);
            std::string value = line.substr(pos + 1);

            vars[key] = value;
        }

        return true;
    }

    static std::string get(const std::string& key) {
        if (vars.find(key) != vars.end())
            return vars[key];

        return "";
    }
};

inline std::unordered_map<std::string, std::string> Env::vars;