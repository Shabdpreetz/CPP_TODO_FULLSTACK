cmake_minimum_required(VERSION 3.20)

project(TodoBackend)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

# ===================================
# Crow
# ===================================
FetchContent_Declare(
    Crow
    GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
    GIT_TAG master
)

FetchContent_MakeAvailable(Crow)

# ===================================
# libpqxx
# ===================================
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBPQXX REQUIRED libpqxx)

# ===================================
# Executable
# ===================================
add_executable(TodoBackend
    main.cpp
    database/Database.cpp
    controllers/TodoController.cpp
    routes/TodoRoutes.cpp
)

target_include_directories(TodoBackend PRIVATE
    ${LIBPQXX_INCLUDE_DIRS}
)

target_link_directories(TodoBackend PRIVATE
    ${LIBPQXX_LIBRARY_DIRS}
)

target_compile_options(TodoBackend PRIVATE
    ${LIBPQXX_CFLAGS_OTHER}
)

# ===================================
# Link Libraries
# ===================================
# ===================================
# Link Libraries
# ===================================
target_link_libraries(TodoBackend PRIVATE
    Crow::Crow
    ${LIBPQXX_LIBRARIES}
)

# Windows-only networking libraries
if(WIN32)
    target_link_libraries(TodoBackend PRIVATE
        ws2_32
        mswsock
    )
endif()