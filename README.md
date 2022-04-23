# TraineR

An online training and quiz system for pediatric fundus image reading, maily concerning ROP (Retinopathy of Prematurity). It aims to help inexperienced medical staff to quickly master image labeling tasks for fundus image-based AI.     

An online demo: http://trainer.zhangys.org.cn

Frontend:   
<img src="front.jpg">

Backend:   
<img src="back.jpg">


You can also build your own test bank for other general-purposed image reading and labeling tasks.  

# Build

1. git clone https://github.com/zhangys11/TraineR.git
2. Use Visual Studio 2019 to open System.App.Web.TraineR.sln. Open it as an ASP.net MVC web site.
3. Visual Studio will automatically download and install necessary nuget packages.
4. Build and Run

# Deploy

1. In Visual Studio, publish the project to a local folder.
2. Deploy the folder in IIS 7. Use a .Net 4 application pool.

# Docker

1. `docker pull zhangyinsheng/trainer:latest`  
2. `docker run --name trainer -p 8000:80 zhangyinsheng/trainer:latest`  
3. You can now access http://localhost:8000
