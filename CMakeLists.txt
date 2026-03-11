cmake_minimum_required(VERSION 3.15)
project(LibrarySystem LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Crow CONFIG REQUIRED)

add_executable(LibraryApp 
    source/account/client.cc
    source/account/class/book.cc
    source/account/routes.cc
)

target_link_libraries(LibraryApp PRIVATE Crow::Crow)

target_precompile_headers(LibraryApp PRIVATE <crow.h>)

target_include_directories(LibraryApp PRIVATE 
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/source/account
)

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/front-end DESTINATION ${CMAKE_CURRENT_BINARY_DIR})