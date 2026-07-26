#pragma once

#include <crow.h>
#include "crow/middlewares/cors.h"

void registerTodoRoutes(crow::App<crow::CORSHandler>& app);