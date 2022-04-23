# TraineR

An online training and quiz system for pediatric fundus image reading, maily concerning ROP (Retinopathy of Prematurity).  
It also aims to create a crowd-sourcing curating platform for fundus image-based AI.

# Build

1. git clone https://github.com/zhangys11/TraineR.git
2. Use Visual Studio 2019 to open System.App.Web.TraineR.sln. Open it as an ASP.net MVC web site.
3. Visual Studio will automatically download and install necessary nuget packages.
4. Build and Run

# Deploy

1. In Visual Studio, publish the project to a local folder.
2. Deploy the folder in IIS 7. Use a .Net 4 application pool.

# Docker

`docker pull zhangyinsheng/trainer:latest`  
`docker run --name trainer -p 8000:80 zhangyinsheng/trainer:latest`  
You can access http://localhost:8000

